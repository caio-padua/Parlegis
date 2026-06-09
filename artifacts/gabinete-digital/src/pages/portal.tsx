import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@clerk/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  useGetCurrentUser, 
  useListMyDemands, 
  useListCategories, 
  useListNeighborhoods, 
  useCreateDemand, 
  useCreateAppointment, 
  useListMyAppointments,
  useGetDemand,
  useListDemandActivities,
  getListMyDemandsQueryKey,
  getListMyAppointmentsQueryKey,
  getGetCurrentUserQueryKey,
  getListCategoriesQueryKey,
  getListNeighborhoodsQueryKey,
  getGetDemandQueryKey,
  getListDemandActivitiesQueryKey,
  useRequestUploadUrl
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpload } from "@workspace/object-storage-web";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, FileText, Calendar, Clock, CheckCircle2, AlertCircle, Inbox, Archive, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const demandSchema = z.object({
  title: z.string().min(5, "Título muito curto"),
  description: z.string().min(10, "Descreva com mais detalhes"),
  categoryId: z.coerce.number().min(1, "Selecione uma categoria"),
  neighborhoodId: z.coerce.number().min(1, "Selecione um bairro"),
  citizenName: z.string().min(3, "Nome completo é obrigatório"),
  citizenEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  citizenPhone: z.string().optional(),
});

const appointmentSchema = z.object({
  subject: z.string().min(5, "Assunto muito curto"),
  description: z.string().optional(),
  preferredDate: z.string().optional(),
  citizenName: z.string().min(3, "Nome completo é obrigatório"),
  citizenEmail: z.string().email("Email inválido").optional().or(z.literal("")),
  citizenPhone: z.string().optional(),
});

function getStatusColor(status: string) {
  switch(status) {
    case "resolvida": return "bg-green-100 text-green-800 border-green-200";
    case "arquivada": return "bg-gray-100 text-gray-800 border-gray-200";
    case "recebida": return "bg-blue-100 text-blue-800 border-blue-200";
    case "em_analise": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default: return "bg-orange-100 text-orange-800 border-orange-200";
  }
}

export default function PortalPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const { data: user, isLoading: loadingUser } = useGetCurrentUser({
    query: { enabled: isLoaded && !!isSignedIn, queryKey: getGetCurrentUserQueryKey() }
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("minhas-demandas");
  const [selectedDemandId, setSelectedDemandId] = useState<number | null>(null);

  // Queries
  const { data: myDemands, isLoading: loadingDemands } = useListMyDemands({ query: { enabled: !!user, queryKey: getListMyDemandsQueryKey() } });
  const { data: myAppointments, isLoading: loadingAppointments } = useListMyAppointments({ query: { enabled: !!user, queryKey: getListMyAppointmentsQueryKey() } });
  const { data: categories } = useListCategories({ query: { enabled: true, queryKey: getListCategoriesQueryKey() } });
  const { data: neighborhoods } = useListNeighborhoods({ query: { enabled: true, queryKey: getListNeighborhoodsQueryKey() } });
  
  const { data: selectedDemand } = useGetDemand(selectedDemandId || 0, {
    query: { enabled: !!selectedDemandId, queryKey: getGetDemandQueryKey(selectedDemandId || 0) }
  });
  const { data: demandActivities } = useListDemandActivities(selectedDemandId || 0, {
    query: { enabled: !!selectedDemandId, queryKey: getListDemandActivitiesQueryKey(selectedDemandId || 0) }
  });

  // Mutations
  const createDemand = useCreateDemand();
  const createAppointment = useCreateAppointment();
  
  // Object Storage
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (res) => {
      setPhotoUrl(res.objectPath);
      toast({ title: "Foto anexada com sucesso" });
    },
    onError: () => toast({ title: "Erro ao anexar foto", variant: "destructive" })
  });

  React.useEffect(() => {
    document.title = "Meu Portal - Vereador Cícero João";
  }, []);

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation("/sign-in");
    }
  }, [isLoaded, isSignedIn, setLocation]);

  const demandForm = useForm<z.infer<typeof demandSchema>>({
    resolver: zodResolver(demandSchema),
    defaultValues: {
      title: "", description: "", categoryId: 0, neighborhoodId: 0,
      citizenName: user?.name || "", citizenEmail: user?.email || "", citizenPhone: ""
    }
  });

  const appointmentForm = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      subject: "", description: "", preferredDate: "",
      citizenName: user?.name || "", citizenEmail: user?.email || "", citizenPhone: ""
    }
  });

  // Prefill forms when user loads
  React.useEffect(() => {
    if (user) {
      if (!demandForm.getValues("citizenName")) {
        demandForm.setValue("citizenName", user.name || "");
        demandForm.setValue("citizenEmail", user.email || "");
      }
      if (!appointmentForm.getValues("citizenName")) {
        appointmentForm.setValue("citizenName", user.name || "");
        appointmentForm.setValue("citizenEmail", user.email || "");
      }
    }
  }, [user, demandForm, appointmentForm]);

  const onDemandSubmit = async (values: z.infer<typeof demandSchema>) => {
    try {
      await createDemand.mutateAsync({
        data: { ...values, photoUrl: photoUrl || undefined }
      });
      toast({ title: "Demanda enviada com sucesso!", description: "Você pode acompanhar o status por aqui." });
      demandForm.reset();
      setPhotoUrl(null);
      queryClient.invalidateQueries({ queryKey: getListMyDemandsQueryKey() });
      setActiveTab("minhas-demandas");
    } catch (err) {
      toast({ title: "Erro ao enviar demanda", variant: "destructive" });
    }
  };

  const onAppointmentSubmit = async (values: z.infer<typeof appointmentSchema>) => {
    try {
      await createAppointment.mutateAsync({ data: values });
      toast({ title: "Agendamento solicitado com sucesso!" });
      appointmentForm.reset();
      queryClient.invalidateQueries({ queryKey: getListMyAppointmentsQueryKey() });
      setActiveTab("agendamentos");
    } catch (err) {
      toast({ title: "Erro ao solicitar agendamento", variant: "destructive" });
    }
  };

  if (!isLoaded || loadingUser) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 pb-20 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Meu Portal</h1>
          <p className="text-muted-foreground">Olá, {user?.name || "Cidadão"}. Bem-vindo ao seu gabinete digital.</p>
        </div>
        {user?.role === "admin" && (
          <Button asChild variant="outline" className="border-primary text-primary">
            <Link href="/admin">Ir para Painel Administrativo</Link>
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto md:h-12 mb-8">
          <TabsTrigger value="minhas-demandas" className="py-3">Minhas Demandas</TabsTrigger>
          <TabsTrigger value="nova-demanda" className="py-3">Nova Demanda</TabsTrigger>
          <TabsTrigger value="agendamentos" className="py-3">Meus Agendamentos</TabsTrigger>
          <TabsTrigger value="novo-agendamento" className="py-3">Solicitar Reunião</TabsTrigger>
        </TabsList>

        <TabsContent value="minhas-demandas">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Demandas</CardTitle>
              <CardDescription>Acompanhe o status das suas solicitações</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingDemands ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
              ) : myDemands?.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted/30">
                  <p className="text-muted-foreground mb-4">Você ainda não enviou nenhuma demanda.</p>
                  <Button onClick={() => setActiveTab("nova-demanda")}>Enviar Nova Demanda</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDemands?.map(d => (
                    <div key={d.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedDemandId(d.id)}>
                      <div className="mb-2 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-muted-foreground">Protocolo: {d.protocol}</span>
                          <Badge className={`${getStatusColor(d.status)} px-2 py-0.5 text-xs`}>{d.status.replace(/_/g, " ")}</Badge>
                        </div>
                        <h4 className="font-bold text-foreground">{d.title}</h4>
                        <p className="text-sm text-muted-foreground">{new Date(d.createdAt).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <Button variant="ghost" size="sm">Ver Detalhes</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nova-demanda">
          <Card>
            <CardHeader>
              <CardTitle>Registrar Nova Demanda</CardTitle>
              <CardDescription>Envie sugestões, reclamações ou pedidos de melhoria para o seu bairro.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...demandForm}>
                <form onSubmit={demandForm.handleSubmit(onDemandSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={demandForm.control} name="title" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Título da Demanda</FormLabel>
                        <FormControl><Input placeholder="Ex: Buraco na via, Lâmpada queimada..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={demandForm.control} name="categoryId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={demandForm.control} name="neighborhoodId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value ? String(field.value) : undefined}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {neighborhoods?.map(n => <SelectItem key={n.id} value={String(n.id)}>{n.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={demandForm.control} name="description" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Descrição Detalhada</FormLabel>
                        <FormControl><Textarea placeholder="Explique o problema e o local exato..." className="min-h-[120px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <div className="md:col-span-2 space-y-2">
                      <FormLabel>Anexar Foto (Opcional)</FormLabel>
                      <div className="flex items-center gap-4">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) uploadFile(e.target.files[0]);
                          }} 
                          disabled={isUploading}
                          className="w-full md:w-auto"
                        />
                        {isUploading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                        {photoUrl && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      </div>
                      {photoUrl && (
                        <div className="mt-2">
                          <img src={`/api/storage${photoUrl}`} alt="Anexo" className="h-32 object-cover rounded border" />
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 pt-4 border-t border-border">
                      <h4 className="font-semibold mb-4">Seus Dados de Contato</h4>
                    </div>

                    <FormField control={demandForm.control} name="citizenName" render={({ field }) => (
                      <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={demandForm.control} name="citizenEmail" render={({ field }) => (
                      <FormItem><FormLabel>E-mail (opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={demandForm.control} name="citizenPhone" render={({ field }) => (
                      <FormItem><FormLabel>Telefone / WhatsApp (opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <Button type="submit" disabled={createDemand.isPending} className="w-full md:w-auto mt-6">
                    {createDemand.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar Demanda
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agendamentos">
          <Card>
            <CardHeader>
              <CardTitle>Meus Agendamentos</CardTitle>
              <CardDescription>Acompanhe suas solicitações de reunião presencial</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAppointments ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
              ) : myAppointments?.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted/30">
                  <p className="text-muted-foreground mb-4">Você ainda não solicitou nenhum atendimento.</p>
                  <Button onClick={() => setActiveTab("novo-agendamento")}>Agendar Atendimento</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAppointments?.map(a => (
                    <div key={a.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-muted-foreground">Protocolo: {a.protocol}</span>
                          <Badge variant="outline">{a.status.replace(/_/g, " ")}</Badge>
                        </div>
                        <h4 className="font-bold">{a.subject}</h4>
                        <p className="text-sm text-muted-foreground">Data preferencial: {a.preferredDate || "Não informada"}</p>
                      </div>
                      {a.scheduledAt && (
                        <div className="mt-2 md:mt-0 text-right">
                          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Confirmado para</span>
                          <p className="font-bold text-primary">{new Date(a.scheduledAt).toLocaleString("pt-BR")}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="novo-agendamento">
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Atendimento Presencial</CardTitle>
              <CardDescription>Agende um horário para falar com o vereador ou a equipe do gabinete.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...appointmentForm}>
                <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={appointmentForm.control} name="subject" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Assunto</FormLabel>
                        <FormControl><Input placeholder="Qual o tema da reunião?" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={appointmentForm.control} name="description" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Descrição Breve</FormLabel>
                        <FormControl><Textarea placeholder="Detalhe um pouco sobre o que quer conversar..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={appointmentForm.control} name="preferredDate" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Data/Turno de Preferência (Opcional)</FormLabel>
                        <FormControl><Input placeholder="Ex: Terça de manhã, ou dia 15/10..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="md:col-span-2 pt-4 border-t border-border">
                      <h4 className="font-semibold mb-4">Confirme seus dados</h4>
                    </div>

                    <FormField control={appointmentForm.control} name="citizenName" render={({ field }) => (
                      <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={appointmentForm.control} name="citizenPhone" render={({ field }) => (
                      <FormItem><FormLabel>Telefone / WhatsApp</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={appointmentForm.control} name="citizenEmail" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>E-mail (opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  <Button type="submit" disabled={createAppointment.isPending} className="w-full md:w-auto mt-6">
                    {createAppointment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar Solicitação
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Demand Details Dialog */}
      <Dialog open={!!selectedDemandId} onOpenChange={(o) => !o && setSelectedDemandId(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Demanda</DialogTitle>
          </DialogHeader>
          
          {selectedDemand ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-muted-foreground font-medium">Protocolo: {selectedDemand.protocol}</p>
                  <Badge className={`${getStatusColor(selectedDemand.status)}`}>{selectedDemand.status.replace(/_/g, " ")}</Badge>
                </div>
                <h3 className="text-xl font-bold font-serif">{selectedDemand.title}</h3>
                <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{selectedDemand.description}</p>
              </div>

              {selectedDemand.photoUrl && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Foto Anexa</h4>
                  <img src={`/api/storage${selectedDemand.photoUrl}`} alt="Anexo" className="max-h-64 object-cover rounded-lg border" />
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-bold font-serif mb-4">Histórico</h4>
                {demandActivities?.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma movimentação registrada.</p>
                ) : (
                  <div className="space-y-4">
                    {demandActivities?.map(act => (
                      <div key={act.id} className="p-3 bg-muted rounded-md text-sm border">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold">{act.status?.replace(/_/g, " ") || "Atualização"}</span>
                          <span className="text-muted-foreground">{new Date(act.createdAt).toLocaleString("pt-BR")}</span>
                        </div>
                        <p>{act.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
