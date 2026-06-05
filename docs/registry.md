# Documentation registry

> **Version:** 1.5
> **Status:** Living document — updated whenever a living document is created, modified, or removed
> **Related:** [Architecture](architecture.md)

The authoritative index of every living document in the repository. Update this file in every PR that creates, modifies, or removes a document: increment the version, update the last-verified date, add new rows, and remove deleted rows.

---

| Document | Covers | Version | Last verified | Update trigger |
|---|---|---|---|---|
| [docs/architecture.md](architecture.md) | Hosting architecture, tech stack, cost profile, phased rollout | 1.0 | 2026-05-28 | Architecture or stack changes |
| [docs/adrs/ADR-001-cpp-cloud-run-backend.md](adrs/ADR-001-cpp-cloud-run-backend.md) | Decision to use C++ (Drogon) on Cloud Run for the Spotify proxy backend | — | 2026-05-28 | Point-in-time — not updated after acceptance |
| [docs/ci-cd-pipeline.md](ci-cd-pipeline.md) | GitHub Actions deploy workflow, OIDC/WIF auth, GCS sync | 1.0 | 2026-05-28 | Workflow or auth configuration changes |
| [docs/hosting-setup.md](hosting-setup.md) | GCS bucket setup, Cloudflare DNS, redirect rules, HTTPS, Cloud Run backend service, Cloudflare Worker routing | 1.2 | 2026-05-31 | Hosting infrastructure changes |
| [docs/implementation-phases.md](implementation-phases.md) | Phase-by-phase delivery plan and MVP boundary | 1.0 | 2026-05-28 | Scope, phase order, or exit criteria change |
| [docs/style-guide.md](style-guide.md) | Design identity, color tokens, typography, component conventions | 1.0 | 2026-05-28 | Design system or component conventions change |
| [docs/templates/adr-template.md](templates/adr-template.md) | Template for new Architecture Decision Records | 1.0 | 2026-05-28 | ADR conventions change |
| [docs/templates/issue-template.md](templates/issue-template.md) | Required structure for agent-targeted GitHub issues | 1.0 | 2026-05-28 | Issue conventions change |
| [backend/SETUP.md](../backend/SETUP.md) | GCP setup, Spotify OAuth flow, Secret Manager provisioning, local dev and Cloud Run deploy steps | 1.0 | 2026-05-31 | GCP project, secrets, SA, or local dev workflow changes |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Local development workflow for the C++ backend (Docker) and Next.js frontend | 1.0 | 2026-05-31 | Dev tooling, build process, or environment variable setup changes |
| [README.md](../README.md) | Repository overview and quick-start | — | — | Project purpose or setup steps change |
| [docs/travel-globe-plan.md](travel-globe-plan.md) | Travel globe feature scope, library choice (react-globe.gl), visual spec, component design, and exit criteria | 2.0 | 2026-06-05 | Scope, library, visual decisions, or exit criteria change |