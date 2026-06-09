import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/react";
import { 
  useGetCurrentUser, 
  useGetDashboardSummary, 
  useListDemands,
  useCreateDemandActivity,
  useListProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useListNews,
  useCreateNewsArticle,
  useUpdateNewsArticle,
  useDeleteNewsArticle,
  useListAgenda,
  useCreateAgendaEvent,
  useUpdateAgendaEvent,
  useDeleteAgendaEvent,
  useListAppointments,
  useUpdateAppointment,
  useUpdateMandateStats,
  useGetMandateStats,
  getGetDashboardSummaryQueryKey,
  getListDemandsQueryKey,
  getListProjectsQueryKey,
  getListNewsQueryKey,
  getListAgendaQueryKey,
  getListAppointmentsQueryKey,
  getGetMandateStatsQueryKey,
  getGetCurrentUserQueryKey,
  useRequestUploadUrl
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpload } from "@workspace/object-storage-web";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Settings, Users, FileText, CheckCircle2, ShieldAlert, Plus, Trash2, Calendar, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [, setLocation] = useLocation();
  const { data: user, isLoading: loadingUser } = useGetCurrentUser({
    query: { enabled: isLoaded && !!isSignedIn, queryKey: getGetCurrentUserQueryKey() }
  });
  
  React.useEffect(() => {
    document.title = "Admin - Gabinete Digital";
  }, []);

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setLocation("/sign-in");
    }
  }, [isLoaded, isSignedIn, setLocation]);

  if (!isLoaded || loadingUser) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (user && user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4 opacity-80" />
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground mb-6">Você não tem permissões de administrador para acessar esta página.</p>
        <Button onClick={() => setLocation("/portal")}>Voltar para o Portal</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-serif font-bold">Painel de Administração</h1>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 py-8 pb-20 flex-1">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto mb-8 bg-background border">
            <TabsTrigger value="dashboard" className="py-2">Visão Geral</TabsTrigger>
            <TabsTrigger value="demandas" className="py-2">Demandas</TabsTrigger>
            <TabsTrigger value="projetos" className="py-2">Projetos</TabsTrigger>
            <TabsTrigger value="noticias" className="py-2">Notícias</TabsTrigger>
            <TabsTrigger value="agenda" className="py-2">Agenda</TabsTrigger>
            <TabsTrigger value="atendimentos" className="py-2">Atendimentos</TabsTrigger>
            <TabsTrigger value="stats" className="py-2">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>
          <TabsContent value="demandas">
            <AdminDemands />
          </TabsContent>
          <TabsContent value="projetos">
            <AdminProjects />
          </TabsContent>
          <TabsContent value="noticias">
            <AdminNews />
          </TabsContent>
          <TabsContent value="agenda">
            <AdminAgenda />
          </TabsContent>
          <TabsContent value="atendimentos">
            <AdminAppointments />
          </TabsContent>
          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Sub-components for each tab to keep logic modular

function AdminDashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Demandas</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{summary?.totalDemands || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Demandas Abertas</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-yellow-600">{summary?.openDemands || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Demandas Resolvidas</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-600">{summary?.resolvedDemands || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Agendamentos Pendentes</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-blue-600">{summary?.pendingAppointments || 0}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Demandas Recentes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary?.recentDemands.map(d => (
              <div key={d.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-sm">{d.protocol}</p>
                  <p className="text-sm">{d.title}</p>
                </div>
                <Badge variant="outline">{d.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDemands() {
  const { data: demands, isLoading } = useListDemands(undefined, { query: { enabled: true, queryKey: getListDemandsQueryKey() } });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [status, setStatus] = useState("em_analise");
  const [note, setNote] = useState("");
  const createActivity = useCreateDemandActivity();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUpdate = async () => {
    if (!selectedId || !note) return;
    try {
      await createActivity.mutateAsync({ id: selectedId, data: { status, note } });
      toast({ title: "Status atualizado" });
      setNote("");
      setSelectedId(null);
      queryClient.invalidateQueries({ queryKey: getListDemandsQueryKey() });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const selectedDemand = demands?.find(d => d.id === selectedId);

  return (
    <Card>
      <CardHeader><CardTitle>Gerenciar Demandas</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Protocolo</th>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Cidadão</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b">
                {demands?.map(d => (
                  <tr key={d.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{d.protocol}</td>
                    <td className="px-4 py-3">{d.title}</td>
                    <td className="px-4 py-3">{d.citizenName}</td>
                    <td className="px-4 py-3"><Badge>{d.status}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedId(d.id)}>Atualizar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!selectedId} onOpenChange={o => !o && setSelectedId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Atualizar Demanda {selectedDemand?.protocol}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Novo Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recebida">Recebida</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="encaminhada">Encaminhada a Prefeitura</SelectItem>
                  <SelectItem value="aguardando_resposta">Aguardando Resposta</SelectItem>
                  <SelectItem value="em_acompanhamento">Em Acompanhamento</SelectItem>
                  <SelectItem value="resolvida">Resolvida</SelectItem>
                  <SelectItem value="arquivada">Arquivada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Nota Interna / Pública</label>
              <Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Ex: Ofício nº 123 enviado à Semob..." />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!note || createActivity.isPending} onClick={handleUpdate}>Salvar Atualização</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function AdminProjects() {
  const { data: projects, isLoading } = useListProjects(undefined, { query: { enabled: true, queryKey: getListProjectsQueryKey() } });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [type, setType] = useState("projeto_lei");
  const [status, setStatus] = useState("protocolado");
  const [year, setYear] = useState(new Date().getFullYear());
  
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleOpenEdit = (p: any) => {
    setEditId(p.id);
    setTitle(p.title);
    setSummary(p.summary);
    setType(p.type);
    setStatus(p.status);
    setYear(p.year || new Date().getFullYear());
    setOpen(true);
  };

  const handleOpenNew = () => {
    setEditId(null);
    setTitle("");
    setSummary("");
    setType("projeto_lei");
    setStatus("protocolado");
    setYear(new Date().getFullYear());
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = { title, summary, type, status, year };
      if (editId) {
        await updateProject.mutateAsync({ id: editId, data });
        toast({ title: "Projeto atualizado" });
      } else {
        await createProject.mutateAsync({ data });
        toast({ title: "Projeto criado" });
      }
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Tem certeza que deseja apagar?")) return;
    try {
      await deleteProject.mutateAsync({ id });
      toast({ title: "Apagado" });
      queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projetos e Ações</CardTitle>
        <Button size="sm" onClick={handleOpenNew}><Plus className="h-4 w-4 mr-1" /> Novo</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="animate-spin w-6 h-6 mx-auto" /> : (
          <div className="space-y-3">
            {projects?.map(p => (
              <div key={p.id} className="flex justify-between items-center p-4 border rounded-lg bg-card">
                <div>
                  <h4 className="font-bold text-sm mb-1">{p.title}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline">{p.type}</Badge>
                    <Badge variant="secondary">{p.status}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(p)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{editId ? "Editar Projeto" : "Novo Projeto"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título do projeto" />
            <Textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Resumo" className="min-h-[100px]" />
            <div className="grid grid-cols-2 gap-4">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="projeto_lei">Projeto Lei</SelectItem>
                  <SelectItem value="requerimento">Requerimento</SelectItem>
                  <SelectItem value="indicacao">Indicação</SelectItem>
                  <SelectItem value="emenda">Emenda</SelectItem>
                  <SelectItem value="lei">Lei Sancionada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="protocolado">Protocolado</SelectItem>
                  <SelectItem value="em_tramitacao">Em Tramitação</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="sancionado">Sancionado</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={!title || !summary}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function AdminNews() {
  const { data: news, isLoading } = useListNews({ query: { enabled: true, queryKey: getListNewsQueryKey() } });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const createNews = useCreateNewsArticle();
  const updateNews = useUpdateNewsArticle();
  const deleteNews = useDeleteNewsArticle();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { uploadFile, isUploading } = useUpload({
    onSuccess: (res) => {
      setImageUrl(`/api/storage${res.objectPath}`);
      toast({ title: "Imagem enviada" });
    }
  });

  const handleOpenEdit = (n: any) => {
    setEditId(n.id); setTitle(n.title); setSummary(n.summary); setBody(n.body); setImageUrl(n.imageUrl || ""); setOpen(true);
  };
  const handleOpenNew = () => {
    setEditId(null); setTitle(""); setSummary(""); setBody(""); setImageUrl(""); setOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = { title, summary, body, imageUrl, publishedAt: new Date().toISOString() };
      if (editId) await updateNews.mutateAsync({ id: editId, data });
      else await createNews.mutateAsync({ data });
      toast({ title: "Notícia salva" });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Certeza?")) return;
    await deleteNews.mutateAsync({ id });
    queryClient.invalidateQueries({ queryKey: getListNewsQueryKey() });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notícias</CardTitle>
        <Button size="sm" onClick={handleOpenNew}><Plus className="h-4 w-4 mr-1" /> Nova</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <div className="space-y-3">
            {news?.map(n => (
              <div key={n.id} className="flex justify-between items-center p-4 border rounded-lg bg-card">
                <div>
                  <h4 className="font-bold text-sm mb-1">{n.title}</h4>
                  <p className="text-xs text-muted-foreground">{new Date(n.publishedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(n)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(n.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Editar Notícia" : "Nova Notícia"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
            <Textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Resumo curto" />
            <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Conteúdo completo" className="min-h-[200px]" />
            <div>
               <label className="text-sm mb-2 block font-medium">Imagem (opcional)</label>
               <div className="flex gap-4 items-center">
                 <Input type="file" accept="image/*" onChange={(e) => { if(e.target.files?.[0]) uploadFile(e.target.files[0])}} disabled={isUploading} />
                 {isUploading && <Loader2 className="animate-spin w-4 h-4" />}
               </div>
               {imageUrl && <img src={imageUrl} alt="preview" className="h-20 mt-2 rounded" />}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={!title || !body}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function AdminAgenda() {
  const { data: agenda, isLoading } = useListAgenda({ query: { enabled: true, queryKey: getListAgendaQueryKey() } });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("reuniao");
  const [startsAt, setStartsAt] = useState(new Date().toISOString().slice(0, 16));
  
  const createAgenda = useCreateAgendaEvent();
  const updateAgenda = useUpdateAgendaEvent();
  const deleteAgenda = useDeleteAgendaEvent();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleOpenEdit = (a: any) => {
    setEditId(a.id); setTitle(a.title); setDescription(a.description || ""); setLocation(a.location || ""); setType(a.type); setStartsAt(new Date(a.startsAt).toISOString().slice(0, 16)); setOpen(true);
  };
  const handleOpenNew = () => {
    setEditId(null); setTitle(""); setDescription(""); setLocation(""); setType("reuniao"); setStartsAt(new Date().toISOString().slice(0, 16)); setOpen(true);
  };

  const handleSave = async () => {
    try {
      const data = { title, description, location, type, startsAt: new Date(startsAt).toISOString() };
      if (editId) await updateAgenda.mutateAsync({ id: editId, data });
      else await createAgenda.mutateAsync({ data });
      toast({ title: "Agenda salva" });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: getListAgendaQueryKey() });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agenda</CardTitle>
        <Button size="sm" onClick={handleOpenNew}><Plus className="h-4 w-4 mr-1" /> Novo Evento</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <div className="space-y-3">
            {agenda?.map(a => (
              <div key={a.id} className="flex justify-between items-center p-4 border rounded-lg bg-card">
                <div>
                  <h4 className="font-bold text-sm mb-1">{a.title}</h4>
                  <p className="text-xs text-muted-foreground">{new Date(a.startsAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(a)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {if(confirm('Apagar?')) {deleteAgenda.mutate({id:a.id}, {onSuccess:()=>queryClient.invalidateQueries({queryKey:getListAgendaQueryKey()})})}}}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Editar Evento" : "Novo Evento"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição" />
            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Local" />
            <div className="grid grid-cols-2 gap-4">
               <Select value={type} onValueChange={setType}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="visita">Visita</SelectItem>
                   <SelectItem value="reuniao">Reunião</SelectItem>
                   <SelectItem value="audiencia">Audiência</SelectItem>
                   <SelectItem value="sessao">Sessão</SelectItem>
                   <SelectItem value="outro">Outro</SelectItem>
                 </SelectContent>
               </Select>
               <Input type="datetime-local" value={startsAt} onChange={e => setStartsAt(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={!title || !startsAt}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function AdminAppointments() {
  const { data: appointments, isLoading } = useListAppointments(undefined, { query: { enabled: true, queryKey: getListAppointmentsQueryKey() } });
  const updateAppointment = useUpdateAppointment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateAppointment.mutateAsync({ id, data: { status } });
      toast({ title: "Status atualizado" });
      queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Agendamentos</CardTitle></CardHeader>
      <CardContent>
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : (
          <div className="space-y-4">
            {appointments?.map(a => (
              <div key={a.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <h4 className="font-bold text-sm mb-1">{a.subject} <Badge variant="outline" className="ml-2">{a.status}</Badge></h4>
                  <p className="text-xs text-muted-foreground">Cidadão: {a.citizenName} | Protocolo: {a.protocol}</p>
                  <p className="text-xs text-muted-foreground mt-1">Data pref: {a.preferredDate}</p>
                </div>
                <div className="flex gap-2">
                  <Select value={a.status} onValueChange={(v) => handleUpdateStatus(a.id, v)}>
                    <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solicitado">Solicitado</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="realizado">Realizado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AdminStats() {
  const { data: stats, isLoading } = useGetMandateStats({ query: { enabled: true, queryKey: getGetMandateStatsQueryKey() } });
  const updateStats = useUpdateMandateStats();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [form, setForm] = useState({
    requerimentos: 0, indicacoes: 0, projetosLei: 0, leisAprovadas: 0, emendas: 0, atendimentos: 0
  });

  React.useEffect(() => {
    if (stats) {
      setForm({
        requerimentos: stats.requerimentos, indicacoes: stats.indicacoes, 
        projetosLei: stats.projetosLei, leisAprovadas: stats.leisAprovadas, 
        emendas: stats.emendas, atendimentos: stats.atendimentos
      });
    }
  }, [stats]);

  const handleSave = async () => {
    try {
      await updateStats.mutateAsync({ data: form });
      toast({ title: "Estatísticas atualizadas" });
      queryClient.invalidateQueries({ queryKey: getGetMandateStatsQueryKey() });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  if (isLoading) return <Loader2 className="animate-spin mx-auto my-10 w-8 h-8" />;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader><CardTitle>Editar Números do Mandato</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
           {Object.keys(form).map(key => (
             <div key={key}>
               <label className="text-sm font-medium capitalize mb-1 block">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
               <Input 
                 type="number" 
                 value={(form as any)[key]} 
                 onChange={e => setForm({...form, [key]: Number(e.target.value)})} 
               />
             </div>
           ))}
        </div>
        <Button className="mt-8 w-full" onClick={handleSave} disabled={updateStats.isPending}>
          {updateStats.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
          Atualizar Números Públicos
        </Button>
      </CardContent>
    </Card>
  );
}
