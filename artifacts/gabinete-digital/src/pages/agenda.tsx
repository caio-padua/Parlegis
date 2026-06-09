import React from "react";
import { useListAgenda, getListAgendaQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin, Calendar, Clock } from "lucide-react";

export default function AgendaPage() {
  const { data: agenda, isLoading } = useListAgenda({
    query: { enabled: true, queryKey: getListAgendaQueryKey() }
  });

  React.useEffect(() => {
    document.title = "Agenda - Vereador Cícero João";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Acompanhe os compromissos, reuniões e visitas do Vereador Cícero João.");
  }, []);

  return (
    <div className="w-full bg-background pb-20">
      <div className="bg-secondary text-secondary-foreground py-16 mb-8">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Agenda do Mandato</h1>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl font-sans">
            Acompanhe as reuniões, visitas aos bairros e sessões da Câmara.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : agenda?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground">Nenhum evento agendado</h3>
            <p className="text-muted-foreground mt-2">A agenda está sendo atualizada.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {agenda?.map((event) => {
              const date = new Date(event.startsAt);
              return (
                <Card key={event.id} className="hover-elevate overflow-hidden border-l-4 border-l-primary">
                  <CardContent className="p-0 flex flex-col sm:flex-row">
                    <div className="bg-muted p-6 sm:w-48 flex sm:flex-col items-center justify-center sm:border-r border-b sm:border-b-0 border-border gap-2 sm:gap-0 text-center">
                      <span className="text-sm font-bold text-primary uppercase tracking-wider">
                        {date.toLocaleString('pt-BR', { month: 'short' })}
                      </span>
                      <span className="text-3xl font-serif font-bold text-foreground">
                        {date.getDate()}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium hidden sm:block mt-1">
                        {date.getFullYear()}
                      </span>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold px-2 py-1 bg-accent/20 text-accent-foreground rounded uppercase tracking-wider">
                          {event.type}
                        </span>
                        <div className="flex items-center text-sm text-muted-foreground ml-2">
                          <Clock className="h-4 w-4 mr-1" />
                          {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold font-serif text-foreground mb-2">{event.title}</h3>
                      {event.description && (
                        <p className="text-muted-foreground font-sans mb-4">{event.description}</p>
                      )}
                      {event.location && (
                        <div className="flex items-start text-sm text-muted-foreground font-medium">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
