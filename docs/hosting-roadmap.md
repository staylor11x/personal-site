# HOSTING_ROADMAP_SEED.md

# Personal Website Hosting & Infrastructure Plan

## Project Goal

Build and host a personal retro-futurist software engineering website while learning practical Google Cloud Platform (GCP) skills.

The infrastructure should be:
- cheap
- modern
- maintainable
- production-like
- low vendor lock-in
- educational

This is NOT intended to become:
- enterprise infrastructure
- Kubernetes-heavy
- microservice-heavy
- over-engineered

The architecture should remain intentionally lightweight.

---

# High Level Architecture

```text
Domain Name
     |
Cloudflare DNS + CDN
     |
Frontend (Next.js Static Export)
     |
Google Cloud Storage Bucket
     |
Cloud CDN (optional future enhancement)

Backend Features
     |
Cloud Run Container
     |
Spotify API / Future APIs
```

---

# Core Technology Decisions

## Frontend

### Stack
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion

### Deployment Strategy
Use:
```bash
next export
```

to generate a fully static site.
s
The frontend should:
- remain mostly static
- avoid unnecessary SSR complexity
- be CDN friendly
- deploy cheaply

---

# Frontend Hosting

## Hosting Platform
Google Cloud Storage (GCS)

## Why
Chosen because it:
- teaches core GCP concepts
- is extremely cheap
- scales automatically
- is production-grade
- supports static hosting well

## Future Enhancements
Optional:
- Cloud CDN
- caching headers
- edge optimization

---

# Backend

## Purpose

The backend exists ONLY for:
- Spotify API integration
- secure token handling
- future dynamic APIs
- optional terminal functionality
- experimental features

The backend should remain:
- lightweight
- containerized
- portable

Avoid:
- unnecessary databases
- unnecessary authentication systems
- unnecessary microservices

---

# Backend Stack

## Language
C++

## Framework Options
Preferred:
- Drogon

Alternative:
- Crow

## Deployment
Docker container deployed to:
- Google Cloud Run

---

# Why Cloud Run

Cloud Run provides:
- serverless containers
- HTTPS by default
- automatic scaling
- minimal maintenance
- excellent free tier
- modern container workflows

This is the primary GCP learning target.

---

# Domain & DNS

## Domain
Bring custom domain.

Potential TLDs:
- .dev
- .io
- .me

---

# DNS Provider

## Cloudflare

Cloudflare should manage:
- DNS
- SSL
- CDN
- caching
- protection

Reasons:
- excellent free tier
- minimal setup pain
- widely used professionally
- low lock-in

---

# CI/CD

## Platform
GitHub Actions

---

# Frontend Deployment Pipeline

On push to main:
1. build Next.js static site
2. generate static export
3. upload to GCS bucket
4. invalidate cache if required

---

# Backend Deployment Pipeline

On push to main:
1. build Docker image
2. push image to Artifact Registry
3. deploy to Cloud Run

---

# Authentication & Secrets

## Use GCP Secret Manager

Store:
- Spotify API secrets
- refresh tokens
- API keys

Never store secrets:
- in frontend code
- in GitHub
- in client-side JavaScript

---

# Spotify Integration Architecture

```text
Frontend
   |
Cloud Run API
   |
Spotify API
```

The frontend never talks directly to Spotify with secrets.

Cloud Run handles:
- token refresh
- secure requests
- API abstraction

---

# Travel Globe Architecture

The travel globe should initially be:
- frontend-only
- data-driven
- static JSON powered

Example:
```json
[
  {
    "country": "Japan",
    "year": 2024,
    "lat": 35.6,
    "lng": 139.6
  }
]
```

No backend required initially.

---

# Cost Goals

## Target
Keep recurring infrastructure costs near-zero.

---

# Expected Costs

## Domain
~£8–15/year

## Cloudflare
Free tier

## GCS Hosting
Likely pennies/month

## Cloud Run
Likely free tier for low traffic

---

# Vendor Lock-In Strategy

## Frontend
Static export keeps hosting portable.

Can move easily to:
- AWS
- Azure
- Cloudflare Pages
- Netlify
- self-hosting

---

# Backend
Use:
- Docker
- standard HTTP APIs

This keeps backend portable between:
- Cloud Run
- AWS ECS
- DigitalOcean
- VPS hosting
- Kubernetes

---

# Explicit Non-Goals

Avoid:
- Kubernetes initially
- managed SQL databases
- Terraform initially
- service mesh
- excessive GCP products
- event-driven complexity
- enterprise architecture patterns

The goal is:
- learning
- simplicity
- maintainability
- strong engineering fundamentals

---

# GCP Learning Objectives

This project should teach:
- Cloud Run
- Docker workflows
- container registries
- GCS hosting
- IAM basics
- DNS & SSL
- CDN concepts
- CI/CD pipelines
- secrets management
- production deployment workflows

---

# Suggested Initial Roadmap

## Phase 1 — Frontend Hosting
- create GCP account
- create GCS bucket
- deploy static site
- connect custom domain
- configure HTTPS
- configure Cloudflare DNS

---

## Phase 2 — Backend Foundations
- create Dockerized C++ API
- deploy to Cloud Run
- expose REST endpoints
- connect frontend to backend

---

## Phase 3 — Spotify Integration
- create Spotify developer app
- implement OAuth/token refresh
- store secrets in Secret Manager
- display currently playing music

---

## Phase 4 — CI/CD
- GitHub Actions pipelines
- automatic frontend deployment
- automatic backend deployment

---

## Phase 5 — Enhancements
Optional:
- Cloud CDN
- analytics
- monitoring
- logging
- custom caching
- globe data enhancements
- realtime features

---

# Final Design Principle

The infrastructure should feel:
- intentional
- elegant
- modern
- lightweight

The project should demonstrate:
- good engineering judgement
- modern cloud understanding
- clean architecture
- technical curiosity

Avoid unnecessary complexity at all costs.