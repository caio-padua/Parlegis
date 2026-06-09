import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageHeader, PageShell } from "@/components/page-shell";
import { agenda } from "@/lib/site-data";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda pública — Cícero João" },
      { name: "description", content: "Atendimentos, reuniões e visitas do mandato do vereador Cícero João." },
      { property: "og:title", content: "Agenda pública — Cícero João" },
      { property: "og:description", content: "Atendimentos, reuniões e visitas do mandato." },
      { property: "og:url", content: "/agenda" },
    ],
    links: [{ rel: "canonical", href: "/agenda" }],
  }),
  component: Agenda,
});

function Agenda() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Agenda pública"
        title="Compromissos do gabinete"
        description="Atendimentos fixos, reuniões abertas e ações nos bairros. Para encontros particulares, agende pelo formulário."
      />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <ul className="space-y-4">
          {agenda.map((a) => (
            <li key={a.titulo} className="card-premium flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--bordo)] text-[var(--champagne)]">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--bordo)]">{a.data}</p>
                <p className="mt-1 font-display text-lg text-[var(--grafite)]">{a.titulo}</p>
                <p className="text-sm text-muted-foreground">{a.local}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
