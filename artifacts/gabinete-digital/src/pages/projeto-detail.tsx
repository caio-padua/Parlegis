import React from "react";
import { useParams, Link } from "wouter";
import { useGetProject } from "@workspace/api-client-react";
import { getGetProjectQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ExternalLink, Calendar, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjetoDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data: project, isLoading, error } = useGetProject(id, {
    query: { enabled: !!id, queryKey: getGetProjectQueryKey(id) }
  });

  React.useEffect(() => {
    if (project) {
      document.title = `${project.title} - Vereador Cícero João`;
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground">Projeto não encontrado</h2>
        <Button asChild variant="link" className="mt-4">
          <Link href="/projetos">Voltar para a lista</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-background pb-20">
      <div className="bg-secondary text-secondary-foreground py-12 mb-8">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link href="/projetos" className="inline-flex items-center text-secondary-foreground/70 hover:text-white mb-6 transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Projetos
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 text-sm uppercase tracking-wider">
              {project.type.replace("_", " ")}
            </Badge>
            <Badge variant="outline" className="text-white border-white/30 text-sm uppercase">
              {project.status.replace("_", " ")}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
            {project.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="bg-card rounded-xl border shadow-sm p-6 md:p-10">
          
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-medium">Ano: {project.year || "Não informado"}</span>
            </div>
            {project.theme && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-5 w-5 text-primary" />
                <span className="font-medium">Tema: {project.theme}</span>
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-p:text-foreground/80 prose-p:font-sans">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ementa / Resumo</h2>
            <p className="whitespace-pre-wrap">{project.summary}</p>
          </div>

          {project.documentUrl && (
            <div className="mt-12 pt-8 border-t border-border">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2">
                <a href={project.documentUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-5 w-5" />
                  Ver Documento Original
                  <ExternalLink className="h-4 w-4 opacity-50" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
