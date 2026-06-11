import React from "react";
import { ShieldCheck, BadgeCheck, KeyRound, ClipboardCheck, Lock } from "lucide-react";
import ciceroSymbol from "@assets/cicero_symbol.png";
import sorocabaSkyline from "@assets/sorocaba_skyline_gold.png";

const securityItems = [
  { code: "LGPD", desc: "Proteção de Dados", icon: ShieldCheck },
  { code: "ICP-Brasil", desc: "Certificação Digital", icon: BadgeCheck },
  { code: "2FA", desc: "Dois Fatores", icon: ShieldCheck },
  { code: "JWT", desc: "Token de Sessão", icon: KeyRound },
  { code: "Auditoria", desc: "Trilha de Acessos", icon: ClipboardCheck },
  { code: "mTLS", desc: "Conexão Criptografada", icon: Lock },
];

const currentYear = new Date().getFullYear();

function CompanyBlock({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="font-['Cinzel'] text-[15px] font-semibold tracking-[0.24em] text-[#E0AD4C]">
        {title}
        <span className="align-super text-[8px]">®</span>
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D9D9D9]/80">
        {subtitle}
      </p>
    </div>
  );
}

function StatusLine({ label, color }: { label: string; color: "amber" | "green" }) {
  const dotStyle =
    color === "green"
      ? { color: "#44D26F", backgroundColor: "currentColor" }
      : { color: "#F7C965", backgroundColor: "currentColor" };
  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#D9D9D9]/85">
        {label}
      </span>
      <span className="pulse-dot inline-block h-2.5 w-2.5 rounded-full" style={dotStyle} />
    </div>
  );
}

export function AccessGateway({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden bg-[#0B1417] text-white">
      {/* Background effects */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 28% 20%, rgba(224,173,76,0.14), transparent 28%), radial-gradient(circle at 70% 55%, rgba(14,24,32,0.95), transparent 42%), linear-gradient(135deg, #081013 0%, #0B1417 45%, #061014 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 34% 44%, rgba(247,201,101,0.08), transparent 34%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[118px] z-0 h-px bg-gradient-to-r from-transparent via-[#E0AD4C]/30 to-transparent"
        aria-hidden
      />

      {/* Main area: brand lockup (left) + auth area (right) */}
      <section className="relative z-10 mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-center gap-12 px-6 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:px-14">
        {/* Brand panel */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 scale-110 rounded-full bg-[#E0AD4C]/10 blur-[80px]" aria-hidden />
            <img
              src={ciceroSymbol}
              alt="Monograma Cícero João"
              className="relative z-10 mx-auto w-[min(380px,30vw)] min-w-[220px] drop-shadow-[0_0_28px_rgba(247,201,101,0.28)]"
            />
          </div>

          <h1
            className="mt-2 font-['Cormorant_Garamond'] text-[clamp(56px,5.4vw,90px)] font-bold leading-none text-[#E0AD4C]"
            style={{
              textShadow: "0 2px 0 #986A23, 0 0 22px rgba(247,201,101,0.28)",
            }}
          >
            Cícero João
          </h1>

          {/* VEREADOR between two lines */}
          <div className="mt-5 flex items-center justify-center gap-5">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-[#E0AD4C]" aria-hidden />
            <span className="font-['Cinzel'] text-[18px] font-semibold tracking-[0.42em] text-[#F7C965]">
              VEREADOR
            </span>
            <span className="h-px w-20 bg-gradient-to-l from-transparent to-[#E0AD4C]" aria-hidden />
          </div>

          {/* Golden Sorocaba skyline */}
          <div className="relative mt-8 w-full max-w-[720px]">
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B1417] to-transparent"
              aria-hidden
            />
            <img
              src={sorocabaSkyline}
              alt="Skyline de Sorocaba em dourado"
              className="mx-auto w-full opacity-95 drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)]"
            />
          </div>

          <p
            className="mt-7 font-['Cormorant_Garamond'] text-[26px] italic text-[#F7C965]"
            style={{ textShadow: "0 0 14px rgba(247,201,101,0.26)" }}
          >
            "Servir com sabedoria. Conduzir com firmeza."
          </p>
          <div
            className="mt-4 h-px w-56 bg-gradient-to-r from-transparent via-[#F7C965] to-transparent"
            style={{ boxShadow: "0 0 20px rgba(247,201,101,0.65)" }}
            aria-hidden
          />
        </div>

        {/* Auth area: card + credits/status */}
        <div className="flex flex-col items-center">
          {children}

          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
            <div className="space-y-5 text-center">
              <CompanyBlock title="PARLEGIS" subtitle="Legislative Intelligence System" />
              <CompanyBlock title="PADCON Platform" subtitle="Advanced Systems Architecture" />
            </div>

            <div className="hidden h-20 w-px bg-[#E0AD4C]/30 sm:block" aria-hidden />

            <div className="space-y-5">
              <StatusLine label="Acesso Restrito" color="amber" />
              <StatusLine label="Entrada Segura" color="green" />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom security bar */}
      <footer className="relative z-10 border-t border-[#E0AD4C]/18 px-6 pb-7 pt-5 lg:px-14">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {securityItems.map((item) => (
            <div
              key={item.code}
              className="flex items-center gap-4 rounded-[16px] border border-[#E0AD4C]/25 bg-[#09161C]/70 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-[#E0AD4C]/35 text-[#F7C965]">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#F7C965]">
                  {item.code}
                </p>
                <p className="mt-1 text-[11px] text-[#D9D9D9]/70">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-[#D9D9D9]/55">
          © {currentYear} Gabinete Digital Cícero João. Todos os direitos reservados.
        </p>
      </footer>
    </main>
  );
}
