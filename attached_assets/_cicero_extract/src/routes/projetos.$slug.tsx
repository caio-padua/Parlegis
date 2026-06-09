import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Badge } from "@/components/ui/badge";
import { projetos } from "@/lib/site-data";

export const Route = createFileRoute("/projetos/$slug")({
  loader: ({ params }) => {
    const projeto = projetos.find((p) => p.slug === params.slug);
    if (!projeto) throw notFound();
    return { projeto };
  },
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData?.projeto.titulo ?? "Projeto"} — Cícero João` },
      { name: "description", content: loaderData?.projeto.resumo ?? "Projeto do mandato." },
      { property: "og:title", content: loaderData?.projeto.titulo ?? "Projeto" },
      { property: "og:description", content: loaderData?.projeto.resumo ?? "" },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `/projetos/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/projetos/${params.slug}` }],
  }),
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-[var(--bordo)]">Projeto não encontrado</h1>
        <Link to="/projetos" className="mt-6 inline-flex items-center gap-2 text-[var(--bordo)] hover:text-[var(--vermelho)]">
          <ArrowLeft className="h-4 w-4" /> Voltar para todos os projetos
        </Link>
      </div>
    </PageShell>
  ),
  component: ProjetoDetalhe,
});

function ProjetoDetalhe() {
  const { projeto } = Route.useLoaderData();
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link to="/projetos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[var(--bordo)]">
          <ArrowLeft className="h-4 w-4" /> Todos os projetos
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge className="bg-[var(--champagne)] text-[var(--grafite)] hover:bg-[var(--champagne)]">{projeto.tema}</Badge>
          <Badge variant="outline" className="border-[var(--ouro)] text-[var(--bordo)]">{projeto.status}</Badge>
          <span className="text-xs text-muted-foreground">{projeto.ano}</span>
        </div>
        <h1 className="mt-4 font-display text-4xl leading-tight text-[var(--bordo)]">{projeto.titulo}</h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">{projeto.resumo}</p>

        <div className="card-premium mt-12 p-6 text-sm text-muted-foreground">
          O texto integral e a tramitação podem ser consultados nos sistemas
          oficiais da Câmara Municipal de Sorocaba. Em caso de dúvidas sobre
          este documento, fale com o gabinete.
        </div>

        <Link
          to="/contato"
          className="mt-8 inline-flex items-center justify-center rounded-md bg-[var(--champagne)] px-5 py-3 text-sm font-semibold text-[var(--grafite)] ring-1 ring-[var(--ouro)] hover:bg-[var(--ouro)] hover:text-[var(--branco-quente)]"
        >
          Falar com o gabinete sobre este projeto
        </Link>
      </article>
    </PageShell>
  );
}
