---
name: Clerk @clerk/react + Orval React Query hook gotchas
description: Non-obvious API shapes for the Replit-managed Clerk web SDK and generated Orval hooks that repeatedly bite when wiring frontends.
---

# Clerk @clerk/react (web) — auth-state UI

- The package is `@clerk/react` (NOT `@clerk/clerk-react`). It does **NOT** export `SignedIn` / `SignedOut`.
- Use the `Show` component instead: `import { Show } from "@clerk/react"` then `<Show when="signed-in">…</Show>` / `<Show when="signed-out">…</Show>`.
- Full pt-BR (or any locale) localization needs the separate `@clerk/localizations` package installed (`pnpm --filter <artifact> add -D @clerk/localizations`), then `import { ptBR }`.
- **Why:** the design subagent kept reaching for the generic `@clerk/clerk-react` API names, which typecheck-fail against the installed `@clerk/react`.

# Orval-generated React Query hooks (lib/api-client-react)

- **Every** query hook REQUIRES a `queryKey` inside its `query` options object, or you get `Property 'queryKey' is missing`. Use the matching `get*QueryKey(...)` helper.
- No-param hooks take options as the FIRST arg: `useListNews({ query: { queryKey: getListNewsQueryKey() } })`.
- Path-param hooks take the id FIRST, options SECOND: `useGetProject(id, { query: { enabled: !!id, queryKey: getGetProjectQueryKey(id) } })`.
- **Filtered list hooks take the query params object as the FIRST arg, options as the SECOND** — NOT wrapped in `{ query }`. e.g. `useListProjects({ type, status }, { query: { queryKey: getListProjectsQueryKey({ type, status }) } })`. Passing `{ query: {...} }` as the first arg fails with `'query' does not exist in type 'ListProjectsParams'`.
- Mutation variables only accept the path params the generated type declares plus `data` (e.g. createDemandActivity is `{ id, data }`, not `{ id, demandId, data }`).

**How to apply:** when a design subagent reports "frontend complete", always run `pnpm --filter <artifact> run typecheck` yourself — subagents cannot run the terminal and routinely claim success with these exact errors still present.
