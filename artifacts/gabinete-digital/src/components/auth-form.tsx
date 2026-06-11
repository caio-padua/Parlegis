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
  "h-14 w-full rounded-[14px] border border-[#E0AD4C]/30 bg-[#0C171C] px-4 text-[15px] text-white outline-none transition placeholder:text-[#D9D9D9]/40 focus:border-[#F7C965]/75 focus:shadow-[0_0_0_3px_rgba(224,173,76,0.12)]";

const labelClass = "mb-2 flex items-center gap-2 text-sm font-medium text-[#D9D9D9]";

const primaryButtonClass =
  "flex h-[60px] w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F7C965_0%,#E0AD4C_48%,#D49733_100%)] font-bold text-[#081114] shadow-[0_12px_30px_rgba(224,173,76,0.24),inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:-translate-y-px hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70";

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
    <div className="relative w-full max-w-[520px] rounded-[28px] border border-[#E0AD4C]/45 bg-[linear-gradient(180deg,rgba(14,24,32,0.96),rgba(7,16,20,0.96))] px-7 pb-10 pt-12 shadow-[0_28px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-10">
      {/* Shield emblem overlapping the top border */}
      <div className="absolute left-1/2 top-[-29px] flex h-[58px] w-[58px] -translate-x-1/2 items-center justify-center rounded-full border border-[#E0AD4C]/75 bg-[linear-gradient(180deg,#1A2529,#081114)] shadow-[0_0_28px_rgba(224,173,76,0.28)]">
        <ShieldCheck className="h-7 w-7 text-[#F7C965]" />
      </div>

      <div className="text-center">
        <h2 className="font-['Playfair_Display'] text-[40px] font-bold leading-none text-white">
          {title}
        </h2>
        <p className="mt-3 text-[15px] font-medium text-[#E0AD4C]">{subtitle}</p>
        <div className="mx-auto mt-4 h-px w-36 bg-gradient-to-r from-transparent via-[#F7C965] to-transparent shadow-[0_0_18px_rgba(247,201,101,0.48)]" />
      </div>

      {!loaded ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[#E0AD4C]" />
        </div>
      ) : view === "main" ? (
        <>
          <button
            type="button"
            onClick={handleGoogle}
            className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-[12px] border border-[#E0AD4C]/45 bg-[#09161C]/90 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-[#F7C965]/75 hover:bg-[#0E1820] hover:shadow-[0_0_18px_rgba(224,173,76,0.16)]"
          >
            <GoogleIcon className="h-5 w-5" />
            Continuar com Google
          </button>

          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#E0AD4C]/20" aria-hidden />
            <span className="text-sm uppercase tracking-[0.2em] text-[#D9D9D9]/60">ou</span>
            <span className="h-px flex-1 bg-[#E0AD4C]/20" aria-hidden />
          </div>

          <form onSubmit={handleMainSubmit} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className={labelClass}>
                <Mail className="h-4 w-4 text-[#E0AD4C]" />
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
                <Lock className="h-4 w-4 text-[#E0AD4C]" />
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
              <div className="flex items-center justify-between pt-1 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-[#D9D9D9]">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#E0AD4C]"
                  />
                  Lembrar de mim
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setView("reset-request");
                  }}
                  className="font-medium text-[#E0AD4C] underline underline-offset-4 transition-colors hover:text-[#F7C965]"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {error && <p className="text-sm text-[#ef7a7a]">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className={`mt-3 flex h-[60px] w-full items-center rounded-[14px] bg-[linear-gradient(180deg,#F7C965_0%,#E0AD4C_48%,#D49733_100%)] px-7 font-bold text-[#081114] shadow-[0_12px_30px_rgba(224,173,76,0.24),inset_0_1px_0_rgba(255,255,255,0.35)] transition hover:-translate-y-px hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 ${
                submitting ? "justify-center" : "justify-between"
              }`}
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="flex items-center gap-3 text-[17px]">
                    <ShieldCheck className="h-5 w-5" />
                    {isSignIn ? "Entrar no painel" : "Criar acesso"}
                  </span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-[#E0AD4C]/18" aria-hidden />
            <Lock className="h-4 w-4 text-[#E0AD4C]/80" />
            <span className="h-px flex-1 bg-[#E0AD4C]/18" aria-hidden />
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-[#D9D9D9]/75">
            {isSignIn ? "Não possui uma conta?" : "Já possui acesso?"}
            <Link
              href={otherHref}
              className="inline-flex items-center gap-1.5 font-semibold text-[#E0AD4C] transition-colors hover:text-[#F7C965]"
            >
              {isSignIn ? "Solicitar acesso" : "Entrar"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      ) : view === "verify" ? (
        <form onSubmit={handleVerify} className="mt-7 space-y-4">
          <div>
            <label htmlFor="auth-code" className={labelClass}>
              <KeyRound className="h-4 w-4 text-[#E0AD4C]" />
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
            className={primaryButtonClass}
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirmar"}
          </button>
        </form>
      ) : view === "reset-request" ? (
        <form onSubmit={handleResetRequest} className="mt-7 space-y-4">
          <div>
            <label htmlFor="reset-email" className={labelClass}>
              <Mail className="h-4 w-4 text-[#E0AD4C]" />
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
            className={primaryButtonClass}
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
              <KeyRound className="h-4 w-4 text-[#E0AD4C]" />
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
              <Lock className="h-4 w-4 text-[#E0AD4C]" />
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
            className={primaryButtonClass}
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Redefinir senha"}
          </button>
        </form>
      )}
    </div>
  );
}
