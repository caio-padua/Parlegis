import React from "react";
import { Scale, FileSignature, ShieldCheck, KeyRound, FileCheck2, Network } from "lucide-react";
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
  { icon: Scale, label: "LGPD" },
  { icon: FileSignature, label: "ICP-BR" },
  { icon: ShieldCheck, label: "2FA" },
  { icon: KeyRound, label: "JWT" },
  { icon: FileCheck2, label: "AUDIT" },
  { icon: Network, label: "MTLS" },
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
          "radial-gradient(circle at 30% 18%, hsl(200 45% 9%), #050a0e 55%, #02060a 100%)",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[hsl(var(--gold)/0.5)]" aria-hidden />

      {/* Main area: brand lockup (left) + auth form (right) */}
      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 py-14 lg:grid-cols-2 lg:gap-20 lg:py-20">
        {/* Brand lockup */}
        <div className="flex flex-col items-center text-center">
          <img
            src={ciceroSymbol}
            alt="Símbolo Cícero João"
            className="h-28 w-auto drop-shadow-[0_0_55px_hsl(var(--gold)/0.35)] sm:h-36"
          />

          <h1
            className="mt-7 font-serif text-5xl font-semibold tracking-tight sm:text-6xl"
            style={{
              background: "linear-gradient(180deg, #E7C873 0%, #C99A2E 55%, #9c7620 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Cícero João
          </h1>

          {/* VEREADOR with a line on each side */}
          <div className="mt-4 flex w-full max-w-xs items-center justify-center gap-4">
            <span className="h-px flex-1 bg-[hsl(var(--gold)/0.5)]" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.5em] text-[#C99A2E]">
              Vereador
            </span>
            <span className="h-px flex-1 bg-[hsl(var(--gold)/0.5)]" aria-hidden />
          </div>

          <p className="mt-8 max-w-sm font-serif text-lg italic text-[#E7C873]">
            "Servir com sabedoria, conduzir com firmeza."
          </p>
        </div>

        {/* Auth form */}
        <div className="flex flex-col items-center lg:items-start">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.4em] text-[#C99A2E]">
            {areaLabel}
          </p>
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="h-px w-full bg-white/10" aria-hidden />
      </div>

      {/* Credits row: system credits in the right corner */}
      <div className="relative mx-auto flex w-full max-w-6xl justify-center px-6 py-10 sm:justify-end">
        <div className="flex flex-col items-center gap-1.5 sm:items-end">
          <p className="font-serif text-sm tracking-[0.22em] text-[#E7C873]">
            PARLEGIS<span className="align-super text-[8px]">®</span>
          </p>
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/40">
            Legislative Intelligence System
          </p>
          <p className="mt-2 font-serif text-sm tracking-[0.22em] text-[#E7C873]">
            PADCON Platform<span className="align-super text-[8px]">®</span>
          </p>
          <p className="text-[9px] uppercase tracking-[0.28em] text-white/40">
            Advanced Systems Architecture
          </p>

          <div className="mt-3 flex flex-col items-center gap-1.5 sm:items-end">
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-[#E7C873]/80">
              Acesso Restrito
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))]" />
            </span>
            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-[#E7C873]/80">
              Entrada Segura
              <span
                className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold))]"
                style={{ animationDelay: "1.3s" }}
              />
            </span>
          </div>
        </div>
      </div>

      {/* Bottom band: security badges */}
      <div className="relative border-t border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-6 py-6">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[hsl(var(--gold)/0.4)] bg-white/[0.03]">
                <b.icon className="h-4 w-4 text-[#E7C873]" />
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
