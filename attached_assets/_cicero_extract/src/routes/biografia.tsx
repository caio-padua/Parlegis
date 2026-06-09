import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/page-shell";

export const Route = createFileRoute("/biografia")({
  head: () => ({
    meta: [
      { title: "Biografia — Cícero João" },
      { name: "description", content: "Trajetória de Cícero João: de São José do Belmonte-PE a vereador de Sorocaba-SP." },
      { property: "og:title", content: "Biografia — Cícero João" },
      { property: "og:description", content: "Trajetória de Cícero João: de São José do Belmonte-PE a vereador de Sorocaba-SP." },
      { property: "og:url", content: "/biografia" },
      { property: "og:type", content: "profile" },
    ],
    links: [{ rel: "canonical", href: "/biografia" }],
  }),
  component: Biografia,
});

function Biografia() {
  const fatos = [
    { rotulo: "Nome completo", valor: "Cícero João da Silva" },
    { rotulo: "Naturalidade", valor: "São José do Belmonte — PE" },
    { rotulo: "Profissão", valor: "Empresário" },
    { rotulo: "Escolaridade", valor: "Ensino superior completo" },
    { rotulo: "Eleição 2020", valor: "2.475 votos" },
    { rotulo: "Legislaturas", valor: "18ª (2021–2024) e 19ª (2025–2028)" },
    { rotulo: "Partido", valor: "PSB" },
    { rotulo: "Cidade", valor: "Sorocaba — SP" },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Quem é"
        title="Cícero João da Silva"
        description="De São José do Belmonte, no sertão pernambucano, à vida pública em Sorocaba. Uma trajetória construída no trabalho, no comércio e no contato direto com a comunidade."
      />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
        <article className="prose prose-neutral max-w-none">
          <h2 className="font-display text-2xl text-[var(--bordo)]">Trajetória</h2>
          <p className="text-muted-foreground leading-relaxed">
            Natural de São José do Belmonte, Pernambuco, Cícero João construiu
            em Sorocaba sua vida profissional e familiar. Empresário,
            estabeleceu raízes no comércio local e, com formação superior
            completa, transformou a vivência comunitária em compromisso
            público.
          </p>
          <h2 className="mt-8 font-display text-2xl text-[var(--bordo)]">Vida pública</h2>
          <p className="text-muted-foreground leading-relaxed">
            Eleito vereador em 2020 com 2.475 votos, iniciou seu primeiro
            mandato na 18ª Legislatura (2021–2024) da Câmara Municipal de
            Sorocaba. Reeleito, segue atuando na 19ª Legislatura (2025–2028),
            com foco em zeladoria de bairros, acessibilidade, segurança
            pública e apoio ao pequeno comércio.
          </p>
          <h2 className="mt-8 font-display text-2xl text-[var(--bordo)]">Estilo de mandato</h2>
          <p className="text-muted-foreground leading-relaxed">
            Mandato de presença: atendimento semanal no gabinete, visitas
            regulares aos bairros e diálogo com lideranças comunitárias,
            associações e comerciantes. O Gabinete Digital nasce para
            organizar e dar transparência a esse trabalho.
          </p>
        </article>
        <aside className="card-premium h-fit p-6">
          <h3 className="font-display text-lg text-[var(--bordo)]">Ficha</h3>
          <dl className="mt-4 divide-y divide-[var(--ouro)]/30 text-sm">
            {fatos.map((f) => (
              <div key={f.rotulo} className="flex justify-between gap-4 py-2.5">
                <dt className="text-muted-foreground">{f.rotulo}</dt>
                <dd className="text-right font-medium text-[var(--grafite)]">{f.valor}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>
    </PageShell>
  );
}
