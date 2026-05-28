# Documentation registry

> **Version:** 1.0
> **Status:** Living document — updated whenever a living document is created, modified, or removed
> **Related:** [Architecture](architecture.md)

The authoritative index of every living document in the repository. Update this file in every PR that creates, modifies, or removes a document: increment the version, update the last-verified date, add new rows, and remove deleted rows.

---

| Document | Covers | Version | Last verified | Update trigger |
|---|---|---|---|---|
| [docs/architecture.md](architecture.md) | Hosting architecture, tech stack, cost profile, phased rollout | 1.0 | 2026-05-28 | Architecture or stack changes |
| [docs/ci-cd-pipeline.md](ci-cd-pipeline.md) | GitHub Actions deploy workflow, OIDC/WIF auth, GCS sync | 1.0 | 2026-05-28 | Workflow or auth configuration changes |
| [docs/hosting-setup.md](hosting-setup.md) | GCS bucket setup, Cloudflare DNS, redirect rules, HTTPS | 1.0 | 2026-05-28 | Hosting infrastructure changes |
| [docs/implementation-phases.md](implementation-phases.md) | Phase-by-phase delivery plan and MVP boundary | 1.0 | 2026-05-28 | Scope, phase order, or exit criteria change |
| [docs/style-guide.md](style-guide.md) | Design identity, color tokens, typography, component conventions | 1.0 | 2026-05-28 | Design system or component conventions change |
| [docs/templates/issue-template.md](templates/issue-template.md) | Required structure for agent-targeted GitHub issues | 1.0 | 2026-05-28 | Issue conventions change |
| [README.md](../README.md) | Repository overview and quick-start | — | — | Project purpose or setup steps change |

