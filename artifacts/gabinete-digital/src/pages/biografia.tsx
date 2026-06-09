import React from "react";

export default function BiografiaPage() {
  React.useEffect(() => {
    document.title = "Biografia - Vereador Cícero João";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Conheça a história, trajetória e os valores do Vereador Cícero João.");
  }, []);

  return (
    <div className="w-full bg-background pb-20">
      <div className="bg-secondary text-secondary-foreground py-16 mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Biografia</h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl font-sans">
            Conheça a trajetória de luta e compromisso com o povo de Sorocaba.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4] bg-muted relative">
              {/* Fallback image if custom not available, but styled nicely */}
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10" />
              <img 
                src="https://images.unsplash.com/photo-1556484606-2580b2a8f8d2?q=80&w=1500&auto=format&fit=crop" 
                alt="Vereador Cícero João" 
                className="w-full h-full object-cover grayscale-[20%]"
              />
            </div>
          </div>
          
          <div className="lg:col-span-8 prose prose-lg prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:font-sans prose-p:leading-relaxed max-w-none">
            <h2 className="text-3xl font-bold text-primary mb-6">Trabalho, Dedicação e Resultado</h2>
            
            <p>
              Cícero João é um cidadão que conhece de perto a realidade das ruas de Sorocaba. Nascido e criado no seio de uma família trabalhadora, aprendeu desde cedo que as conquistas vêm através do esforço contínuo e da solidariedade. 
            </p>
            
            <p>
              Sua trajetória no serviço público começou muito antes de ocupar uma cadeira no Legislativo. Como líder comunitário, atuou ativamente na organização de melhorias para os bairros da zona norte, liderando mutirões, campanhas de arrecadação e servindo como ponte entre os moradores e o poder público.
            </p>

            <h3 className="text-2xl font-bold text-secondary mt-10 mb-4">Na Câmara Municipal</h3>
            
            <p>
              Eleito pelo Partido Socialista Brasileiro (PSB), Cícero João assumiu seu mandato com um compromisso claro: fazer do seu gabinete uma extensão da casa de cada cidadão sorocabano. 
            </p>
            
            <p>
              Seu trabalho no Legislativo tem se destacado pela forte fiscalização dos serviços públicos — especialmente na saúde e na zeladoria urbana —, pela proposição de leis focadas na acessibilidade, educação básica de qualidade e apoio ao microempreendedor local.
            </p>

            <div className="bg-muted/50 p-8 rounded-xl border border-border my-10 relative">
              <span className="text-6xl text-accent absolute top-4 left-4 opacity-50 font-serif">"</span>
              <p className="text-xl font-serif italic text-foreground relative z-10 font-medium pl-6">
                Um mandato não se constrói dentro de um escritório com ar-condicionado. Se constrói caminhando pelos bairros, ouvindo quem mais precisa e cobrando soluções. O mandato é do povo.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-secondary mb-4">Valores</h3>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mt-6">
              <li className="flex items-start gap-3 bg-card p-4 rounded-lg border shadow-sm">
                <div className="bg-primary/10 p-2 rounded text-primary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h4 className="font-bold font-sans text-foreground">Transparência Total</h4>
                  <p className="text-sm text-muted-foreground">Cada centavo público e cada ação do mandato abertos à população.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-card p-4 rounded-lg border shadow-sm">
                <div className="bg-accent/20 p-2 rounded text-accent-foreground">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold font-sans text-foreground">Aproximação Popular</h4>
                  <p className="text-sm text-muted-foreground">O Gabinete Digital é a prova de que queremos ouvir você o tempo todo.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-card p-4 rounded-lg border shadow-sm">
                <div className="bg-primary/10 p-2 rounded text-primary">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold font-sans text-foreground">Gestão Eficiente</h4>
                  <p className="text-sm text-muted-foreground">Foco em resultados concretos, menos burocracia e mais ação.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-card p-4 rounded-lg border shadow-sm">
                <div className="bg-accent/20 p-2 rounded text-accent-foreground">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold font-sans text-foreground">Defesa da Família</h4>
                  <p className="text-sm text-muted-foreground">Políticas públicas que fortalecem o desenvolvimento familiar e social.</p>
                </div>
              </li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}
