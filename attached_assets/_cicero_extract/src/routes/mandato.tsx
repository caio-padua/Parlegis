import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/page-shell";
import { mandatoNumeros } from "@/lib/site-data";

export const Route = createFileRoute("/mandato")({
  head: () => ({
    meta: [
      { title: "Mandato em números — Cícero João" },
      { name: "description", content: "Produção parlamentar do vereador Cícero João: requerimentos, indicações, projetos de lei e emendas." },
      { property: "og:title", content: "Mandato em números — Cícero João" },
      { property: "og:description", content: "Produção parlamentar do vereador Cícero João." },
      { property: "og:url", content: "/mandato" },
    ],
    links: [{ rel: "canonical", href: "/mandato" }],
  }),
  component: Mandato,
});

function Mandato() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Mandato"
        title="Mandato em números"
        description="Indicadores consolidados da atuação parlamentar de Cícero João na Câmara Municipal de Sorocaba."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {mandatoNumeros.map((n) => (
            <div key={n.label} className="card-premium p-8 text-center">
              <p className="font-display text-5xl text-[var(--bordo)]">{n.numero}</p>
              <p className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">{n.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <article>
            <h2 className="font-display text-2xl text-[var(--bordo)]">18ª Legislatura · 2021–2024</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Primeiro mandato dedicado à escuta dos bairros e à organização
              das demandas mais urgentes — zeladoria, iluminação, segurança e
              acessibilidade. Período de consolidação do método de trabalho
              em campo.
            </p>
          </article>
          <article>
            <h2 className="font-display text-2xl text-[var(--bordo)]">19ª Legislatura · 2025–2028</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Mandato em curso, com expansão da estrutura de atendimento e
              lançamento do Gabinete Digital — sistema online para envio,
              acompanhamento e resposta de solicitações da população.
            </p>
          </article>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Os números acima refletem a produção parlamentar consolidada e podem
          ser conferidos nos sistemas oficiais da Câmara Municipal de Sorocaba.
        </p>
      </section>
    </PageShell>
  );
}
