import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, FileText, MapPin, Send } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroFotoAsset from "@/assets/cicero-joao.jpg.asset.json";
const heroFoto = heroFotoAsset.url;
import sorocabaImg from "@/assets/sorocaba.jpg";
import {
  agenda,
  areasTematicas,
  bairros,
  mandatoNumeros,
  noticias,
  projetos,
} from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cícero João — Vereador de Sorocaba" },
      {
        name: "description",
        content:
          "Portal do mandato do vereador Cícero João: atendimento, presença nos bairros e transparência em um só lugar.",
      },
      { property: "og:title", content: "Cícero João — Vereador de Sorocaba" },
      {
        property: "og:description",
        content:
          "Atendimento, presença nos bairros e transparência em um só lugar.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <PageShell>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--ouro)]/30 bg-[var(--branco-quente)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bordo)]">
              Gabinete Digital · Sorocaba
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-[var(--bordo)] sm:text-6xl">
              Cícero João
            </h1>
            <p className="mt-3 font-display text-2xl text-[var(--petroleo)]">
              Vereador por Sorocaba
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Um mandato próximo, organizado e aberto para ouvir a população.
              Atendimento, presença nos bairros e transparência em um só lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-md bg-[var(--champagne)] text-[var(--grafite)] ring-1 ring-[var(--ouro)] hover:bg-[var(--ouro)] hover:text-[var(--branco-quente)]">
                <Link to="/contato">
                  <Send className="mr-2 h-4 w-4" /> Enviar uma demanda
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-md border-[var(--ouro)] text-[var(--bordo)] hover:bg-[var(--champagne)]/40">
                <Link to="/agenda">
                  <CalendarDays className="mr-2 h-4 w-4" /> Agendar atendimento
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="rounded-md text-[var(--bordo)] hover:bg-[var(--creme)]">
                <Link to="/projetos">
                  <FileText className="mr-2 h-4 w-4" /> Conhecer projetos
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -translate-x-3 translate-y-3 rounded-[2rem] bg-[var(--champagne)]/60" aria-hidden />
            <img
              src={heroFoto}
              alt="Retrato institucional do vereador Cícero João"
              width={1024}
              height={1280}
              className="relative aspect-[4/5] w-full rounded-[2rem] object-cover shadow-elegant ring-1 ring-[var(--ouro)]/40"
            />
          </div>
        </div>
      </section>

      {/* CARDS RÁPIDOS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bordo)]">Áreas de atuação</p>
          <h2 className="mt-3 font-display text-3xl text-[var(--bordo)] sm:text-4xl">
            Onde o gabinete trabalha
          </h2>
          <p className="mt-3 text-muted-foreground">
            Demandas organizadas por temas que afetam o dia a dia do sorocabano.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {areasTematicas.map((a) => (
            <div key={a.titulo} className="card-premium p-6">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--bordo)]/10 text-[var(--bordo)]">
                <span className="font-display text-lg">{a.titulo.charAt(0)}</span>
              </div>
              <h3 className="mt-4 font-display text-lg text-[var(--bordo)]">{a.titulo}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MANDATO EM NÚMEROS */}
      <section className="border-y border-[var(--ouro)]/30 bg-[var(--petroleo)] text-[var(--branco-quente)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--champagne)]">
            Mandato em números
          </p>
          <h2 className="mt-3 font-display text-3xl text-[var(--branco-quente)] sm:text-4xl">
            Produção parlamentar
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {mandatoNumeros.map((n) => (
              <div key={n.label} className="rounded-2xl border border-[var(--ouro)]/30 bg-white/5 p-6 text-center">
                <p className="font-display text-4xl text-[var(--champagne)]">{n.numero}</p>
                <p className="mt-2 text-sm uppercase tracking-wider text-white/75">{n.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-white/60">
            Dados consolidados a partir dos registros públicos da Câmara Municipal de Sorocaba. Sujeito a atualização.
          </p>
        </div>
      </section>

      {/* GABINETE DIGITAL */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="card-premium grid gap-10 p-10 lg:grid-cols-[2fr_1fr] lg:p-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bordo)]">Gabinete Digital</p>
            <h2 className="mt-3 font-display text-3xl text-[var(--bordo)] sm:text-4xl">
              Sua demanda no celular, do começo ao fim
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Em breve você poderá enviar sua solicitação, anexar foto, acompanhar
              o andamento e falar com a equipe pelo próprio site — sem perder
              tempo e com transparência total.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-md bg-[var(--champagne)] text-[var(--grafite)] ring-1 ring-[var(--ouro)] hover:bg-[var(--ouro)] hover:text-[var(--branco-quente)]">
                <Link to="/contato">Acessar área do cidadão <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          <ul className="grid gap-3 text-sm">
            {["Enviar solicitação", "Acompanhar protocolo", "Anexar foto e localização", "Falar com a equipe"].map((i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-[var(--ouro)]/40 bg-[var(--creme)] px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-[var(--bordo)]" />
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* BAIRROS */}
      <section className="border-y border-[var(--ouro)]/30 bg-[var(--branco-quente)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bordo)]">Sorocaba por bairros</p>
            <h2 className="mt-3 font-display text-3xl text-[var(--bordo)] sm:text-4xl">
              Presente onde o cidadão mora
            </h2>
            <p className="mt-4 text-muted-foreground">
              O gabinete acompanha demandas em todas as regiões de Sorocaba —
              do Centro à periferia, com foco em zeladoria, segurança e
              acessibilidade.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {bairros.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--ouro)]/40 bg-[var(--creme)] px-3 py-1.5 text-xs font-medium text-[var(--grafite)]">
                  <MapPin className="h-3 w-3 text-[var(--bordo)]" /> {b}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src={sorocabaImg}
              alt="Vista aérea de bairros de Sorocaba ao entardecer"
              width={1600}
              height={900}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-elegant ring-1 ring-[var(--ouro)]/40"
            />
          </div>
        </div>
      </section>

      {/* PROJETOS EM DESTAQUE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bordo)]">Projetos e leis</p>
            <h2 className="mt-3 font-display text-3xl text-[var(--bordo)] sm:text-4xl">Em destaque</h2>
          </div>
          <Link to="/projetos" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[var(--bordo)] hover:text-[var(--vermelho)]">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projetos.slice(0, 3).map((p) => (
            <Link
              key={p.slug}
              to="/projetos/$slug"
              params={{ slug: p.slug }}
              className="card-premium flex flex-col p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-2">
                <Badge className="bg-[var(--champagne)] text-[var(--grafite)] hover:bg-[var(--champagne)]">{p.tema}</Badge>
                <Badge variant="outline" className="border-[var(--ouro)] text-[var(--bordo)]">{p.status}</Badge>
              </div>
              <h3 className="mt-4 font-display text-xl text-[var(--bordo)]">{p.titulo}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.resumo}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--bordo)]">
                Ler mais <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NOTÍCIAS + AGENDA */}
      <section className="border-t border-[var(--ouro)]/30 bg-[var(--branco-quente)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bordo)]">Notícias</p>
            <h2 className="mt-3 font-display text-3xl text-[var(--bordo)]">Atuação recente</h2>
            <ul className="mt-8 space-y-6">
              {noticias.map((n) => (
                <li key={n.titulo} className="border-b border-[var(--ouro)]/30 pb-6 last:border-none">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{n.data}</p>
                  <h3 className="mt-1 font-display text-lg text-[var(--bordo)]">{n.titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{n.resumo}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--bordo)]">Agenda pública</p>
            <h2 className="mt-3 font-display text-3xl text-[var(--bordo)]">Próximos compromissos</h2>
            <ul className="mt-8 space-y-4">
              {agenda.map((a) => (
                <li key={a.titulo} className="card-premium p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--bordo)]">{a.data}</p>
                  <p className="mt-1 font-display text-base text-[var(--grafite)]">{a.titulo}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.local}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
