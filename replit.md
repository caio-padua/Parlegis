# Gabinete Digital Cícero João

Institutional mandate portal and digital office for Sorocaba (SP) city councilman Cícero João (PSB): public portal, citizen area (submit/track demands by protocol with photo upload, request appointments), and a team/admin panel.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/gabinete-digital/` — React + Vite frontend (web artifact, served at `/`)
- `artifacts/api-server/` — Express 5 API (served at `/api`)
- `lib/db/src/schema/*.ts` — Drizzle schema (source of truth for tables); barrel in `index.ts`
- `lib/api-spec/openapi.yaml` — API contract (source of truth); `pnpm --filter @workspace/api-spec run codegen` regenerates hooks + Zod
- `artifacts/api-server/src/seed.ts` — dev seed (run via `pnpm dlx tsx src/seed.ts` from the api-server dir)
- `artifacts/gabinete-digital/public/seed/` — civic content images referenced by seeded news/demands as root-relative `/seed/*.png`

## Architecture decisions

- Auth is Replit-managed Clerk, cookie-based on web (no Bearer tokens). DB users are JIT-provisioned; the first registered user becomes `admin` (atomic via a pg advisory-lock transaction).
- Demand/appointment protocols use `DEM-`/`ATD-` prefixes. Demand statuses: recebida, em_analise, encaminhada, aguardando_resposta, em_acompanhamento, resolvida, arquivada.
- Citizen demand photos go to private object storage; served at `/api/storage/objects/...` and gated so only the owning citizen or an admin can read them.
- Public content (mandate stats, projects, news, agenda, demand counts, track-by-protocol) needs no auth; citizen/admin routes require it.

## Product

Public: home, biografia, mandato em números, projetos (lei/ofícios), demandas por região, acompanhar protocolo, agenda, notícias. Citizen portal: register/track demands with photo upload, request appointments. Admin panel: manage demands + activity timeline, projects, news, agenda, appointments, mandate stats.

## User preferences

- All UI copy in Brazilian Portuguese. No emojis anywhere.
- Design system "PSB Institucional Premium": bordô #8B1E2D, vermelho #B3262E, ouro velho #C99A2E, champagne #E7C873, creme #F8F3E8, branco quente #FFFDF8, grafite #242424, azul petróleo #102D3C. Fonts: Playfair Display (titles) + Inter (body). Classic, popular, institutional.
- Do not generate an AI portrait of the real named person; use institutional/civic imagery for content.

## Gotchas

- After wiring routes or editing server code, restart the `artifacts/api-server` workflow — the dev script builds once on start, so a running instance can serve a stale build (404s on new routes).
- Design subagents cannot run the terminal; always run `pnpm --filter @workspace/gabinete-digital run typecheck` yourself after they report "done".
- See `.agents/memory/` for Clerk `@clerk/react` (`Show`, not SignedIn/SignedOut) and Orval hook (`queryKey` required; filtered list hooks take params first) gotchas.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
