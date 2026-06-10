import React from "react";
import { Scale, BadgeCheck, ShieldCheck, KeyRound, ClipboardCheck, Lock } from "lucide-react";
import ciceroSymbol from "@assets/cicero_symbol.png";
import sorocabaSkyline from "@assets/sorocaba_skyline_gold.png";

const badges = [
  { icon: Scale, code: "LGPD", desc: "Proteção de Dados" },
  { icon: BadgeCheck, code: "ICP-Brasil", desc: "Certificação Digital" },
  { icon: ShieldCheck, code: "2FA", desc: "Dois Fatores" },
  { icon: KeyRound, code: "JWT", desc: "Token de Sessão" },
  { icon: ClipboardCheck, code: "Auditoria", desc: "Trilha de Acessos" },
  { icon: Lock, code: "mTLS", desc: "Conexão Criptografada" },
];

const currentYear = new Date().getFullYear();

export function AccessGateway({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(circle at 22% 12%, #12333f 0%, #0a212c 46%, #061119 100%)",
      }}
    >
      {/* Gold top hairline */}
      <div className="absolute inset-x-0 top-0 z-20 h-px bg-[hsl(var(--gold)/0.5)]" aria-hidden />

      {/* "Luz no infinito" — warm gold horizon glow at the base */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[14%] z-0 h-[45%]"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 28% 110%, rgba(201,154,46,0.20), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Main area: brand lockup (left) + auth card (right) */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 px-6 py-12 lg:grid-cols-2 lg:gap-16 lg:py-14">
        {/* Brand lockup */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <img
            src={ciceroSymbol}
            alt="Símbolo Cícero João"
            className="h-40 w-auto drop-shadow-[0_0_90px_hsl(var(--gold)/0.5)] sm:h-52"
          />

          <h1
            className="mt-5 pb-1 font-serif text-5xl font-semibold leading-[1.12] tracking-tight sm:text-6xl"
            style={{
              color: "#CBA13A",
              textShadow:
                "0 2px 8px rgba(0,0,0,0.55), 0 0 44px rgba(201,154,46,0.45), 0 0 90px rgba(231,200,115,0.22)",
            }}
          >
            Cícero João
          </h1>

          {/* VEREADOR between two lines */}
          <div className="mt-3 flex w-full max-w-xs items-center gap-4">
            <span className="h-px flex-1 bg-[hsl(var(--gold)/0.5)]" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.55em] text-[#C99A2E]">
              Vereador
            </span>
            <span className="h-px flex-1 bg-[hsl(var(--gold)/0.5)]" aria-hidden />
          </div>

          {/* Golden Sorocaba skyline */}
          <img
            src={sorocabaSkyline}
            alt="Skyline de Sorocaba em ouro"
            className="mt-9 w-full max-w-xl drop-shadow-[0_24px_60px_rgba(201,154,46,0.22)]"
          />

          <div className="mt-6 flex w-full max-w-xl flex-col items-center lg:items-start">
            <p className="font-serif text-lg italic text-[#E7C873] sm:text-xl">
              "Servir com sabedoria. Conduzir com firmeza."
            </p>
            <span
              className="mt-3 h-px w-40 bg-gradient-to-r from-[#C99A2E] to-transparent"
              aria-hidden
            />
          </div>
        </div>

        {/* Auth card + credits */}
        <div className="flex flex-col items-center">
          {children}

          {/* System credits + status */}
          <div className="mt-8 flex w-full max-w-md flex-col items-center justify-between gap-5 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-0.5 sm:items-start">
              <p className="font-serif text-sm uppercase tracking-[0.24em] text-[#E7C873]">
                PARLEGIS<span className="align-super text-[8px]">®</span>
              </p>
              <p className="text-[9px] uppercase tracking-[0.24em] text-white/70">
                Legislative Intelligence System
              </p>
              <p className="mt-2 font-serif text-sm uppercase tracking-[0.24em] text-[#E7C873]">
                PADCON Platform<span className="align-super text-[8px]">®</span>
              </p>
              <p className="text-[9px] uppercase tracking-[0.24em] text-white/70">
                Advanced Systems Architecture
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 sm:items-end">
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
      </div>

      {/* Bottom band: security standards with meanings */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-5 px-6 py-6">
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
        <p className="px-6 pb-5 text-center text-[11px] text-white/40">
          © {currentYear} Gabinete Digital Cícero João. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
