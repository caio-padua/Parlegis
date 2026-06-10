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
- RBAC: capabilities are per-route via `requirePermission(cap)`; `admin` (vereador) implicitly has all. CRM caps: `canManageVoters`, `canMessageVoters`, `canManageGifts`.
- External integrations (`artifacts/api-server/src/lib/integrations/`: whatsapp, elevenlabs, heygen) read keys from env and degrade gracefully (structured `ok:false`/`error`, `configured:false`) when unset. Optional env: `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `ELEVENLABS_API_KEY` (+`ELEVENLABS_VOICE_ID`), `HEYGEN_API_KEY` (+`HEYGEN_AVATAR_ID`). Outbound message dispatch currently only implements WhatsApp; sms/email fail gracefully.

## Product

Public: home, biografia, mandato em números, projetos (lei/ofícios), demandas por região, acompanhar protocolo, agenda, notícias. Citizen portal: register/track demands with photo upload, request appointments (picks released slot cards). Admin panel: manage demands + activity timeline, projects, news, agenda, appointments, mandate stats, scheduling cards (Cartões de Agenda), team/governance (RBAC), voter CRM (Eleitores), messaging (Mensagens), gifts/brindes, and external integrations status (Integrações & IA).

## User preferences

- All UI copy in Brazilian Portuguese. No emojis anywhere.
- Design system "PSB Institucional Premium": bordô #8B1E2D, vermelho #B3262E, ouro velho #C99A2E, champagne #E7C873, creme #F8F3E8, branco quente #FFFDF8, grafite #242424, azul petróleo #102D3C. Fonts: Playfair Display (titles) + Inter (body). Classic, popular, institutional.
- Do not generate an AI portrait of the real named person; use institutional/civic imagery for content.

## Gotchas

- Login/access screen (`access-gateway.tsx` + `auth-form.tsx`): standalone full-screen dark petróleo page with NO site header/footer (excluded via route check in `Layout.tsx`). Two-column layout matching the user's reference (`LOGO_CICERO_15`): LEFT brand lockup (prominent CJ symbol `cicero_symbol.png`, "Cícero João" in solid matte gold #CBA13A with strong glow, "Vereador" between two filete lines, generated golden 3D Sorocaba **skyline** `sorocaba_skyline_gold.png` — cable-stayed bridge + clock tower + classical building + modern towers with water reflection, transparent, on a warm gold "luz no infinito" glow; the user EXPLICITLY wants the Sorocaba skyline here, overrides the earlier "no city image" rule; `sorocaba_monument_gold.png` cathedral is the older alternate), gold italic quote "Servir com sabedoria. Conduzir com firmeza." RIGHT a custom glass card (shield emblem overlapping top border, "Entrar"/"Solicitar acesso" header). The form is a **custom headless Clerk form** (`auth-form.tsx`) — NOT the prebuilt `<SignIn>`/`<SignUp>` — to match the single-screen email+password reference: Continuar com Google, E-mail, Senha (eye toggle), Lembrar de mim (persists e-mail in `localStorage` key `gd_remember_email`), Esqueci minha senha (reset_password_email_code flow), Entrar no painel, Solicitar acesso; sign-up does email-code verification. Uses `useSignIn`/`useSignUp` from `@clerk/react/legacy` (see memory). `sign-in.tsx`/`sign-up.tsx` handle `/sso-callback` via `AuthenticateWithRedirectCallback` and redirect already-signed-in users to `/portal` or `/admin` (`?area=admin` selects admin target, carried into OAuth callback URLs). System credits PARLEGIS®/PADCON Platform® (the user's companies) under the card, slow-pulsing status dots (`.pulse-dot` in `index.css`, yellow Acesso Restrito + green Entrada Segura, in sync), bottom band of boxed security badges with Portuguese meanings, footer "© <year> Gabinete Digital Cícero João...". Do not reintroduce site chrome on auth pages.
- After wiring routes or editing server code, restart the `artifacts/api-server` workflow — the dev script builds once on start, so a running instance can serve a stale build (404s on new routes).
- Design subagents cannot run the terminal; always run `pnpm --filter @workspace/gabinete-digital run typecheck` yourself after they report "done".
- See `.agents/memory/` for Clerk `@clerk/react` (`Show`, not SignedIn/SignedOut) and Orval hook (`queryKey` required; filtered list hooks take params first) gotchas.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
