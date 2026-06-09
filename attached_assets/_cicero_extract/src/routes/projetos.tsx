import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader, PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { projetos } from "@/lib/site-data";

export const Route = createFileRoute("/projetos")({
  head: () => ({
    meta: [
      { title: "Projetos e Leis — Cícero João" },
      { name: "description", content: "Projetos de lei, indicações e leis sancionadas de autoria do vereador Cícero João." },
      { property: "og:title", content: "Projetos e Leis — Cícero João" },
      { property: "og:description", content: "Acompanhe a produção legislativa do mandato." },
      { property: "og:url", content: "/projetos" },
    ],
    links: [{ rel: "canonical", href: "/projetos" }],
  }),
  component: Projetos,
});

function Projetos() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Produção legislativa"
        title="Projetos e Leis"
        description="Documentos públicos protocolados pelo gabinete. Cada item traz tema, status atual e um resumo em linguagem simples."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projetos.map((p) => (
            <Link
              key={p.slug}
              to="/projetos/$slug"
              params={{ slug: p.slug }}
              className="card-premium flex flex-col p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[var(--champagne)] text-[var(--grafite)] hover:bg-[var(--champagne)]">{p.tema}</Badge>
                <Badge variant="outline" className="border-[var(--ouro)] text-[var(--bordo)]">{p.status}</Badge>
                <span className="ml-auto text-xs text-muted-foreground">{p.ano}</span>
              </div>
              <h2 className="mt-4 font-display text-xl text-[var(--bordo)]">{p.titulo}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.resumo}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--bordo)]">
                Ler resumo <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
