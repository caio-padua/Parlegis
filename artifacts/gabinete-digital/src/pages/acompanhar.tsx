import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTrackDemand, getTrackDemandQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, CheckCircle2, Clock, Inbox, Archive, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const trackSchema = z.object({
  protocol: z.string().min(1, "Digite o número do protocolo"),
});

export default function AcompanharPage() {
  const [protocol, setProtocol] = React.useState<string | null>(null);

  React.useEffect(() => {
    document.title = "Acompanhar Protocolo - Vereador Cícero João";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Consulte o andamento da sua solicitação ou demanda no Gabinete Digital.");
  }, []);

  const form = useForm<z.infer<typeof trackSchema>>({
    resolver: zodResolver(trackSchema),
    defaultValues: { protocol: "" },
  });

  function onSubmit(values: z.infer<typeof trackSchema>) {
    setProtocol(values.protocol);
  }

  // We only fetch when protocol is set
  const { data: tracking, isLoading, error } = useTrackDemand(protocol || "", {
    query: { enabled: !!protocol, retry: false, queryKey: getTrackDemandQueryKey(protocol || "") }
  });

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "resolvida": return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "arquivada": return <Archive className="h-5 w-5 text-gray-500" />;
      case "recebida": return <Inbox className="h-5 w-5 text-blue-500" />;
      case "em_analise": 
      case "encaminhada":
      case "aguardando_resposta":
      case "em_acompanhamento":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "resolvida": return "bg-green-100 text-green-800 border-green-200";
      case "arquivada": return "bg-gray-100 text-gray-800 border-gray-200";
      case "recebida": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <div className="w-full bg-background pb-20 min-h-[calc(100vh-8rem)]">
      <div className="bg-secondary text-secondary-foreground py-16 mb-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Acompanhar Protocolo</h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto font-sans">
            Consulte o andamento da sua solicitação.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <Card className="mb-8">
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <FormField
                  control={form.control}
                  name="protocol"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full">
                      <FormLabel>Número do Protocolo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: DEM-12345" className="h-12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="h-12 w-full sm:w-auto" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5 mr-2" />}
                  Consultar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {protocol && isLoading && (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {protocol && error && !isLoading && (
          <div className="text-center p-8 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
            <XCircle className="h-10 w-10 mx-auto mb-4 opacity-80" />
            <h3 className="text-lg font-bold">Protocolo não encontrado</h3>
            <p className="text-sm mt-1">Verifique se o número foi digitado corretamente.</p>
          </div>
        )}

        {protocol && tracking && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted p-6 border-b">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Protocolo: {tracking.protocol}</p>
                    <h2 className="text-2xl font-bold font-serif text-foreground">{tracking.title}</h2>
                  </div>
                  <Badge className={`${getStatusColor(tracking.status)} px-3 py-1 text-sm whitespace-nowrap`}>
                    {tracking.status.replace(/_/g, " ")}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>Data: {new Date(tracking.createdAt).toLocaleDateString('pt-BR')}</span>
                  {tracking.categoryName && <span>Categoria: {tracking.categoryName}</span>}
                  {tracking.neighborhoodName && <span>Bairro: {tracking.neighborhoodName}</span>}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold font-serif mb-6 text-foreground">Histórico e Atualizações</h3>
                
                {tracking.activities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Nenhuma atualização registrada ainda.</p>
                ) : (
                  <div className="relative border-l border-border ml-3 space-y-8 pb-4">
                    {tracking.activities.map((activity, index) => (
                      <div key={activity.id} className="relative pl-6">
                        <div className="absolute -left-3 top-1 bg-background border border-border rounded-full p-1 shadow-sm">
                          {getStatusIcon(activity.status || tracking.status)}
                        </div>
                        <div className="mb-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            {new Date(activity.createdAt).toLocaleDateString('pt-BR')} às {new Date(activity.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}
                          </span>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg border border-border">
                          <p className="text-foreground whitespace-pre-wrap">{activity.note}</p>
                          {activity.authorName && (
                            <p className="text-sm text-muted-foreground mt-2 italic">- {activity.authorName}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
