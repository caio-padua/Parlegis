import React from "react";
import { useLocation, Link } from "wouter";
import { useSignIn, useSignUp } from "@clerk/react/legacy";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Loader2,
  KeyRound,
} from "lucide-react";

type Area = "eleitor" | "admin";
type View = "main" | "reset-request" | "reset-confirm" | "verify";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden focusable="false">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function clerkError(err: unknown): string {
  const e = err as { errors?: { longMessage?: string; message?: string }[]; message?: string };
  return (
    e?.errors?.[0]?.longMessage ||
    e?.errors?.[0]?.message ||
    e?.message ||
    "Não foi possível concluir. Verifique os dados e tente novamente."
  );
}

const fieldClass =
  "h-12 w-full rounded-xl border border-[hsl(var(--gold)/0.28)] bg-white/[0.04] px-4 text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#C99A2E] focus:ring-2 focus:ring-[#C99A2E]/30";

const labelClass = "mb-1.5 flex items-center gap-2 text-sm font-medium text-white/75";

export function AuthForm({ mode, area }: { mode: "sign-in" | "sign-up"; area: Area }) {
  const [, setLocation] = useLocation();
  const { isLoaded: siLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: suLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const isSignIn = mode === "sign-in";
  const redirectUrl = area === "admin" ? "/admin" : "/portal";
  const areaQuery = area === "admin" ? "?area=admin" : "";
  const loaded = isSignIn ? siLoaded : suLoaded;

  const [view, setView] = React.useState<View>("main");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(true);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("gd_remember_email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);
  const [code, setCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const headings: Record<View, { title: string; subtitle: string }> = {
    main: isSignIn
      ? {
          title: "Entrar",
          subtitle:
            area === "admin"
              ? "Acesse o painel administrativo do Gabinete"
              : "Acesse o Gabinete Digital do Vereador",
        }
      : { title: "Solicitar acesso", subtitle: "Crie sua conta para acompanhar suas demandas" },
    "reset-request": {
      title: "Recuperar senha",
      subtitle: "Enviaremos um código de verificação ao seu e-mail",
    },
    "reset-confirm": {
      title: "Redefinir senha",
      subtitle: "Informe o código recebido e a nova senha",
    },
    verify: { title: "Confirme seu e-mail", subtitle: "Digite o código que enviamos para você" },
  };
  const { title, subtitle } = headings[view];

  async function handleGoogle() {
    setError(null);
    try {
      if (isSignIn) {
        if (!signIn) return;
        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: `${basePath}/sign-in/sso-callback${areaQuery}`,
          redirectUrlComplete: `${basePath}${redirectUrl}`,
        });
      } else {
        if (!signUp) return;
        await signUp.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: `${basePath}/sign-up/sso-callback${areaQuery}`,
          redirectUrlComplete: `${basePath}${redirectUrl}`,
        });
      }
    } catch (err) {
      setError(clerkError(err));
    }
  }

  async function handleMainSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isSignIn) {
        if (!signIn) return;
        if (typeof window !== "undefined") {
          if (remember) window.localStorage.setItem("gd_remember_email", email);
          else window.localStorage.removeItem("gd_remember_email");
        }
        const res = await signIn.create({ identifier: email, password });
        if (res.status === "complete") {
          await setSignInActive({ session: res.createdSessionId });
          setLocation(redirectUrl);
        } else {
          setError("Não foi possível entrar. Verifique suas credenciais.");
        }
      } else {
        if (!signUp) return;
        await signUp.create({ emailAddress: email, password });
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setView("verify");
      }
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status === "complete") {
        await setSignUpActive({ session: res.createdSessionId });
        setLocation(redirectUrl);
      } else {
        setError("Código inválido. Tente novamente.");
      }
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setError(null);
    setSubmitting(true);
    try {
      await signIn.create({ strategy: "reset_password_email_code", identifier: email });
      setView("reset-confirm");
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });
      if (res.status === "complete") {
        await setSignInActive({ session: res.createdSessionId });
        setLocation(redirectUrl);
      } else {
        setError("Não foi possível redefinir a senha.");
      }
    } catch (err) {
      setError(clerkError(err));
    } finally {
      setSubmitting(false);
    }
  }

  const otherHref = isSignIn
    ? `/sign-up${area === "admin" ? "?area=admin" : ""}`
    : `/sign-in${area === "admin" ? "?area=admin" : ""}`;

  return (
    <div className="relative w-full max-w-md rounded-[1.75rem] border border-[hsl(var(--gold)/0.35)] bg-[rgba(10,26,36,0.72)] px-7 pb-8 pt-14 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.92)] backdrop-blur-xl sm:px-9">
      {/* Gold accent ribbon */}
      <span
        className="pointer-events-none absolute inset-x-10 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C99A2E] to-transparent"
        aria-hidden
      />
      {/* Shield emblem overlapping the top border */}
      <span className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.5)] bg-[#0b1d28] shadow-[0_0_30px_-6px_rgba(201,154,46,0.75)]">
        <ShieldCheck className="h-6 w-6 text-[#E7C873]" />
      </span>

      <div className="text-center">
        <h2 className="font-serif text-3xl text-white">{title}</h2>
        <p className="mt-1.5 text-sm text-white/55">{subtitle}</p>
      </div>

      {!loaded ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#C99A2E]" />
        </div>
      ) : view === "main" ? (
        <>
          <button
            type="button"
            onClick={handleGoogle}
            className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[hsl(var(--gold)/0.35)] bg-white/[0.04] text-sm font-medium text-white transition-colors hover:bg-white/[0.09]"
          >
            <GoogleIcon className="h-5 w-5" />
            Continuar com Google
          </button>

          <div className="my-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/10" aria-hidden />
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">ou</span>
            <span className="h-px flex-1 bg-white/10" aria-hidden />
          </div>

          <form onSubmit={handleMainSubmit} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className={labelClass}>
                <Mail className="h-4 w-4 text-[#C99A2E]" />
                E-mail
              </label>
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="auth-password" className={labelClass}>
                <Lock className="h-4 w-4 text-[#C99A2E]" />
                Senha
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPw ? "text" : "password"}
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className={`${fieldClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/55 hover:text-white"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {isSignIn && (
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#C99A2E]"
                  />
                  Lembrar de mim
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView("reset-request");
                  }}
                  className="text-sm text-[#E7C873] transition-colors hover:text-[#C99A2E]"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {error && <p className="text-sm text-[#ef7a7a]">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C99A2E] to-[#E7C873] font-semibold text-[#10222C] shadow-[0_14px_34px_-12px_rgba(201,154,46,0.85)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  {isSignIn ? "Entrar no painel" : "Criar acesso"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-sm text-white/55">
            {isSignIn ? "Não possui uma conta?" : "Já possui acesso?"}
            <Link
              href={otherHref}
              className="inline-flex items-center gap-1 font-medium text-[#E7C873] transition-colors hover:text-[#C99A2E]"
            >
              {isSignIn ? "Solicitar acesso" : "Entrar"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      ) : view === "verify" ? (
        <form onSubmit={handleVerify} className="mt-7 space-y-4">
          <div>
            <label htmlFor="auth-code" className={labelClass}>
              <KeyRound className="h-4 w-4 text-[#C99A2E]" />
              Código de verificação
            </label>
            <input
              id="auth-code"
              inputMode="numeric"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código"
              className={`${fieldClass} tracking-[0.3em]`}
            />
          </div>
          {error && <p className="text-sm text-[#ef7a7a]">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C99A2E] to-[#E7C873] font-semibold text-[#10222C] shadow-[0_14px_34px_-12px_rgba(201,154,46,0.85)] transition hover:brightness-105 disabled:opacity-70"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirmar"}
          </button>
        </form>
      ) : view === "reset-request" ? (
        <form onSubmit={handleResetRequest} className="mt-7 space-y-4">
          <div>
            <label htmlFor="reset-email" className={labelClass}>
              <Mail className="h-4 w-4 text-[#C99A2E]" />
              E-mail
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className={fieldClass}
            />
          </div>
          {error && <p className="text-sm text-[#ef7a7a]">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C99A2E] to-[#E7C873] font-semibold text-[#10222C] shadow-[0_14px_34px_-12px_rgba(201,154,46,0.85)] transition hover:brightness-105 disabled:opacity-70"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enviar código"}
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setView("main");
            }}
            className="w-full text-center text-sm text-white/55 transition-colors hover:text-white"
          >
            Voltar para o login
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetConfirm} className="mt-7 space-y-4">
          <div>
            <label htmlFor="reset-code" className={labelClass}>
              <KeyRound className="h-4 w-4 text-[#C99A2E]" />
              Código de verificação
            </label>
            <input
              id="reset-code"
              inputMode="numeric"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código"
              className={`${fieldClass} tracking-[0.3em]`}
            />
          </div>
          <div>
            <label htmlFor="reset-newpw" className={labelClass}>
              <Lock className="h-4 w-4 text-[#C99A2E]" />
              Nova senha
            </label>
            <input
              id="reset-newpw"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite a nova senha"
              className={fieldClass}
            />
          </div>
          {error && <p className="text-sm text-[#ef7a7a]">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C99A2E] to-[#E7C873] font-semibold text-[#10222C] shadow-[0_14px_34px_-12px_rgba(201,154,46,0.85)] transition hover:brightness-105 disabled:opacity-70"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Redefinir senha"}
          </button>
        </form>
      )}
    </div>
  );
}
