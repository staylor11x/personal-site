> **Version:** 1.0
> **Status:** Living document — updated when the dev workflow meaningfully changes
> **Related:** [Architecture](docs/architecture.md) | [backend/SETUP.md](backend/SETUP.md)

# Development guide

Audience: the repo owner returning after time away, and AI coding agents executing tasks.

---

## Table of contents

1. [C++ backend](#c-backend)
2. [Next.js frontend](#nextjs-frontend)

---

## C++ backend

**Always use Docker for C++ development.** Do not attempt native Windows builds. The backend depends on Drogon, google-cloud-cpp, libcurl, and jsoncpp — resolving those on Windows is brittle and unnecessary given the production target is a Linux container.

### Build the image

```bash
cd backend
docker build -t personal-site-backend .
```

The first build fetches and compiles Drogon and google-cloud-cpp via CMake FetchContent. Expect 20–60 minutes on a clean cache.

### Run and smoke test

```bash
# Start the container (no credentials needed for the health check)
docker run --rm -p 8080:8080 personal-site-backend

# Verify the health endpoint
curl -i http://localhost:8080/health
# Expected: HTTP 200, {"status":"ok"}

# Verify the now-playing endpoint shape (returns 502 without GCP credentials)
curl -i http://localhost:8080/api/now-playing
# Expected: HTTP 502, {"error":"upstream_failure"}, CORS headers present
```

### Run with GCP credentials (full integration test)

Mount your Application Default Credentials file so the container can reach Secret Manager:

```bash
docker run --rm -p 8080:8080 \
  -v "$HOME/.config/gcloud/application_default_credentials.json:/gcp/adc.json:ro" \
  -e GOOGLE_APPLICATION_CREDENTIALS=/gcp/adc.json \
  personal-site-backend

curl -i http://localhost:8080/api/now-playing
# Expected when a track is playing: HTTP 200, {"playing":true,"title":"...","artist":"...","album":"...","albumArtUrl":"..."}
# Expected when nothing is playing: HTTP 200, {"playing":false}
```

See [backend/SETUP.md](backend/SETUP.md) for GCP project setup, Secret Manager provisioning, and Spotify OAuth steps.

## Next.js frontend

The frontend is a Next.js app at the repository root. To run the development server:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser. The dev server supports hot reload.
