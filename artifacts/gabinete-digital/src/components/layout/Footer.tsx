import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <img src="/logo.svg" alt="Cícero João" className="h-12 brightness-0 invert" />
            </Link>
            <p className="text-secondary-foreground/80 max-w-sm font-sans">
              Gabinete Digital do Vereador Cícero João. 
              Compromisso, transparência e trabalho por uma Sorocaba melhor.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-bold text-lg mb-4 text-accent">Acesso Rápido</h4>
            <ul className="space-y-2 font-sans">
              <li><Link href="/biografia" className="text-secondary-foreground/80 hover:text-white transition-colors">Biografia</Link></li>
              <li><Link href="/mandato" className="text-secondary-foreground/80 hover:text-white transition-colors">O Mandato</Link></li>
              <li><Link href="/projetos" className="text-secondary-foreground/80 hover:text-white transition-colors">Projetos de Lei</Link></li>
              <li><Link href="/agenda" className="text-secondary-foreground/80 hover:text-white transition-colors">Agenda</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-lg mb-4 text-accent">Serviços ao Cidadão</h4>
            <ul className="space-y-2 font-sans">
              <li><Link href="/demandas" className="text-secondary-foreground/80 hover:text-white transition-colors">Demandas por Bairro</Link></li>
              <li><Link href="/acompanhar" className="text-secondary-foreground/80 hover:text-white transition-colors">Acompanhar Protocolo</Link></li>
              <li><Link href="/portal" className="text-secondary-foreground/80 hover:text-white transition-colors">Meu Portal</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between font-sans text-sm text-secondary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Gabinete Vereador Cícero João. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <span>Sorocaba, SP - Brasil</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
