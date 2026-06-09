import React from "react";
import { Link, useLocation } from "wouter";
import { Show, useClerk, useUser } from "@clerk/react";
import { useGetCurrentUser, getGetCurrentUserQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

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

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Cícero João" className="h-12" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary font-semibold" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Show when="signed-out">
            <Link href="/sign-in" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Entrar
            </Link>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/sign-up">Cadastrar</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            {dbUser?.role === "admin" && (
              <Button asChild variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/5">
                <Link href="/admin">Admin Panel</Link>
              </Button>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link href="/portal">Meu Portal</Link>
            </Button>
            <Button variant="secondary" size="sm" onClick={() => signOut()}>
              Sair
            </Button>
          </Show>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-background border-b shadow-lg flex flex-col p-4 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={`text-lg font-medium p-2 rounded-md ${
                location === link.href ? "bg-primary/10 text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2" />
          <Show when="signed-out">
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full justify-center" onClick={closeMenu}>
                <Link href="/sign-in">Entrar</Link>
              </Button>
              <Button asChild className="w-full justify-center bg-primary" onClick={closeMenu}>
                <Link href="/sign-up">Cadastrar</Link>
              </Button>
            </div>
          </Show>
          <Show when="signed-in">
             <div className="flex flex-col gap-2">
              {dbUser?.role === "admin" && (
                <Button asChild variant="outline" className="w-full justify-center border-primary text-primary" onClick={closeMenu}>
                  <Link href="/admin">Admin Panel</Link>
                </Button>
              )}
              <Button asChild variant="secondary" className="w-full justify-center" onClick={closeMenu}>
                <Link href="/portal">Meu Portal</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-center text-destructive" onClick={() => { signOut(); closeMenu(); }}>
                Sair
              </Button>
            </div>
          </Show>
        </div>
      )}
    </header>
  );
}
