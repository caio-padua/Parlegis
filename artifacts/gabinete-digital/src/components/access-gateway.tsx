import React from "react";
import { ShieldCheck, Lock, FileCheck2, KeyRound } from "lucide-react";
import logoCicero from "@assets/cicero_logo_full.png";

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
      className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden text-secondary-foreground"
      style={{
        background:
          "radial-gradient(circle at 28% 22%, hsl(200 55% 13%), hsl(200 62% 6%) 55%, hsl(200 65% 3%) 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_85%,hsl(var(--gold)/0.08),transparent_50%)]" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-px bg-[hsl(var(--gold)/0.55)]" aria-hidden />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
        {/* Brand / institutional side */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <img
            src={logoCicero}
            alt="Cícero João · Vereador de Sorocaba"
            className="w-64 max-w-full drop-shadow-[0_0_55px_hsl(var(--gold)/0.22)] sm:w-72 lg:w-80"
          />

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            Portal de Mandato
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-white sm:text-5xl">
            {heading}
          </h1>
          <p className="mt-4 max-w-md text-base text-secondary-foreground/80">{subtitle}</p>

          <div className="mt-10 grid grid-cols-2 gap-3 max-w-md">
            {chips.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-2 rounded-xl border border-[hsl(var(--gold)/0.3)] bg-white/5 px-3 py-2.5 text-sm text-secondary-foreground/85"
              >
                <c.icon className="h-4 w-4 text-accent" />
                {c.label}
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-md border-l-2 border-[hsl(var(--gold)/0.5)] pl-4 text-sm italic text-secondary-foreground/70">
            "Sorocaba ouvida. Demandas organizadas. Trabalho acompanhado."
          </p>
        </div>

        {/* Auth form side */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
