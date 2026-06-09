import React from "react";
import { useParams, Link } from "wouter";
import { useGetNewsArticle, getGetNewsArticleQueryKey } from "@workspace/api-client-react";
import { Loader2, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoticiaDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data: article, isLoading, error } = useGetNewsArticle(id, {
    query: { enabled: !!id, queryKey: getGetNewsArticleQueryKey(id) }
  });

  React.useEffect(() => {
    if (article) {
      document.title = `${article.title} - Vereador Cícero João`;
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground">Notícia não encontrada</h2>
        <Button asChild variant="link" className="mt-4">
          <Link href="/noticias">Voltar para notícias</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-background pb-20">
      {/* Header without image if it has an image (image goes below), or big header if no image */}
      <div className="bg-secondary text-secondary-foreground py-12 mb-8">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <Link href="/noticias" className="inline-flex items-center text-secondary-foreground/70 hover:text-white mb-6 transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Notícias
          </Link>
          <div className="flex items-center text-secondary-foreground/80 mb-4 font-medium">
            <Calendar className="h-5 w-5 mr-2" />
            {new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-xl text-secondary-foreground/90 font-sans leading-relaxed border-l-4 border-primary pl-4">
            {article.summary}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        {article.imageUrl && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-md">
            <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover max-h-[500px]" />
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/80 prose-p:font-sans prose-a:text-primary">
          {/* Simple formatting for body text (could use markdown if API returns it, assuming plain text with newlines) */}
          {article.body.split('\n').map((paragraph, idx) => (
            paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
