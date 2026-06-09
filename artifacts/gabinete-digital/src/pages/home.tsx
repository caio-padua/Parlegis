import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, CheckCircle2, Megaphone, Users, Calendar, MapPin } from "lucide-react";
import { useGetMandateStats, useListProjects, useListNews, getGetMandateStatsQueryKey, getListProjectsQueryKey, getListNewsQueryKey } from "@workspace/api-client-react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLocation("/portal");
    }
  }, [isLoaded, isSignedIn, setLocation]);

  const { data: stats } = useGetMandateStats({ query: { queryKey: getGetMandateStatsQueryKey() } });
  const { data: projects } = useListProjects({}, { query: { enabled: true, queryKey: getListProjectsQueryKey({}) } });
  const { data: news } = useListNews({ query: { enabled: true, queryKey: getListNewsQueryKey() } });

  // Update document title
  React.useEffect(() => {
    document.title = "Gabinete Digital - Vereador Cícero João";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Portal institucional e gabinete digital do Vereador Cícero João. Acompanhe nosso trabalho e envie suas demandas.");
  }, []);

  if (isSignedIn) return null; // Prevent flash before redirect

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary text-secondary-foreground py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent font-medium text-sm mb-6 uppercase tracking-wider">
              Sorocaba, SP
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 text-white">
              Seu gabinete digital, <br />
              <span className="text-accent">sempre de portas abertas.</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/80 mb-8 max-w-2xl font-sans">
              O mandato do Vereador Cícero João é feito com e para a população. Acompanhe nossos projetos, fiscalize as ações e envie as demandas do seu bairro diretamente para a nossa equipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base">
                <Link href="/sign-up">Enviar uma Demanda <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base border-accent text-accent hover:bg-accent/10">
                <Link href="/mandato">Ver Ações do Mandato</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mandate in Numbers Highlight */}
      <section className="py-16 bg-background relative z-20 -mt-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-card border shadow-xl rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-foreground">O Mandato em Números</h2>
              <p className="text-muted-foreground mt-3 font-sans max-w-2xl mx-auto">
                Transparência é o pilar do nosso trabalho. Veja o que já realizamos por Sorocaba.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-bold text-primary">{stats?.projetosLei || 0}</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Projetos de Lei</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-accent/20 text-accent-foreground mb-4">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-bold text-foreground">{stats?.leisAprovadas || 0}</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Leis Aprovadas</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary mb-4">
                  <Megaphone className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-bold text-primary">{stats?.requerimentos || 0}</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Requerimentos</p>
              </div>
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-accent/20 text-accent-foreground mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-4xl font-bold text-foreground">{stats?.atendimentos || 0}</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Atendimentos</p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild variant="link" className="text-primary font-semibold">
                <Link href="/mandato">Ver relatório completo <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground">Projetos em Destaque</h2>
              <p className="text-muted-foreground mt-2 font-sans">Nossas principais propostas para melhorar a cidade.</p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/projetos">Ver Todos</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects?.slice(0, 3).map((project) => (
              <Card key={project.id} className="hover-elevate overflow-hidden border-border/50">
                <CardContent className="p-6">
                  <div className="mb-4 flex gap-2 items-center">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider">
                      {project.type.replace("_", " ")}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">{project.year}</span>
                  </div>
                  <h3 className="text-xl font-bold font-serif mb-3 text-foreground line-clamp-2">{project.title}</h3>
                  <p className="text-muted-foreground font-sans line-clamp-3 mb-6">
                    {project.summary}
                  </p>
                  <Link href={`/projetos/${project.id}`} className="text-primary font-semibold font-sans text-sm inline-flex items-center hover:underline">
                    Ler proposta completa <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Citizen Call to Action */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517736996303-4e64a4f873b1?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <MapPin className="h-16 w-16 mx-auto mb-6 text-accent" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">
            Seu bairro precisa de melhorias?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 font-sans">
            Buracos na rua, iluminação pública apagada, problemas no posto de saúde. 
            Não espere, envie sua demanda diretamente para a nossa equipe fiscalizar e cobrar a prefeitura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-base">
              <Link href="/sign-up">Fazer uma Solicitação</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base border-white text-white hover:bg-white/10">
              <Link href="/acompanhar">Acompanhar Protocolo</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
