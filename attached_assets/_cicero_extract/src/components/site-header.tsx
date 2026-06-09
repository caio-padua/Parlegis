import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Início" },
  { to: "/biografia", label: "Biografia" },
  { to: "/mandato", label: "Mandato" },
  { to: "/projetos", label: "Projetos e Leis" },
  { to: "/bairros", label: "Bairros" },
  { to: "/agenda", label: "Agenda" },
  { to: "/noticias", label: "Notícias" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[var(--petroleo)] text-[var(--branco-quente)] filete-ouro">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--bordo)] text-[var(--champagne)] font-display text-lg font-bold ring-1 ring-[var(--ouro)]/60">
            CJ
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-semibold tracking-tight">
              Cícero João
            </span>
            <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--champagne)]/90">
              Vereador · Sorocaba
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-[var(--branco-quente)]/85 transition-colors hover:bg-white/5 hover:text-[var(--champagne)]"
              activeProps={{ className: "text-[var(--champagne)] bg-white/10" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contato"
            className="ml-3 inline-flex items-center justify-center rounded-md bg-[var(--champagne)] px-4 py-2 text-sm font-semibold text-[var(--grafite)] ring-1 ring-[var(--ouro)] shadow-sm transition-colors hover:bg-[var(--ouro)] hover:text-[var(--branco-quente)]"
          >
            Enviar demanda
          </Link>
        </nav>

        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[var(--branco-quente)] hover:bg-white/10 hover:text-[var(--champagne)]"
                aria-label="Abrir menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[var(--petroleo)] text-[var(--branco-quente)] border-l border-[var(--ouro)]/40">
              <SheetTitle className="font-display text-[var(--champagne)]">Navegação</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-[var(--branco-quente)]/90 hover:bg-white/10 hover:text-[var(--champagne)]"
                    activeProps={{ className: "bg-white/10 text-[var(--champagne)]" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
