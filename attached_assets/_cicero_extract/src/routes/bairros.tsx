import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PageHeader, PageShell } from "@/components/page-shell";
import { bairros } from "@/lib/site-data";

export const Route = createFileRoute("/bairros")({
  head: () => ({
    meta: [
      { title: "Sorocaba por bairros — Cícero João" },
      { name: "description", content: "Atuação do gabinete nos bairros de Sorocaba: do Centro à periferia." },
      { property: "og:title", content: "Sorocaba por bairros — Cícero João" },
      { property: "og:description", content: "Atuação do gabinete nos bairros de Sorocaba." },
      { property: "og:url", content: "/bairros" },
    ],
    links: [{ rel: "canonical", href: "/bairros" }],
  }),
  component: Bairros,
});

function Bairros() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Sorocaba por bairros"
        title="Presente onde o cidadão mora"
        description="O gabinete acompanha demandas em todas as regiões da cidade. Selecione seu bairro para enviar uma solicitação específica."
      />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {bairros.map((b) => (
            <div key={b} className="card-premium flex items-center gap-3 px-5 py-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--bordo)]/10 text-[var(--bordo)]">
                <MapPin className="h-4 w-4" />
              </span>
              <span className="font-medium text-[var(--grafite)]">{b}</span>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          Não encontrou seu bairro? Envie sua demanda pelo formulário de contato — o gabinete cobre toda Sorocaba.
        </p>
      </section>
    </PageShell>
  );
}
