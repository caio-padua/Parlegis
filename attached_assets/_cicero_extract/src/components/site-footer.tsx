import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-[var(--petroleo)] text-[var(--branco-quente)]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--bordo)] text-[var(--champagne)] font-display text-lg font-bold ring-1 ring-[var(--ouro)]/60">
                CJ
              </span>
              <div>
                <p className="font-display text-xl">Gabinete Digital Cícero João</p>
                <p className="text-sm text-[var(--champagne)]/90">
                  Sorocaba ouvida. Demandas organizadas. Trabalho acompanhado.
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm text-white/75 leading-relaxed">
              Um mandato próximo, organizado e aberto para ouvir a população. Acompanhe
              projetos, agenda pública e envie suas demandas pelo gabinete digital.
            </p>
          </div>

          <div>
            <h3 className="font-display text-base text-[var(--champagne)]">Institucional</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link to="/biografia" className="hover:text-[var(--champagne)]">Biografia</Link></li>
              <li><Link to="/mandato" className="hover:text-[var(--champagne)]">Mandato em números</Link></li>
              <li><Link to="/projetos" className="hover:text-[var(--champagne)]">Projetos e leis</Link></li>
              <li><Link to="/agenda" className="hover:text-[var(--champagne)]">Agenda pública</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base text-[var(--champagne)]">Contato</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-[var(--ouro)]" />
                Câmara Municipal de Sorocaba — SP
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-[var(--ouro)]" />
                (15) 0000-0000
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-[var(--ouro)]" />
                contato@cicerojoao.com.br
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" aria-label="Instagram" className="rounded-full border border-[var(--ouro)]/40 p-2 hover:bg-white/10">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full border border-[var(--ouro)]/40 p-2 hover:bg-white/10">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--ouro)]/25 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Gabinete Cícero João. Todos os direitos reservados.</p>
          <p>Mandato vinculado ao <span className="text-[var(--champagne)]">PSB</span> — Sorocaba/SP.</p>
        </div>
      </div>
    </footer>
  );
}
