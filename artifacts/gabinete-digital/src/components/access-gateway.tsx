import React from "react";
import { Scale, BadgeCheck, ShieldCheck, KeyRound, ClipboardCheck, Lock } from "lucide-react";
import ciceroSymbol from "@assets/cicero_symbol.png";

type Area = "eleitor" | "admin";

function useArea(): Area {
  const [area, setArea] = React.useState<Area>("eleitor");
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setArea(params.get("area") === "admin" ? "admin" : "eleitor");
  }, []);
  return area;
}

const badges = [
  { icon: Scale, code: "LGPD", desc: "Proteção de Dados" },
  { icon: BadgeCheck, code: "ICP-Brasil", desc: "Certificação Digital" },
  { icon: ShieldCheck, code: "2FA", desc: "Dois Fatores" },
  { icon: KeyRound, code: "JWT", desc: "Token de Sessão" },
  { icon: ClipboardCheck, code: "Auditoria", desc: "Trilha de Acessos" },
  { icon: Lock, code: "mTLS", desc: "Conexão Criptografada" },
];

export function AccessGateway({
  mode,
  children,
}: {
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
}) {
  const area = useArea();

  const areaLabel =
    mode === "sign-up"
      ? "Criar Acesso"
      : area === "admin"
        ? "Área do Administrador"
        : "Área do Eleitor";

  return (
    <div
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(circle at 30% 12%, #173e4f 0%, #0e2c3a 48%, #08202b 100%)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[hsl(var(--gold)/0.55)]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_88%,hsl(var(--gold)/0.07),transparent_55%)]"
        aria-hidden
      />

      {/* Top band: area label */}
      <div className="relative border-b border-[hsl(var(--gold)/0.28)] bg-[rgba(5,22,30,0.55)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-6 py-3.5">
          <span className="h-px w-8 bg-[hsl(var(--gold)/0.6)] sm:w-12" aria-hidden />
          <span className="text-[11px] font-semibold uppercase tracking-[0.5em] text-[#E7C873] sm:text-xs">
            {areaLabel}
          </span>
          <span className="h-px w-8 bg-[hsl(var(--gold)/0.6)] sm:w-12" aria-hidden />
        </div>
      </div>

      {/* Main area: brand lockup (left) + framed auth panel (right) */}
      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 px-6 py-14 lg:grid-cols-2 lg:gap-20 lg:py-16">
        {/* Brand lockup */}
        <div className="flex flex-col items-center text-center">
          <img
            src={ciceroSymbol}
            alt="Símbolo Cícero João"
            className="h-44 w-auto drop-shadow-[0_0_70px_hsl(var(--gold)/0.4)] sm:h-56"
          />

          <h1
            className="mt-6 pb-2 font-serif text-6xl font-semibold leading-[1.12] tracking-tight sm:text-7xl"
            style={{
              color: "#CBA13A",
              textShadow:
                "0 2px 6px rgba(0,0,0,0.5), 0 0 34px rgba(201,154,46,0.28)",
            }}
          >
            Cícero João
          </h1>

          {/* VEREADOR between two lines */}
          <div className="mt-3 flex w-full max-w-xs items-center justify-center gap-4">
            <span className="h-px flex-1 bg-[hsl(var(--gold)/0.5)]" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.55em] text-[#C99A2E]">
              Vereador
            </span>
            <span className="h-px flex-1 bg-[hsl(var(--gold)/0.5)]" aria-hidden />
          </div>

          <p className="mt-8 max-w-sm font-serif text-lg italic text-[#E7C873]">
            "Servir com sabedoria, conduzir com firmeza."
          </p>
        </div>

        {/* Framed auth panel */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[hsl(var(--gold)/0.38)] bg-[rgba(7,27,37,0.62)] p-7 shadow-[0_34px_80px_-28px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-8">
            {children}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="h-px w-full bg-white/10" aria-hidden />
      </div>

      {/* System credits — right corner */}
      <div className="relative mx-auto flex w-full max-w-6xl justify-center px-6 py-10 sm:justify-end">
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <p className="font-serif text-sm uppercase tracking-[0.24em] text-[#E7C873]">
            PARLEGIS<span className="align-super text-[8px]">®</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.26em] text-white/85">
            Legislative Intelligence System
          </p>
          <p className="mt-3 font-serif text-sm uppercase tracking-[0.24em] text-[#E7C873]">
            PADCON Platform<span className="align-super text-[8px]">®</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.26em] text-white/85">
            Advanced Systems Architecture
          </p>

          <div className="mt-4 flex flex-col items-center gap-2 sm:items-end">
            <span className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.26em] text-white/70">
              Acesso Restrito
              <span
                className="pulse-dot inline-block h-2 w-2 rounded-full"
                style={{ color: "#EAB308", backgroundColor: "currentColor" }}
              />
            </span>
            <span className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.26em] text-white/70">
              Entrada Segura
              <span
                className="pulse-dot inline-block h-2 w-2 rounded-full"
                style={{ color: "#3FB950", backgroundColor: "currentColor" }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom band: security standards with meanings */}
      <div className="relative border-t border-white/10 bg-black/25 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-9 gap-y-5 px-6 py-6">
          {badges.map((b) => (
            <div key={b.code} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[hsl(var(--gold)/0.4)] bg-white/[0.03]">
                <b.icon className="h-4 w-4 text-[#E7C873]" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E7C873]">
                  {b.code}
                </span>
                <span className="text-[10px] tracking-wide text-white/55">{b.desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
