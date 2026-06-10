---
name: Clerk appearance + Tailwind v4
description: How to theme Clerk (@clerk/react) UI when Tailwind v4 utilities lose to Clerk's unlayered CSS
---

# Clerk `appearance` element classNames vs Tailwind v4

**Rule:** When theming Clerk `<SignIn>/<SignUp>` via `appearance.elements`, the className styles for
inputs/titles/labels/dividers are silently overridden by Clerk's own injected CSS. Buttons/links
(`formButtonPrimary`, `socialButtonsBlockButton`, `footerActionLink`) happen to win, but
`formFieldInput`, `headerTitle`, `headerSubtitle`, `formFieldLabel`, `dividerText` do NOT — the input
stays white, title text stays dark.

**Fix that works:** add the Tailwind v4 important suffix `!` to each utility on the stubborn elements,
e.g. `text-white!`, `bg-white/[0.06]!`, `border-[rgba(...)]!`. Prefix `!text-white` (v3 style) is wrong
for v4.

**Why:** Tailwind v4 emits all utilities inside `@layer`; Clerk injects its component CSS *unlayered*,
and unlayered rules beat layered ones regardless of specificity. `!important` escapes the layer cascade.

**Also tried and FAILED to fix it alone:**
- `appearance.variables` (colorText, colorInputBackground, colorBackground) — did not recolor the input.
- `baseTheme: dark` from `@clerk/themes` — had no visible effect on the card.
Keep `baseTheme: dark` + `variables` for sane defaults, but the `!`-suffixed element classNames are what
actually render the dark/gold card.

**How to apply:** Centralize the object in `src/lib/clerk-appearance.ts` and pass it once on the global
`<ClerkProvider appearance={{ ...clerkAppearance, layout }}>` (only SignIn/SignUp use Clerk UI here, so
global scope is fine). Restart the web workflow after appearance changes — Clerk reads appearance at
mount and HMR may not re-init it.
