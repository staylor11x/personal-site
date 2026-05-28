> **Status:** Accepted
> **Date:** 2026-05-28
> **Related:** [Architecture](../architecture.md) | [CI/CD pipeline](../ci-cd-pipeline.md)

# ADR-001: C++ (Drogon) on Cloud Run for the Spotify proxy backend

## Context

The frontend is a fully static Next.js export hosted on GCS. The `output: "export"` configuration produces static HTML/CSS/JS only — Next.js Route Handlers do not execute at runtime in this mode. Any server-side logic therefore requires a separate service.

The immediate use case is a Spotify "now playing" proxy. The Spotify API requires OAuth credentials that cannot be exposed to the browser. The proxy needs to:

1. Read a stored refresh token from GCP Secret Manager
2. Exchange it for a short-lived access token via Spotify's token endpoint
3. Call Spotify's `/me/player/currently-playing` endpoint
4. Return the result to the browser

The broader use case includes future integrations (travel APIs, websocket features, experimental command processing) that may also require a server-side component.

## Options considered

| Option | Notes |
|---|---|
| Cloud Functions (Node.js) | Simplest setup. No container build step. Limited to single-purpose functions. |
| Cloud Run (Node.js) | Container-based. More flexible than Functions. Familiar ecosystem. |
| Cloud Run — multi-container sidecar (nginx + C++) | Single Cloud Run service; nginx is the ingress, C++ runs as a sidecar on localhost and is not publicly routable. |
| Cloud Run (C++ / Drogon) | Separate public service. Container-based. High performance. Build complexity is higher. Unconventional for web backends. |

## Decision

The backend uses **C++ with the Drogon framework** deployed as a Docker container on **Google Cloud Run**.

## Rationale

**The concerns typically raised against C++ web backends do not apply here.**

*Cost and DDoS exposure* are mitigated by Cloud Run's `--max-instances` setting, which hard-caps horizontal scaling regardless of request volume. Combined with Cloudflare sitting in front of the API subdomain (`api.scott-taylor11.com`), traffic spikes are absorbed at the CDN layer before reaching the container. At personal-site traffic levels the compute cost stays well within Cloud Run's free tier. C++ executes faster per request than interpreted alternatives, which reduces billed compute time further.

*Performance* is not a concern in the negative sense. Drogon is among the fastest web frameworks across all languages. Cold starts on Cloud Run are 1–3 seconds for a C++ container, which is acceptable for a panel that loads asynchronously after the main page. `--min-instances=1` eliminates cold starts entirely at negligible idle cost if needed.

*Build and iteration complexity* is a one-time overhead. Once the multi-stage Docker build and CI/CD pipeline are established, deploying changes is no different from any other Cloud Run service. The backend scope is intentionally minimal — a proxy with one or two endpoints — so the ongoing maintenance surface is small.

**The multi-container sidecar option was considered and rejected.**

Cloud Run supports running multiple containers in a single service instance: one ingress container receives public traffic, and sidecar containers are only reachable on `localhost` within that instance — they have no public port. The appeal is that the C++ backend would not be directly routable from the internet.

This pattern is rejected for three reasons specific to this project:

1. *Static file serving moves from CDN to compute.* The current architecture serves the frontend from GCS with Cloudflare caching at the edge — zero compute cost, globally distributed. Moving static file serving to nginx on Cloud Run means every page view hits a regional Cloud Run instance. The cost and latency characteristics of object storage for static assets are strictly better.

2. *Cold starts affect the entire page.* In the current split architecture, a C++ cold start delays only the "now playing" panel, which loads asynchronously. In the sidecar model, a cold start on the shared instance delays page delivery entirely, since nginx and C++ are the same scaling unit.

3. *The privacy benefit is marginal here.* The C++ service is publicly routable in the current design, but Cloudflare sits in front of `api.scott-taylor11.com` and `--max-instances` hard-caps scaling exposure. The only endpoint performs a Spotify token exchange, which Spotify rate-limits independently. There is no sensitive internal infrastructure being hidden. The sidecar pattern's routing isolation provides meaningful security benefit when co-locating a public frontend with an internal backend that must not be internet-routable — that constraint does not apply to a Spotify proxy.

**The positive case for C++ is meaningful.**

A minimal Spotify proxy represents the right level of complexity to learn a C++ web framework properly: real HTTP client work, a GCP SDK integration, OAuth token management, and JSON serialisation — without the scope creep of a full application. The project is not time-critical and has no external launch deadline, so iteration speed is not a hard constraint.

Drogon supports coroutines, HTTP/1.1 and HTTP/2, middleware, and has an active maintenance record. It is not a toy framework.

The choice also produces a visible signal on the project itself: a personal site backed by a C++ service demonstrates comfort operating outside the conventional JavaScript/Python web stack, which is consistent with the engineering identity the site aims to project.

## Consequences

- A multi-stage Docker build is required to produce a small production image
- The GCP C++ client library (`google-cloud-cpp`) is added as a dependency for Secret Manager access
- A second GitHub Actions workflow handles backend build, push to Artifact Registry, and Cloud Run deployment
- The Spotify OAuth refresh token is stored once in GCP Secret Manager and never committed to the repository
- Cold start latency is acceptable for asynchronous panel data but should be monitored if user experience degrades
- Future contributors unfamiliar with C++ face a higher onboarding cost for backend changes
