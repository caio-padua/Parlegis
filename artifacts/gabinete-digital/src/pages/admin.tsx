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
  useListTeam,
  useCreateTeamMember,
  useUpdateTeamMember,
  useListSlots,
  useCreateSlot,
  useUpdateSlot,
  useListVoters,
  useCreateVoter,
  useUpdateVoter,
  useDeleteVoter,
  useListBirthdays,
  useListMessages,
  useCreateMessage,
  useSendMessage,
  useListGifts,
  useCreateGift,
  useUpdateGift,
  useListIntegrationStatus,
  getListIntegrationStatusQueryKey,
  getListVotersQueryKey,
  getListBirthdaysQueryKey,
  getListMessagesQueryKey,
  getListGiftsQueryKey,
  getListSlotsQueryKey,
  getGetDashboardSummaryQueryKey,
  getListDemandsQueryKey,
  getListProjectsQueryKey,
  getListNewsQueryKey,
  getListAgendaQueryKey,
  getListAppointmentsQueryKey,
  getGetMandateStatsQueryKey,
  getGetCurrentUserQueryKey,
  getListTeamQueryKey,
  useRequestUploadUrl
} from "@workspace/api-client-react";
import type { Permissions, CurrentUser } from "@workspace/api-client-react";
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
import { Loader2, Settings, Users, FileText, CheckCircle2, ShieldAlert, Plus, Trash2, Calendar, Edit, UserPlus, Gift as GiftIcon, MessageSquare, Send, Cake, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

  if (user && user.role === "citizen") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4 opacity-80" />
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Acesso Negado</h1>
        <p className="text-muted-foreground mb-6">Você não faz parte da equipe do gabinete.</p>
        <Button onClick={() => setLocation("/portal")}>Voltar para o Portal</Button>
      </div>
    );
  }

  if (user && !user.active) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4 opacity-80" />
        <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Conta inativa</h1>
        <p className="text-muted-foreground mb-6">Seu acesso foi desativado. Procure o chefe de gabinete.</p>
        <Button onClick={() => setLocation("/")}>Voltar ao início</Button>
      </div>
    );
  }

  const tabs = visibleTabs(user);
  const firstTab = tabs[0]?.value ?? "dashboard";

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-serif font-bold">Painel de Administração</h1>
            </div>
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name ?? user.email}</p>
                <p className="text-xs text-muted-foreground">{cargoLabel(user.cargo)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 py-8 pb-20 flex-1">
        <Tabs defaultValue={firstTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 h-auto mb-8 bg-background border">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="py-2">{t.label}</TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              {t.render()}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

function can(user: CurrentUser | undefined, cap: keyof Permissions): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.permissions?.[cap] === true;
}

const CARGO_LABELS: Record<string, string> = {
  vereador: "Vereador",
  chefe_gabinete: "Chefe de Gabinete",
  assessor_parlamentar: "Assessor Parlamentar",
  assessor_juridico: "Assessor Jurídico",
  assessor_comunicacao: "Assessor de Comunicação",
  assessor_imprensa: "Assessor de Imprensa",
  atendimento: "Atendimento",
};

function cargoLabel(cargo: string | null | undefined): string {
  if (!cargo) return "Equipe do gabinete";
  return CARGO_LABELS[cargo] ?? cargo;
}

function visibleTabs(user: CurrentUser | undefined) {
  const tabs: { value: string; label: string; render: () => React.ReactNode }[] = [];
  tabs.push({ value: "dashboard", label: "Visão Geral", render: () => <AdminDashboard /> });
  if (can(user, "canManageDemands"))
    tabs.push({ value: "demandas", label: "Demandas", render: () => <AdminDemands user={user} /> });
  if (can(user, "canManageProjects"))
    tabs.push({ value: "projetos", label: "Projetos", render: () => <AdminProjects /> });
  if (can(user, "canManageNews"))
    tabs.push({ value: "noticias", label: "Notícias", render: () => <AdminNews /> });
  if (can(user, "canManageAgenda"))
    tabs.push({ value: "agenda", label: "Agenda", render: () => <AdminAgenda /> });
  if (can(user, "canManageAppointments"))
    tabs.push({ value: "atendimentos", label: "Atendimentos", render: () => <AdminAppointments /> });
  if (can(user, "canReleaseScheduleCards"))
    tabs.push({ value: "agenda-atendimento", label: "Cartões de Agenda", render: () => <AdminSlots /> });
  if (can(user, "canManageVoters"))
    tabs.push({ value: "eleitores", label: "Eleitores (CRM)", render: () => <AdminVoters /> });
  if (can(user, "canMessageVoters"))
    tabs.push({ value: "mensagens", label: "Mensagens", render: () => <AdminMessages /> });
  if (can(user, "canManageGifts"))
    tabs.push({ value: "brindes", label: "Brindes", render: () => <AdminGifts /> });
  if (can(user, "canMessageVoters"))
    tabs.push({ value: "integracoes", label: "Integrações & IA", render: () => <AdminIntegrations /> });
  if (can(user, "canManageStats"))
    tabs.push({ value: "stats", label: "Estatísticas", render: () => <AdminStats /> });
  if (can(user, "canManageTeam"))
    tabs.push({ value: "equipe", label: "Equipe & Governança", render: () => <AdminTeam /> });
  return tabs;
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

function AdminDemands({ user }: { user: CurrentUser | undefined }) {
  const canRespond = can(user, "canRespondDemands");
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
                      {canRespond ? (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedId(d.id)}>Atualizar</Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Somente leitura</span>
                      )}
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

const CAP_GROUPS: { label: string; caps: { key: keyof Permissions; label: string }[] }[] = [
  {
    label: "Demandas",
    caps: [
      { key: "canManageDemands", label: "Ver e gerenciar demandas" },
      { key: "canRespondDemands", label: "Responder e mudar status" },
    ],
  },
  {
    label: "Conteúdo público",
    caps: [
      { key: "canManageProjects", label: "Projetos e ofícios" },
      { key: "canManageNews", label: "Notícias" },
      { key: "canManageAgenda", label: "Agenda" },
      { key: "canManageStats", label: "Números do mandato" },
    ],
  },
  {
    label: "Atendimento",
    caps: [
      { key: "canManageAppointments", label: "Gerenciar agendamentos" },
      { key: "canReleaseScheduleCards", label: "Liberar cartões de agenda" },
    ],
  },
  {
    label: "Eleitores",
    caps: [
      { key: "canManageVoters", label: "Cadastro de eleitores (CRM)" },
      { key: "canMessageVoters", label: "Enviar mensagens" },
      { key: "canManageGifts", label: "Gerenciar brindes" },
    ],
  },
  {
    label: "Governança",
    caps: [{ key: "canManageTeam", label: "Gerenciar equipe e permissões" }],
  },
];

const CARGO_OPTIONS = [
  "chefe_gabinete",
  "assessor_parlamentar",
  "assessor_juridico",
  "assessor_comunicacao",
  "assessor_imprensa",
  "atendimento",
];

function AdminTeam() {
  const { data: team, isLoading } = useListTeam({ query: { queryKey: getListTeamQueryKey() } });
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("atendimento");
  const [perms, setPerms] = useState<Permissions>({});

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListTeamQueryKey() });

  const handleNew = () => {
    setEditId(null);
    setName("");
    setEmail("");
    setCargo("atendimento");
    setPerms({});
    setOpen(true);
  };

  const handleEdit = (m: NonNullable<typeof team>[number]) => {
    setEditId(m.id);
    setName(m.name ?? "");
    setEmail(m.email ?? "");
    setCargo(m.cargo ?? "atendimento");
    setPerms(m.permissions ?? {});
    setOpen(true);
  };

  const togglePerm = (key: keyof Permissions, value: boolean) =>
    setPerms((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    try {
      if (editId) {
        await updateMember.mutateAsync({ id: editId, data: { name, cargo, permissions: perms } });
        toast({ title: "Membro atualizado" });
      } else {
        if (!email) return;
        await createMember.mutateAsync({ data: { email, name: name || null, cargo, permissions: perms } });
        toast({ title: "Convite criado", description: "O acesso será ativado quando a pessoa entrar com este e-mail." });
      }
      setOpen(false);
      refresh();
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleToggleActive = async (m: NonNullable<typeof team>[number]) => {
    try {
      await updateMember.mutateAsync({ id: m.id, data: { active: !m.active } });
      refresh();
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const applyCargoDefaults = (value: string) => {
    setCargo(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Equipe & Governança</CardTitle>
          <CardDescription>
            Cadastre logins por e-mail, defina o cargo e ative as permissões de cada membro.
          </CardDescription>
        </div>
        <Button size="sm" onClick={handleNew}><UserPlus className="h-4 w-4 mr-1" /> Novo membro</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="animate-spin w-6 h-6 mx-auto" />
        ) : (
          <div className="space-y-3">
            {team?.map((m) => (
              <div key={m.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">{m.name ?? m.email}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary">{cargoLabel(m.cargo)}</Badge>
                      {m.role === "admin" && <Badge>Superadmin</Badge>}
                      {!m.clerkUserId && <Badge variant="outline">Convite pendente</Badge>}
                      <Badge variant={m.active ? "outline" : "destructive"}>{m.active ? "Ativo" : "Inativo"}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.role !== "admin" && (
                    <>
                      <div className="flex items-center gap-2">
                        <Switch checked={m.active} onCheckedChange={() => handleToggleActive(m)} />
                        <span className="text-xs text-muted-foreground">{m.active ? "Ativo" : "Inativo"}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(m)}><Edit className="h-4 w-4" /></Button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {team && team.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhum membro cadastrado ainda.</p>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Editar membro" : "Novo membro da equipe"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm mb-1 block">Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
              </div>
              <div>
                <Label className="text-sm mb-1 block">E-mail (login)</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@gabinete.gov.br" disabled={!!editId} />
              </div>
            </div>
            <div>
              <Label className="text-sm mb-1 block">Cargo</Label>
              <Select value={cargo} onValueChange={applyCargoDefaults}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CARGO_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{cargoLabel(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-2">
              <p className="text-sm font-semibold">Permissões</p>
              {CAP_GROUPS.map((group) => (
                <div key={group.label} className="border rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{group.label}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.caps.map((c) => (
                      <div key={c.key} className="flex items-center justify-between gap-2">
                        <span className="text-sm">{c.label}</span>
                        <Switch checked={perms[c.key] === true} onCheckedChange={(v) => togglePerm(c.key, v)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={(!editId && !email) || createMember.isPending || updateMember.isPending}>
              {(createMember.isPending || updateMember.isPending) ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
              {editId ? "Salvar alterações" : "Criar acesso"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

const PERIOD_LABELS: Record<string, string> = { manha: "Manhã", tarde: "Tarde" };

function AdminSlots() {
  const { data: slots, isLoading } = useListSlots({ query: { queryKey: getListSlotsQueryKey() } });
  const createSlot = useCreateSlot();
  const updateSlot = useUpdateSlot();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [date, setDate] = useState("");
  const [period, setPeriod] = useState("manha");
  const [capacity, setCapacity] = useState("5");
  const [note, setNote] = useState("");

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListSlotsQueryKey() });

  const handleCreate = async () => {
    if (!date) {
      toast({ title: "Informe a data", variant: "destructive" });
      return;
    }
    try {
      await createSlot.mutateAsync({
        data: {
          date,
          period,
          capacity: Number(capacity) || 5,
          released: false,
          note: note || null,
        },
      });
      toast({ title: "Cartão criado", description: "Libere quando quiser abrir vagas." });
      setDate("");
      setNote("");
      refresh();
    } catch {
      toast({ title: "Não foi possível criar", description: "Talvez já exista um cartão para esta data e período.", variant: "destructive" });
    }
  };

  const handleToggleRelease = async (id: number, released: boolean) => {
    try {
      await updateSlot.mutateAsync({ id, data: { released } });
      refresh();
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const formatDate = (d: string | Date) => {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "UTC" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo cartão de agenda</CardTitle>
          <CardDescription>
            Crie um cartão para uma data e período. As vagas só ficam visíveis ao cidadão quando você liberar o cartão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label className="text-sm mb-1 block">Data</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm mb-1 block">Período</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manha">Manhã</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">Vagas</Label>
              <Input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </div>
            <Button onClick={handleCreate} disabled={createSlot.isPending}>
              {createSlot.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Criar cartão
            </Button>
          </div>
          <div className="mt-4">
            <Label className="text-sm mb-1 block">Observação (opcional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex.: atendimento no bairro Itavuvu" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cartões cadastrados</CardTitle>
          <CardDescription>Libere ou recolha vagas. Ao lotar um cartão liberado, o próximo é aberto automaticamente.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="animate-spin w-6 h-6 mx-auto" />
          ) : (
            <div className="space-y-3">
              {slots?.map((s) => {
                const full = s.bookedCount >= s.capacity;
                return (
                  <div key={s.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border rounded-lg bg-card">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm capitalize">{formatDate(s.date)} — {PERIOD_LABELS[s.period] ?? s.period}</p>
                        <p className="text-xs text-muted-foreground">{s.bookedCount}/{s.capacity} vagas preenchidas{s.note ? ` · ${s.note}` : ""}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant={s.released ? "default" : "outline"}>{s.released ? "Liberado" : "Em espera"}</Badge>
                          {full && <Badge variant="destructive">Lotado</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={s.released} onCheckedChange={(v) => handleToggleRelease(s.id, v)} />
                      <span className="text-xs text-muted-foreground">{s.released ? "Liberado" : "Liberar"}</span>
                    </div>
                  </div>
                );
              })}
              {slots && slots.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum cartão cadastrado ainda.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const GIFT_STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  preparando: "Preparando",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

const DELIVERY_LABELS: Record<string, string> = {
  casa: "Entrega em casa",
  gabinete: "Retirada no gabinete",
};

function formatBR(d: string | Date | null | undefined) {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
}

function AdminVoters() {
  const [search, setSearch] = useState("");
  const params = { search: search.trim() || undefined };
  const { data: voters, isLoading } = useListVoters(params, { query: { queryKey: getListVotersQueryKey(params) } });
  const { data: birthdays } = useListBirthdays({ days: 30 }, { query: { queryKey: getListBirthdaysQueryKey({ days: 30 }) } });
  const createVoter = useCreateVoter();
  const updateVoter = useUpdateVoter();
  const deleteVoter = useDeleteVoter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", birthDate: "", address: "", neighborhood: "", notes: "" });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: getListVotersQueryKey() });
    queryClient.invalidateQueries({ queryKey: getListBirthdaysQueryKey({ days: 30 }) });
  };

  const openNew = () => {
    setEditId(null);
    setForm({ name: "", whatsapp: "", email: "", birthDate: "", address: "", neighborhood: "", notes: "" });
    setDialogOpen(true);
  };

  const openEdit = (v: NonNullable<typeof voters>[number]) => {
    setEditId(v.id);
    setForm({
      name: v.name,
      whatsapp: v.whatsapp ?? "",
      email: v.email ?? "",
      birthDate: v.birthDate ? new Date(v.birthDate).toISOString().slice(0, 10) : "",
      address: v.address ?? "",
      neighborhood: v.neighborhood ?? "",
      notes: v.notes ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Informe o nome", variant: "destructive" });
      return;
    }
    const data = {
      name: form.name.trim(),
      whatsapp: form.whatsapp.trim() || null,
      email: form.email.trim() || null,
      birthDate: form.birthDate || null,
      address: form.address.trim() || null,
      neighborhood: form.neighborhood.trim() || null,
      notes: form.notes.trim() || null,
    };
    try {
      if (editId) {
        await updateVoter.mutateAsync({ id: editId, data });
        toast({ title: "Eleitor atualizado" });
      } else {
        await createVoter.mutateAsync({ data });
        toast({ title: "Eleitor cadastrado" });
      }
      setDialogOpen(false);
      refresh();
    } catch {
      toast({ title: "Não foi possível salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteVoter.mutateAsync({ id });
      refresh();
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {birthdays && birthdays.length > 0 && (
        <Card className="border-[#C99A2E]/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cake className="h-5 w-5 text-[#C99A2E]" /> Aniversariantes dos próximos 30 dias</CardTitle>
            <CardDescription>Lembre-se de enviar uma mensagem ou um brinde.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {birthdays.map((b) => (
                <Badge key={b.id} variant="outline" className="py-1.5 px-3">
                  {b.name} · {formatBR(b.birthDate)} {b.daysUntil === 0 ? "(hoje)" : `(em ${b.daysUntil}d)`}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle>Eleitores cadastrados</CardTitle>
              <CardDescription>Base de relacionamento do gabinete.</CardDescription>
            </div>
            <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Novo eleitor</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar por nome, bairro ou WhatsApp" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {isLoading ? (
            <Loader2 className="animate-spin w-6 h-6 mx-auto" />
          ) : (
            <div className="space-y-3">
              {voters?.map((v) => (
                <div key={v.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border rounded-lg bg-card">
                  <div>
                    <p className="font-semibold text-sm">{v.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[v.whatsapp, v.neighborhood, v.birthDate ? `Nasc.: ${formatBR(v.birthDate)}` : null].filter(Boolean).join(" · ") || "Sem dados de contato"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(v)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(v.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
              {voters && voters.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum eleitor encontrado.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? "Editar eleitor" : "Novo eleitor"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label className="text-sm mb-1 block">Nome</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="text-sm mb-1 block">WhatsApp</Label>
              <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="(15) 99999-9999" />
            </div>
            <div>
              <Label className="text-sm mb-1 block">E-mail</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label className="text-sm mb-1 block">Data de nascimento</Label>
              <Input type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
            </div>
            <div>
              <Label className="text-sm mb-1 block">Bairro</Label>
              <Input value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm mb-1 block">Endereço</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm mb-1 block">Observações</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={createVoter.isPending || updateVoter.isPending}>
              {(createVoter.isPending || updateVoter.isPending) && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AdminMessages() {
  const { data: messages, isLoading } = useListMessages({ query: { queryKey: getListMessagesQueryKey() } });
  const { data: voters } = useListVoters(undefined, { query: { queryKey: getListVotersQueryKey() } });
  const createMessage = useCreateMessage();
  const sendMessage = useSendMessage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [voterId, setVoterId] = useState<string>("avulso");
  const [recipientName, setRecipientName] = useState("");
  const [recipientContact, setRecipientContact] = useState("");
  const [channel, setChannel] = useState("whatsapp");
  const [kind, setKind] = useState("manual");
  const [body, setBody] = useState("");

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey() });

  const onPickVoter = (val: string) => {
    setVoterId(val);
    if (val !== "avulso") {
      const v = voters?.find((x) => String(x.id) === val);
      if (v) {
        setRecipientName(v.name);
        setRecipientContact(v.whatsapp ?? "");
      }
    }
  };

  const handleQueue = async () => {
    if (!recipientName.trim() || !body.trim()) {
      toast({ title: "Preencha destinatário e mensagem", variant: "destructive" });
      return;
    }
    try {
      await createMessage.mutateAsync({
        data: {
          voterId: voterId !== "avulso" ? Number(voterId) : null,
          recipientName: recipientName.trim(),
          recipientContact: recipientContact.trim() || null,
          channel,
          kind,
          body: body.trim(),
        },
      });
      toast({ title: "Mensagem na fila", description: "Use Enviar para dispatch quando a integração estiver configurada." });
      setBody("");
      refresh();
    } catch {
      toast({ title: "Erro ao enfileirar", variant: "destructive" });
    }
  };

  const handleSend = async (id: number) => {
    try {
      const res = await sendMessage.mutateAsync({ id });
      if (res.status === "sent") {
        toast({ title: "Mensagem enviada" });
      } else {
        toast({ title: "Não enviada", description: res.error ?? "Canal não configurado", variant: "destructive" });
      }
      refresh();
    } catch {
      toast({ title: "Erro no envio", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nova mensagem</CardTitle>
          <CardDescription>Componha mensagens para eleitores. O envio real depende das integrações configuradas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-sm mb-1 block">Eleitor</Label>
              <Select value={voterId} onValueChange={onPickVoter}>
                <SelectTrigger><SelectValue placeholder="Avulso" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="avulso">Destinatário avulso</SelectItem>
                  {voters?.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">Canal</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">Tipo</Label>
              <Select value={kind} onValueChange={setKind}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="aniversario">Aniversário</SelectItem>
                  <SelectItem value="atualizacao_demanda">Atualização de demanda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm mb-1 block">Destinatário</Label>
              <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm mb-1 block">Contato</Label>
              <Input value={recipientContact} onChange={(e) => setRecipientContact(e.target.value)} placeholder="WhatsApp / e-mail" />
            </div>
          </div>
          <div>
            <Label className="text-sm mb-1 block">Mensagem</Label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
          </div>
          <Button onClick={handleQueue} disabled={createMessage.isPending}>
            {createMessage.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />}
            Enfileirar mensagem
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="animate-spin w-6 h-6 mx-auto" />
          ) : (
            <div className="space-y-3">
              {messages?.map((m) => (
                <div key={m.id} className="flex flex-col md:flex-row md:items-start justify-between gap-3 p-4 border rounded-lg bg-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{m.recipientName}</p>
                      <Badge variant="outline">{m.channel}</Badge>
                      <Badge variant={m.status === "sent" ? "default" : m.status === "failed" ? "destructive" : "outline"}>
                        {m.status === "sent" ? "Enviada" : m.status === "failed" ? "Falhou" : "Na fila"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{m.body}</p>
                    {m.error && <p className="text-xs text-destructive mt-1">{m.error}</p>}
                  </div>
                  {m.status !== "sent" && (
                    <Button size="sm" variant="outline" onClick={() => handleSend(m.id)} disabled={sendMessage.isPending}>
                      <Send className="w-4 h-4 mr-1" /> Enviar
                    </Button>
                  )}
                </div>
              ))}
              {messages && messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhuma mensagem ainda.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminGifts() {
  const { data: gifts, isLoading } = useListGifts({ query: { queryKey: getListGiftsQueryKey() } });
  const { data: voters } = useListVoters(undefined, { query: { queryKey: getListVotersQueryKey() } });
  const createGift = useCreateGift();
  const updateGift = useUpdateGift();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [voterId, setVoterId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [deliveryType, setDeliveryType] = useState("casa");
  const [occasion, setOccasion] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListGiftsQueryKey() });

  const voterName = (id: number) => voters?.find((v) => v.id === id)?.name ?? `Eleitor #${id}`;

  const handleCreate = async () => {
    if (!voterId || !description.trim()) {
      toast({ title: "Selecione o eleitor e descreva o brinde", variant: "destructive" });
      return;
    }
    try {
      await createGift.mutateAsync({
        data: {
          voterId: Number(voterId),
          description: description.trim(),
          deliveryType,
          occasion: occasion.trim() || null,
          scheduledFor: scheduledFor || null,
        },
      });
      toast({ title: "Brinde registrado" });
      setDescription("");
      setOccasion("");
      setScheduledFor("");
      refresh();
    } catch {
      toast({ title: "Erro ao registrar", variant: "destructive" });
    }
  };

  const handleStatus = async (id: number, status: string) => {
    try {
      await updateGift.mutateAsync({ id, data: { status } });
      refresh();
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo brinde</CardTitle>
          <CardDescription>Registre brindes para entrega em casa ou retirada no gabinete.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm mb-1 block">Eleitor</Label>
              <Select value={voterId} onValueChange={setVoterId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {voters?.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">Forma de entrega</Label>
              <Select value={deliveryType} onValueChange={setDeliveryType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Entrega em casa</SelectItem>
                  <SelectItem value="gabinete">Retirada no gabinete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-1 block">Ocasião</Label>
              <Input value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="Aniversário, Natal..." />
            </div>
            <div>
              <Label className="text-sm mb-1 block">Data prevista</Label>
              <Input type="date" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm mb-1 block">Descrição do brinde</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={createGift.isPending}>
            {createGift.isPending ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <GiftIcon className="w-4 h-4 mr-2" />}
            Registrar brinde
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brindes</CardTitle>
          <CardDescription>Acompanhe o fluxo: pendente, preparando, entregue.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="animate-spin w-6 h-6 mx-auto" />
          ) : (
            <div className="space-y-3">
              {gifts?.map((g) => (
                <div key={g.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border rounded-lg bg-card">
                  <div className="flex items-start gap-3">
                    <GiftIcon className="h-5 w-5 text-[#C99A2E] mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{g.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {voterName(g.voterId)} · {DELIVERY_LABELS[g.deliveryType] ?? g.deliveryType}
                        {g.occasion ? ` · ${g.occasion}` : ""}{g.scheduledFor ? ` · ${formatBR(g.scheduledFor)}` : ""}
                      </p>
                      <Badge variant={g.status === "entregue" ? "default" : g.status === "cancelado" ? "destructive" : "outline"} className="mt-1">
                        {GIFT_STATUS_LABELS[g.status] ?? g.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-44">
                    <Select value={g.status} onValueChange={(v) => handleStatus(g.id, v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="preparando">Preparando</SelectItem>
                        <SelectItem value="entregue">Entregue</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              {gifts && gifts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum brinde registrado ainda.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const PROVIDER_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp (envio de mensagens)",
  elevenlabs: "ElevenLabs (voz / áudio)",
  heygen: "HeyGen (vídeo com avatar)",
};

function AdminIntegrations() {
  const { data: statuses, isLoading } = useListIntegrationStatus({ query: { queryKey: getListIntegrationStatusQueryKey() } });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrações externas</CardTitle>
          <CardDescription>
            Estrutura pronta para WhatsApp, ElevenLabs e HeyGen. As chaves de acesso podem ser configuradas depois nas variáveis de ambiente; enquanto isso, os envios retornam um aviso claro de "não configurado".
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="animate-spin w-6 h-6 mx-auto" />
          ) : (
            <div className="space-y-3">
              {statuses?.map((s) => (
                <div key={s.provider} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border rounded-lg bg-card">
                  <div>
                    <p className="font-semibold text-sm">{PROVIDER_LABELS[s.provider] ?? s.provider}</p>
                    {!s.configured && s.missing.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">Faltam variáveis: {s.missing.join(", ")}</p>
                    )}
                  </div>
                  <Badge variant={s.configured ? "default" : "outline"}>
                    {s.configured ? "Configurado" : "Não configurado"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como ativar</CardTitle>
          <CardDescription>Para habilitar cada recurso, defina as variáveis de ambiente correspondentes.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong className="text-foreground">WhatsApp:</strong> WHATSAPP_TOKEN, WHATSAPP_PHONE_ID</p>
          <p><strong className="text-foreground">ElevenLabs:</strong> ELEVENLABS_API_KEY (opcional ELEVENLABS_VOICE_ID)</p>
          <p><strong className="text-foreground">HeyGen:</strong> HEYGEN_API_KEY (opcional HEYGEN_AVATAR_ID)</p>
        </CardContent>
      </Card>
    </div>
  );
}
