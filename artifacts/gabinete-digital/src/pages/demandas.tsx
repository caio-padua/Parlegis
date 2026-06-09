import React from "react";
import { Link } from "wouter";
import { useGetDemandsByNeighborhood, useGetDemandsByCategory, getGetDemandsByNeighborhoodQueryKey, getGetDemandsByCategoryQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DemandasPage() {
  const { data: demandsByNeighborhood, isLoading: loadingNeighborhoods } = useGetDemandsByNeighborhood({
    query: { enabled: true, queryKey: getGetDemandsByNeighborhoodQueryKey() }
  });
  const { data: demandsByCategory, isLoading: loadingCategories } = useGetDemandsByCategory({
    query: { enabled: true, queryKey: getGetDemandsByCategoryQueryKey() }
  });

  React.useEffect(() => {
    document.title = "Demandas por Bairro - Vereador Cícero João";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Veja as principais solicitações dos bairros de Sorocaba e envie a sua demanda.");
  }, []);

  return (
    <div className="w-full bg-background pb-20">
      <div className="bg-secondary text-secondary-foreground py-16 mb-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Demandas por Bairro</h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl font-sans">
            Acompanhe o que os moradores de Sorocaba estão solicitando e envie as necessidades da sua rua ou bairro.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-12">
            {/* By Neighborhood */}
            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-6 flex items-center gap-2">
                <MapPin className="text-primary" /> Demandas por Região
              </h2>
              {loadingNeighborhoods ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {demandsByNeighborhood?.map((n) => (
                    <Card key={n.neighborhoodId} className="hover-elevate">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground">{n.name}</p>
                          {n.region && <p className="text-sm text-muted-foreground">{n.region}</p>}
                        </div>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {n.count}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* By Category */}
            <section>
              <h2 className="text-2xl font-bold font-serif text-foreground mb-6">Principais Assuntos</h2>
              {loadingCategories ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {demandsByCategory?.map((c) => (
                    <Card key={c.categoryId} className="hover-elevate text-center">
                      <CardContent className="p-6">
                        <Badge className="mb-4 bg-primary/10 text-primary border-transparent text-xl px-3 py-1 hover:bg-primary/10">
                          {c.count}
                        </Badge>
                        <p className="font-bold text-foreground">{c.name}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-primary text-primary-foreground border-none">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold font-serif text-white mb-4">Sua rua precisa de atenção?</h3>
                <p className="text-primary-foreground/90 mb-6 text-sm">
                  Buracos, falta de iluminação, problemas no posto de saúde. Mande sua solicitação para a nossa equipe fiscalizar.
                </p>
                <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/portal">Nova Demanda</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-muted border-none">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold font-serif text-foreground mb-2 flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" /> Acompanhar Protocolo
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Já enviou uma demanda? Digite o número do protocolo para ver o status.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/acompanhar">Consultar Protocolo <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
