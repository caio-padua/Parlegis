import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { bairros } from "@/lib/site-data";

const categorias = [
  "Saúde", "Segurança", "Acessibilidade", "Iluminação",
  "Buracos/asfalto", "Trânsito", "Transporte", "Escola",
  "Animais", "Comércio", "Limpeza urbana", "Outros",
];

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato e demandas — Cícero João" },
      { name: "description", content: "Envie sua demanda, agende atendimento ou fale diretamente com o gabinete de Cícero João." },
      { property: "og:title", content: "Contato e demandas — Cícero João" },
      { property: "og:description", content: "Canais oficiais do gabinete." },
      { property: "og:url", content: "/contato" },
    ],
    links: [{ rel: "canonical", href: "/contato" }],
  }),
  component: Contato,
});

function Contato() {
  const [enviando, setEnviando] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    // Envio real será conectado na Entrega 2 (Lovable Cloud).
    setTimeout(() => {
      setEnviando(false);
      toast.success("Demanda registrada", {
        description: "Em breve o gabinete entrará em contato. A área do cidadão completa será liberada na próxima fase.",
      });
      (e.target as HTMLFormElement).reset();
    }, 700);
  }

  return (
    <PageShell>
      <Toaster richColors position="top-right" />
      <PageHeader
        eyebrow="Gabinete digital"
        title="Envie sua demanda"
        description="Conte o que está acontecendo no seu bairro. O gabinete recebe, organiza e dá retorno."
      />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_1fr] lg:px-8">
        <form onSubmit={onSubmit} className="card-premium space-y-5 p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" required placeholder="Seu nome completo" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone / WhatsApp</Label>
              <Input id="telefone" name="telefone" required placeholder="(15) 9 9999-9999" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" placeholder="voce@exemplo.com" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select name="categoria" required>
                <SelectTrigger id="categoria"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {categorias.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Select name="bairro" required>
                <SelectTrigger id="bairro"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {bairros.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mensagem">Descrição</Label>
            <Textarea id="mensagem" name="mensagem" required rows={5} placeholder="Descreva o local exato e o que está acontecendo." />
          </div>
          <Button
            type="submit"
            disabled={enviando}
            size="lg"
            className="w-full rounded-md bg-[var(--champagne)] text-[var(--grafite)] ring-1 ring-[var(--ouro)] hover:bg-[var(--ouro)] hover:text-[var(--branco-quente)] sm:w-auto"
          >
            <Send className="mr-2 h-4 w-4" />
            {enviando ? "Enviando..." : "Enviar demanda"}
          </Button>
          <p className="text-xs text-muted-foreground">
            A área do cidadão completa (login, anexar foto, acompanhar protocolo) será ativada na próxima etapa do projeto.
          </p>
        </form>

        <aside className="space-y-5">
          <div className="card-premium p-6">
            <h2 className="font-display text-lg text-[var(--bordo)]">Canais diretos</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-[var(--bordo)]" />
                <div>
                  <p className="font-medium">Telefone do gabinete</p>
                  <p className="text-muted-foreground">(15) 0000-0000</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-[var(--bordo)]" />
                <div>
                  <p className="font-medium">E-mail</p>
                  <p className="text-muted-foreground">contato@cicerojoao.com.br</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--bordo)]" />
                <div>
                  <p className="font-medium">Endereço</p>
                  <p className="text-muted-foreground">Câmara Municipal de Sorocaba — SP</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="card-premium p-6">
            <h2 className="font-display text-lg text-[var(--bordo)]">Atendimento presencial</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Todas as terças, das 14h às 18h, na sala 12 da Câmara Municipal. Para encontros em outros horários, agende pelo formulário ao lado.
            </p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
