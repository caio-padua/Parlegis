---
name: Clerk @clerk/react custom headless web auth
description: How to build a custom (non-prebuilt) email/password + Google sign-in/sign-up form on Replit-managed Clerk for a React+Vite web artifact.
---

# Custom headless Clerk auth on web (@clerk/react v6+)

When the design requires a single-screen email+password form (the prebuilt
`<SignIn>`/`<SignUp>` use a progressive identifier-first flow and CANNOT show an
inline password), build a custom form with Clerk's classic hooks.

**Import the hooks from `@clerk/react/legacy`, NOT `@clerk/react`.**
**Why:** In `@clerk/react` v6+, the default `useSignIn`/`useSignUp` exports return
the new *signals* API (`SignInSignalValue` / `SignInFutureResource`) which has
`{ signIn, errors, fetchStatus }` and lacks `isLoaded`, `setActive`,
`signIn.create`, `authenticateWithRedirect`, `attemptFirstFactor`,
`signUp.prepareEmailAddressVerification`, etc. Typecheck fails with
`Property 'setActive'/'authenticateWithRedirect' does not exist on type
'SignInSignalValue'/'SignInFutureResource'`. The classic API lives at the
`./legacy` subpath (it is a real package export).

**How to apply:**
- `import { useSignIn, useSignUp } from "@clerk/react/legacy";`
- Keep `ClerkProvider` and `AuthenticateWithRedirectCallback` imported from the
  main `@clerk/react` — mixing them with legacy hooks is fine in v6.7.3 (same
  Clerk instance). The only forward risk is eventual legacy-API deprecation.
- Flows: sign-in `signIn.create({identifier,password})` → `setActive({session: res.createdSessionId})`;
  Google `signIn.authenticateWithRedirect({strategy:"oauth_google", redirectUrl: <base>/sign-in/sso-callback, redirectUrlComplete: <base>/<target>})`;
  sign-up `signUp.create({emailAddress,password})` → `prepareEmailAddressVerification({strategy:"email_code"})` → `attemptEmailAddressVerification({code})` → `setActive`;
  reset `signIn.create({strategy:"reset_password_email_code", identifier})` → `attemptFirstFactor({strategy:"reset_password_email_code", code, password})` → `setActive`.
- OAuth callback: render `<AuthenticateWithRedirectCallback signInFallbackRedirectUrl signUpFallbackRedirectUrl />` on the `/sso-callback` sub-path (matched by the `/sign-in/*?` wouter route). Carry any intent (e.g. `?area=admin`) in BOTH the `redirectUrl` callback URL and the explicit `redirectUrlComplete`, otherwise a fallback redirect loses it.
- "Remember me" is NOT a per-login Clerk session control on the headless API; if the design shows it, give it honest meaning (e.g. persist the e-mail in `localStorage`) rather than leaving it cosmetic.
- Redirect already-signed-in users away from the auth pages with `<Show when="signed-in"><Redirect/></Show>` for parity with the prebuilt UX.
