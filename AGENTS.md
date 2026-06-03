# AGENTS.md

## Architecture

- **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS) at the repo root. Configured as a **static export** (`output: "export"` in `next.config.ts`) — deployed to GCS, not Vercel. No server-side rendering at runtime.
- **Backend:** C++ service in `backend/` using Drogon. Deployed as a Docker container to GCP. Currently handles `/health` and `/api/now-playing` (Spotify via Secret Manager).
- **Deployment:** Push to `main` triggers CI. Frontend changes in `app/`, `lib/`, `content/`, `public/` etc. deploy to `www.scott-taylor11.com`. Backend deploys separately via `deploy-backend.yml`.

## Developer commands

```bash
npm install       # install deps (Node >=24 required)
npm run dev       # dev server at http://localhost:3000
npm run build     # production static export → out/
npm run lint      # eslint
```

No test runner is configured yet. Verify by running `npm run build` and checking for TypeScript/lint errors.

## C++ backend — Docker only

**Never attempt native Windows builds.** Use Docker exclusively:

```bash
cd backend
docker build -t personal-site-backend .        # first build: 20-60 min
docker run --rm -p 8080:8080 personal-site-backend

curl -i http://localhost:8080/health            # expect 200 {"status":"ok"}
curl -i http://localhost:8080/api/now-playing   # expect 502 without GCP creds
```

Full integration test requires mounting GCP Application Default Credentials — see `backend/SETUP.md`.

## Key conventions

- Prefer **server components** by default; add `"use client"` only when interaction requires it.
- Static export means **no Next.js API routes at runtime**. The C++ backend at `https://api.scott-taylor11.com` handles dynamic data. Local dev uses `NEXT_PUBLIC_API_URL` for this base URL.
- Keep motion subtle and always respect `prefers-reduced-motion`.
- Follow the phased delivery plan in `docs/implementation-phases.md`. Do not pull Phase 2+ features into Phase 1 work.

## Phase status (as of repo creation)

- **MVP scope:** hero, about, terminal (fixed commands, no backend), featured work/skills, footer, SEO.
- **Deferred:** travel globe, Spotify integration, blog/MDX, setup page, C++ backend expansion.
- Terminal commands for MVP: `help`, `whoami`, `skills`, `stack`, `now`, `travel`, `music`, `github`, `contact` — all deterministic, no backend dependency.

## Existing instruction files

- `.github/instructions/generic.instructions.md` — scoped Copilot instructions; contains UX, engineering, and workflow rules. Read it.
- `docs/implementation-phases.md` — canonical phase plan and MVP boundary.
- `CONTRIBUTING.md` — exact Docker workflow for the C++ backend.
