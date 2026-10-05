# Base44 Development Environment

## App Overview
Kitsune is a Next.js 15 (App Router) anime streaming frontend. It is a pure
client-rendered app that calls external services at runtime:
- `NEXT_PUBLIC_API_URL` — miruro-style anime metadata API (axios baseURL in `src/lib/api.ts`)
- `NEXT_PUBLIC_POCKETBASE_URL` — PocketBase backend for auth/bookmarks (`src/lib/pocketbase.ts`)
- `NEXT_PUBLIC_PROXY_URL` — m3u8 proxy server

None of these services run inside the sandbox; they are external. The dev
server starts and renders pages regardless — data-fetching pages simply show
loading/error states when the upstream services are unreachable.

## Running the app
```
docker compose -f docker-compose.base44.yml up -d
```
- Web entry point: host port 3000 (Next.js dev server, `next dev -H 0.0.0.0`).
- Dependencies install on container startup via `npm install` (bind-mounted source).
- Healthcheck: `GET /api/health` → `{ status: "up and running" }`.
- `next.config.mjs` includes `allowedDevOrigins` built from `BASE44_PUBLIC_HOST_SUFFIX`
  so the preview origin is not blocked by Next.js dev asset/HMR origin checks.

## Build note
The repo's `Dockerfile` runs `next build` for production. A pre-existing bug in
`src/app/global-error.tsx` (importing `next/error`'s default component, which
renders `<Html>` from `next/document` outside `pages/_document`) broke the
`/404` prerender and the entire production build. It was fixed by replacing
that import with a self-contained error UI. Keep `global-error.tsx` free of
`next/error` / `next/document` imports.

## Verification
- `curl http://localhost:3000/` → 200
- `curl http://localhost:3000/anime/<slug>` → 200
- `curl http://localhost:3000/api/health` → 200
- `npx next build` completes with all 7 static pages generated.
