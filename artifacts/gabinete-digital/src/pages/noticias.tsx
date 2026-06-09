import React from "react";
import { Link } from "wouter";
import { useListNews, getListNewsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Calendar, ArrowRight } from "lucide-react";

export default function NoticiasPage() {
  const { data: news, isLoading } = useListNews({
    query: { enabled: true, queryKey: getListNewsQueryKey() }
  });

  React.useEffect(() => {
    document.title = "Notícias - Vereador Cícero João";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Fique por dentro das últimas notícias, ações e realizações do mandato.");
  }, []);

  return (
    <div className="w-full bg-background pb-20">
      <div className="bg-secondary text-secondary-foreground py-16 mb-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Notícias</h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl font-sans">
            Fique atualizado sobre as ações do mandato e os acontecimentos em Sorocaba.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : news?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
            <h3 className="text-xl font-bold text-foreground">Nenhuma notícia encontrada</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news?.map((article) => (
              <Card key={article.id} className="hover-elevate overflow-hidden flex flex-col">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {article.imageUrl ? (
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-secondary/10">
                      <img src="/logo.svg" alt="Cícero João" className="h-12 opacity-20 grayscale" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-muted-foreground mb-3 font-medium">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
                  </div>
                  <h3 className="text-xl font-bold font-serif mb-3 text-foreground line-clamp-2">
                    <Link href={`/noticias/${article.id}`} className="hover:text-primary transition-colors">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground font-sans line-clamp-3 mb-6 flex-1">
                    {article.summary}
                  </p>
                  <Link href={`/noticias/${article.id}`} className="text-primary font-semibold font-sans text-sm inline-flex items-center hover:underline mt-auto">
                    Ler matéria <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
