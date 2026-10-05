# Kitsune — Base44 Dev Environment

## Overview

Kitsune is a Next.js 15 anime streaming frontend. It relies on three services:

| Service | Port | Purpose |
|---------|------|---------|
| `web`   | 3000 | Next.js dev server (the app itself) |
| `pocketbase` | 8090 | User auth, comments, bookmarks (PocketBase 0.25.x) |
| `api`   | 8000 | Miruro API — anime metadata & streaming sources (Python/FastAPI) |

## Running

```
docker compose -f docker-compose.base44.yml up -d --build
```

The web service bind-mounts the repo at `/app` and runs `npm install && npm run dev`.
Edits to source files hot-reload automatically.

## Key env vars

- `NEXT_PUBLIC_API_URL` — public URL of the Miruro API (port 8000). Inlined at compile time
  by Next.js (`process.env.NEXT_PUBLIC_API_URL` in `src/lib/api.ts`). Set via compose
  `environment:` using `BASE44_PUBLIC_HOST_SUFFIX`.
- `NEXT_PUBLIC_POCKETBASE_URL` — public URL of PocketBase (port 8090). Read at runtime via
  `next-runtime-env` (`env("NEXT_PUBLIC_POCKETBASE_URL")` in `src/lib/pocketbase.ts`).
- `BASE44_PUBLIC_HOST_SUFFIX` — passed to the web service so `next.config.mjs` can set
  `allowedDevOrigins` for the preview origin.
- `NEXT_PUBLIC_PROXY_URL` — present in `.env` but **not used** in the codebase. The app
  has its own `/api/proxy` route for m3u8 proxying.

## Miruro API (port 8000)

Built from [walterwhite-69/Miruro-API](https://github.com/walterwhite-69/Miruro-API) (cloned
at Docker build time). It scrapes `miruro.tv` using `curl_cffi` with Chrome TLS
fingerprinting. **Cloudflare blocks datacenter IPs**, so this API may return 403 errors
from the sandbox. The frontend handles API failures gracefully (empty states / loading
spinners), so the app still renders. To get real anime data, host the Miruro API on a VPS
with a clean/residential IP and point `NEXT_PUBLIC_API_URL` at it.

## PocketBase (port 8090)

- Built from the official PocketBase binary (v0.25.9, matching the JS SDK 0.25.x).
- On startup, `pocketbase/entrypoint.sh` creates a superuser
  (`admin@kitsune.local` / `admin123456`) and imports the collection schema from
  `docs/pb.json` via the admin API.
- Data persists in the `pb_data` Docker volume.
- Discord OAuth (optional) is configured in the PocketBase admin dashboard, not in the
  Next.js app's env.

## Design system (archive UI)

The UI follows an "Internet Anime Archive" aesthetic. Keep it consistent when adding
pages/components:

- Surfaces: page `bg-[#0a0a0a]`, raised panels `bg-[#141414]`, hairlines `border-white/5`,
  muted fills `bg-white/5` (hover `bg-white/10`).
- Accent: violet `#8b5cf6` / Tailwind `violet-500`-`600`. The legacy pink `#e9376b`
  accent has been fully replaced — do not reintroduce it.
- Section headings use `src/components/section-heading.tsx` (uppercase violet eyebrow +
  bold white title). Inline section titles use `text-sm font-bold uppercase tracking-[0.18em] text-gray-400`.
- Cards: `rounded-2xl ring-1 ring-white/5`, hover `ring-violet-500/40`.
- `BottomNav` is the floating glass nav (mobile/tablet only, `lg:hidden`); its "Calendar"
  item deep-links to `/#schedule` (the `AnimeSchedule` section on the homepage).

## Verification

- `curl http://localhost:3000/api/health` → `{"status":"up and running"}`
- `curl http://localhost:8090/api/health` → 200
- `curl http://localhost:8000/` → Miruro API docs page (if Cloudflare doesn't block)
- Preview at `https://3000-$BASE44_PUBLIC_HOST_SUFFIX`
