import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/page-shell";
import { noticias } from "@/lib/site-data";

export const Route = createFileRoute("/noticias")({
  head: () => ({
    meta: [
      { title: "Notícias — Cícero João" },
      { name: "description", content: "Atuação recente, audiências, projetos e resultados do gabinete." },
      { property: "og:title", content: "Notícias — Cícero João" },
      { property: "og:description", content: "Atuação recente do mandato." },
      { property: "og:url", content: "/noticias" },
    ],
    links: [{ rel: "canonical", href: "/noticias" }],
  }),
  component: Noticias,
});

function Noticias() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Notícias"
        title="Atuação recente"
        description="O que tem sido feito, em quais bairros e com quais resultados."
      />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="space-y-8">
          {noticias.map((n) => (
            <li key={n.titulo} className="card-premium p-7">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{n.data}</p>
              <h2 className="mt-2 font-display text-xl text-[var(--bordo)]">{n.titulo}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{n.resumo}</p>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
