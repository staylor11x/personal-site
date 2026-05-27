# High-Level Design: Hosting & Infrastructure

> A lightweight, portable, production-grade setup built for learning GCP while keeping costs near zero.

---

## At a Glance

| Concern | Solution |
|---|---|
| Frontend hosting | Google Cloud Storage (static export) |
| Backend / API | Google Cloud Run (Docker container) |
| Language (backend) | C++ (Drogon or Crow) |
| DNS & CDN | Cloudflare (free tier) |
| Secrets | GCP Secret Manager |
| CI/CD | GitHub Actions |
| Spotify integration | Cloud Run proxy (never direct from browser) |

---

## Architecture Overview

```
Browser
  └── Cloudflare DNS + CDN + SSL
        ├── Frontend  →  Google Cloud Storage (static HTML/JS/CSS)
        └── API calls →  Google Cloud Run (C++ container)
                              └── Spotify API
```


![Platform architecture diagram](./diagrams/hosting-architecture.drawio.png)
> Diagram source: [`docs/diagrams/hosting-architecture.drawio`](./diagrams/hosting-architecture.drawio). Update and re-export when the architecture changes. Version the exported PNG alongside the source file.

---

## Frontend

- **Framework:** Next.js with TypeScript and Tailwind CSS
- **Build:** `next export` produces a fully static site (no SSR at runtime)
- **Hosting:** GCS bucket configured for static website hosting
- **Why static?** Cheap, CDN-friendly, and portable — can move to any host with no code changes

---

## Backend

- **Purpose:** Exists only to proxy secrets-bearing API calls (Spotify, future integrations)
- **Language:** C++ using Drogon (preferred) or Crow
- **Deployment:** Docker image → Google Artifact Registry → Cloud Run
- **Why Cloud Run?** Serverless containers with HTTPS out of the box, generous free tier, scales to zero

The backend is intentionally minimal. No database, no auth system, no microservices.

---

## Spotify Integration

```
Browser  →  Cloud Run API  →  Spotify API
```

- The frontend never holds Spotify credentials
- Cloud Run handles OAuth token refresh and secure requests
- Secrets stored in GCP Secret Manager, injected at runtime

---

## DNS & CDN

- **Cloudflare** manages DNS, SSL termination, and CDN caching
- No lock-in: DNS records point to GCS/Cloud Run and can be repointed to any host

---

## CI/CD Pipelines (GitHub Actions)

**Frontend on push to `main`:**
1. Build Next.js static export
2. Upload artefacts to GCS bucket
3. Invalidate CDN cache if needed

**Backend on push to `main`:**
1. Build Docker image
2. Push to GCP Artifact Registry
3. Deploy new revision to Cloud Run

---

## Cost Profile

| Resource | Expected Cost |
|---|---|
| Domain | ~£8–15/year |
| Cloudflare | Free |
| GCS hosting | Pennies/month |
| Cloud Run | Free tier for low traffic |
| **Total** | **< £20/year** |

---

## Portability

The architecture is intentionally portable:

- **Frontend:** Static files move to Netlify, Cloudflare Pages, AWS S3, or any CDN with zero code changes
- **Backend:** Standard Docker container runs on AWS ECS, DigitalOcean, a plain VPS, or any container host

---

## Phased Rollout

| Phase | Goal |
|---|---|
| **1** | Frontend hosted on GCS, custom domain, Cloudflare DNS + HTTPS |
| **2** | Dockerised C++ API deployed to Cloud Run |
| **3** | Spotify integration via Cloud Run + Secret Manager |
| **4** | GitHub Actions CI/CD for both frontend and backend |
| **5** | Optional: Cloud CDN, monitoring, analytics, globe enhancements |

---

## What This Is Not

- Not Kubernetes
- Not a managed database
- Not microservices
- Not Terraform (initially)

The goal is clean engineering fundamentals, not enterprise architecture.
