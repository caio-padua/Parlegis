import React from "react";
import { Link, useLocation } from "wouter";
import { Show, useClerk, useUser } from "@clerk/react";
import { useGetCurrentUser, getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Menu, X, Send, UserRound, ShieldCheck, LogOut } from "lucide-react";
import ciceroSymbol from "@assets/cicero_symbol.png";

export function Header() {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { data: dbUser } = useGetCurrentUser({
    query: { enabled: !!clerkUser, queryKey: getGetCurrentUserQueryKey() },
  });
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/biografia", label: "Biografia" },
    { href: "/mandato", label: "O Mandato" },
    { href: "/projetos", label: "Projetos" },
    { href: "/demandas", label: "Demandas" },
    { href: "/acompanhar", label: "Acompanhar" },
    { href: "/agenda", label: "Agenda" },
    { href: "/noticias", label: "Notícias" },
  ];

  const isStaff = !!dbUser && dbUser.role !== "citizen";
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-secondary text-secondary-foreground filete-ouro shadow-sm">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
          <img
            src={ciceroSymbol}
            alt="Símbolo Cícero João"
            className="h-12 w-auto shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] transition-transform group-hover:scale-105"
          />
          <span className="hidden sm:flex flex-col leading-tight">
            <span className="whitespace-nowrap font-serif text-lg font-semibold tracking-tight text-white">
              Cícero João
            </span>
            <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-accent/90">
              Vereador · Sorocaba
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location === link.href ? "text-accent font-semibold" : "text-secondary-foreground/85"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Top-right access buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-gold hover:text-white ring-1 ring-[hsl(var(--gold))]"
          >
            <Link href={isStaff || clerkUser ? "/portal" : "/demandas"}>
              <Send className="mr-1.5 h-4 w-4" /> Enviar Demanda
            </Link>
          </Button>

          <Show when="signed-out">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-[hsl(var(--gold))] bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/sign-in?area=eleitor">
                <UserRound className="mr-1.5 h-4 w-4" /> Área do Eleitor
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-[hsl(var(--gold))] bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/sign-in?area=admin">
                <ShieldCheck className="mr-1.5 h-4 w-4" /> Área do Administrador
              </Link>
            </Button>
          </Show>

          <Show when="signed-in">
            <Button asChild size="sm" variant="outline" className="border-[hsl(var(--gold))] bg-transparent text-white hover:bg-white/10">
              <Link href="/portal">
                <UserRound className="mr-1.5 h-4 w-4" /> Meu Portal
              </Link>
            </Button>
            {isStaff && (
              <Button asChild size="sm" variant="outline" className="border-[hsl(var(--gold))] bg-transparent text-white hover:bg-white/10">
                <Link href="/admin">
                  <ShieldCheck className="mr-1.5 h-4 w-4" /> Painel
                </Link>
              </Button>
            )}
            <Button size="sm" variant="ghost" className="text-white/80 hover:bg-white/10" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </Show>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-secondary border-b border-[hsl(var(--gold)/0.4)] shadow-lg flex flex-col p-4 gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`text-base font-medium p-2 rounded-md ${
                location === link.href ? "bg-white/10 text-accent" : "text-secondary-foreground/90"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-1 border-[hsl(var(--gold)/0.3)]" />
          <Button asChild className="w-full justify-center bg-accent text-accent-foreground hover:bg-gold hover:text-white" onClick={closeMenu}>
            <Link href={clerkUser ? "/portal" : "/demandas"}>
              <Send className="mr-1.5 h-4 w-4" /> Enviar Demanda
            </Link>
          </Button>
          <Show when="signed-out">
            <Button asChild variant="outline" className="w-full justify-center border-[hsl(var(--gold))] bg-transparent text-white hover:bg-white/10" onClick={closeMenu}>
              <Link href="/sign-in?area=eleitor">
                <UserRound className="mr-1.5 h-4 w-4" /> Área do Eleitor
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-center border-[hsl(var(--gold))] bg-transparent text-white hover:bg-white/10" onClick={closeMenu}>
              <Link href="/sign-in?area=admin">
                <ShieldCheck className="mr-1.5 h-4 w-4" /> Área do Administrador
              </Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button asChild variant="outline" className="w-full justify-center border-[hsl(var(--gold))] bg-transparent text-white hover:bg-white/10" onClick={closeMenu}>
              <Link href="/portal">
                <UserRound className="mr-1.5 h-4 w-4" /> Meu Portal
              </Link>
            </Button>
            {isStaff && (
              <Button asChild variant="outline" className="w-full justify-center border-[hsl(var(--gold))] bg-transparent text-white hover:bg-white/10" onClick={closeMenu}>
                <Link href="/admin">
                  <ShieldCheck className="mr-1.5 h-4 w-4" /> Painel Administrativo
                </Link>
              </Button>
            )}
            <Button variant="ghost" className="w-full justify-center text-white/80 hover:bg-white/10" onClick={() => { signOut(); closeMenu(); }}>
              <LogOut className="mr-1.5 h-4 w-4" /> Sair
            </Button>
          </Show>
        </div>
      )}
    </header>
  );
}
