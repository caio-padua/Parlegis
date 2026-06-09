import React from "react";
import { useListProjects, getListProjectsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProjetosPage() {
  const [type, setType] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");
  
  const { data: projects, isLoading } = useListProjects(undefined, { 
    query: { enabled: true, queryKey: getListProjectsQueryKey() } 
  });

  React.useEffect(() => {
    document.title = "Projetos - Vereador Cícero João";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Conheça os projetos de lei, requerimentos e indicações do Vereador Cícero João.");
  }, []);

  const filteredProjects = projects?.filter(p => {
    if (type !== "all" && p.type !== type) return false;
    if (status !== "all" && p.status !== status) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sancionado": return "bg-green-100 text-green-800 border-green-200";
      case "aprovado": return "bg-blue-100 text-blue-800 border-blue-200";
      case "em_tramitacao": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "arquivado": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="w-full bg-background pb-20">
      <div className="bg-secondary text-secondary-foreground py-16 mb-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Projetos e Ações</h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl font-sans">
            Acompanhe as propostas, projetos de lei e ofícios enviados pelo nosso mandato.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-muted/50 p-4 rounded-lg border">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block text-foreground">Tipo de Documento</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="projeto_lei">Projeto de Lei</SelectItem>
                <SelectItem value="requerimento">Requerimento</SelectItem>
                <SelectItem value="indicacao">Indicação</SelectItem>
                <SelectItem value="emenda">Emenda</SelectItem>
                <SelectItem value="lei">Lei Sancionada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1.5 block text-foreground">Situação</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Todas as situações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as situações</SelectItem>
                <SelectItem value="protocolado">Protocolado</SelectItem>
                <SelectItem value="em_tramitacao">Em Tramitação</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="sancionado">Sancionado</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mt-2">Tente ajustar os filtros de busca.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects?.map(project => (
              <Card key={project.id} className="hover-elevate flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-wider whitespace-nowrap">
                      {project.type.replace("_", " ")}
                    </span>
                    <Badge variant="outline" className={`${getStatusColor(project.status)} whitespace-nowrap`}>
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold font-serif mb-3 text-foreground">{project.title}</h3>
                  <p className="text-muted-foreground font-sans line-clamp-3 mb-6 flex-1">
                    {project.summary}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t">
                    <span className="text-sm font-medium text-muted-foreground">{project.year}</span>
                    <Link href={`/projetos/${project.id}`} className="text-primary font-semibold font-sans text-sm inline-flex items-center hover:underline">
                      Ver Detalhes <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
