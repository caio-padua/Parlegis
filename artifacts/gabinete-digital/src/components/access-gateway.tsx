import React from "react";
import { ShieldCheck, Lock, FileCheck2, KeyRound } from "lucide-react";
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

const chips = [
  { icon: ShieldCheck, label: "Acesso seguro" },
  { icon: Lock, label: "Sessão protegida" },
  { icon: FileCheck2, label: "LGPD" },
  { icon: KeyRound, label: "Dados criptografados" },
];

export function AccessGateway({
  mode,
  children,
}: {
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
}) {
  const area = useArea();

  const heading =
    mode === "sign-up"
      ? "Criar acesso"
      : area === "admin"
        ? "Área do Administrador"
        : "Área do Eleitor";

  const subtitle =
    mode === "sign-up"
      ? "Cadastre-se para enviar e acompanhar suas demandas."
      : area === "admin"
        ? "Acesso restrito à equipe do gabinete."
        : "Entre para acompanhar suas demandas e atendimentos.";

  return (
    <div
      className="relative flex min-h-[calc(100vh-5rem)] w-full flex-col overflow-hidden text-secondary-foreground"
      style={{
        background:
          "radial-gradient(circle at 28% 22%, hsl(200 55% 13%), hsl(200 62% 6%) 55%, hsl(200 65% 3%) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_82%,hsl(var(--gold)/0.08),transparent_50%)]"
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-px bg-[hsl(var(--gold)/0.55)]" aria-hidden />

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* Brand / institutional side */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <img
            src={ciceroSymbol}
            alt="Símbolo Cícero João"
            className="h-24 w-auto drop-shadow-[0_0_45px_hsl(var(--gold)/0.3)] sm:h-28"
          />

          <div className="mt-5">
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#E7C873] sm:text-5xl">
              Cícero João
            </h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.42em] text-[#C99A2E]">
              Vereador · Sorocaba
            </p>
          </div>

          <p className="mt-5 max-w-md font-serif text-base italic text-[#E7C873]/85">
            "Servir com sabedoria, conduzir com firmeza."
          </p>

          {/* City strip — institutional imagery of Sorocaba */}
          <div className="relative mt-8 w-full max-w-md overflow-hidden rounded-2xl border border-[hsl(var(--gold)/0.3)] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]">
            <img
              src="/seed/civic-sorocaba.png"
              alt="Cidade de Sorocaba"
              className="h-40 w-full object-cover sm:h-48"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, hsl(200 65% 4% / 0.92), hsl(200 60% 8% / 0.25) 55%, transparent)",
              }}
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#E7C873]/90">
                Portal de Mandato
              </p>
              <h1 className="font-serif text-2xl leading-tight text-white sm:text-3xl">
                {heading}
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-md text-sm text-secondary-foreground/75">{subtitle}</p>
        </div>

        {/* Auth form side */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>

      {/* Full-width bottom band: security + system credits */}
      <div className="relative mt-auto border-t border-[hsl(var(--gold)/0.3)] bg-[rgba(4,18,26,0.65)] backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {chips.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-sm text-white/75">
                <c.icon className="h-4 w-4 text-[#E7C873]" />
                <span>{c.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col items-center gap-3 border-t border-white/10 pt-5 text-center sm:flex-row sm:justify-center sm:gap-8">
            <div>
              <p className="font-serif text-sm tracking-wide text-[#E7C873]">
                PARLEGIS<span className="align-super text-[8px]">®</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/45">
                Legislative Intelligence System
              </p>
            </div>
            <span className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden />
            <div>
              <p className="font-serif text-sm tracking-wide text-[#E7C873]">
                PADCON Platform<span className="align-super text-[8px]">®</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/45">
                Advanced Systems Architecture
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
