import React from "react";
import { useGetMandateStats, getGetMandateStatsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle2, Megaphone, Users, Scale, AlertTriangle, UserPlus, FileSignature, Loader2 } from "lucide-react";

export default function MandatoPage() {
  const { data: stats, isLoading } = useGetMandateStats({ query: { queryKey: getGetMandateStatsQueryKey() } });

  React.useEffect(() => {
    document.title = "O Mandato - Vereador Cícero João";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Conheça os números e resultados do mandato do Vereador Cícero João em Sorocaba.");
  }, []);

  return (
    <div className="w-full bg-background pb-20">
      <div className="bg-secondary text-secondary-foreground py-16 mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">O Mandato em Números</h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl font-sans">
            Transparência e resultados: veja o impacto do nosso trabalho por Sorocaba.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover-elevate">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-6">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-5xl font-bold text-foreground mb-2">{stats?.projetosLei || 0}</h3>
                <p className="text-lg font-serif text-muted-foreground">Projetos de Lei Apresentados</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-8 text-center border-accent/20">
                <div className="mx-auto w-16 h-16 bg-accent/20 text-accent-foreground flex items-center justify-center rounded-full mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-5xl font-bold text-foreground mb-2">{stats?.leisAprovadas || 0}</h3>
                <p className="text-lg font-serif text-muted-foreground">Leis Aprovadas</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-6">
                  <Megaphone className="h-8 w-8" />
                </div>
                <h3 className="text-5xl font-bold text-foreground mb-2">{stats?.requerimentos || 0}</h3>
                <p className="text-lg font-serif text-muted-foreground">Requerimentos à Prefeitura</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-muted text-muted-foreground flex items-center justify-center rounded-full mb-6">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-5xl font-bold text-foreground mb-2">{stats?.indicacoes || 0}</h3>
                <p className="text-lg font-serif text-muted-foreground">Indicações de Melhorias</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-6">
                  <FileSignature className="h-8 w-8" />
                </div>
                <h3 className="text-5xl font-bold text-foreground mb-2">{stats?.emendas || 0}</h3>
                <p className="text-lg font-serif text-muted-foreground">Emendas Parlamentares</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate bg-secondary text-secondary-foreground">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-white/10 text-white flex items-center justify-center rounded-full mb-6">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-5xl font-bold text-white mb-2">{stats?.atendimentos || 0}</h3>
                <p className="text-lg font-serif text-white/80">Atendimentos ao Cidadão</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {stats?.updatedAt && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            Última atualização: {new Date(stats.updatedAt).toLocaleDateString("pt-BR")}
          </p>
        )}
      </div>
    </div>
  );
}
