# Gabinete Digital Cícero João — Plano de Construção

Portal institucional de mandato com aparência premium, linguagem popular e área do cidadão funcional. Identidade visual baseada no PSB, mas em versão sofisticada (bordô, champagne, creme, grafite, azul petróleo).

## Fase 1 — Identidade visual e fundação

Antes de qualquer página, fixar o sistema de design para garantir consistência:

- **Tokens de cor** em `src/styles.css` no formato `oklch` (conversão das HEX fornecidas): bordô `#8B1E2D`, vermelho social `#B3262E`, ouro velho `#C99A2E`, champagne `#E7C873`, creme `#F8F3E8`, branco quente `#FFFDF8`, grafite `#242424`, azul petróleo `#102D3C`.
- **Tipografia**: Playfair Display (títulos) + Inter (corpo), carregadas via `<link>` no `__root.tsx` e registradas como `--font-display` e `--font-sans` no `@theme`.
- **Componentes base**: variantes premium para Button (`primary` bordô, `secondary` champagne, `outline` ouro), Card (`card-premium` com sombra azul petróleo e borda ouro 35%), Badge para status de demandas.
- **Header institucional** em azul petróleo com filete ouro e menu responsivo (Sheet mobile).
- **Footer** com identidade PSB sutil, contatos do gabinete, links institucionais.

## Fase 2 — Páginas públicas (sem backend)

Estrutura de rotas em `src/routes/`:

```text
__root.tsx          Header + Footer + metadata global
index.tsx           Home institucional (7 blocos do brief)
biografia.tsx       Trajetória + perfil empresário/PE→Sorocaba
mandato.tsx         Mandato em números + comissões + legislaturas
projetos.tsx        Lista de projetos e leis (cards filtráveis)
projetos.$slug.tsx  Detalhe de cada lei/projeto
bairros.tsx         Sorocaba por bairros (lista/mapa)
agenda.tsx          Agenda pública
noticias.tsx        Notícias e atuação
contato.tsx         Canais de contato + redes
```

**Home** segue exatamente os 7 blocos do brief: Hero (foto + CTAs Enviar demanda / Agendar / Conhecer projetos), Cards rápidos (8 áreas temáticas), Mandato em números (1.039 / 306 / 51 / 12 / 111), Gabinete Digital, Bairros, Projetos em destaque (com Lei 13.219/2025 contra pedágio), Notícias + Agenda.

Cada rota tem `head()` próprio (title, description, og:title, og:description) — sem reaproveitar metadata da home. SEO em português, H1 único por página.

## Fase 3 — Área do Cidadão (requer Lovable Cloud)

Esta fase é a mais importante e exige backend. Antes de implementar, ativarei **Lovable Cloud** para autenticação, banco e storage.

**Funcionalidades**:
- Cadastro/login do cidadão (email + senha, sem login social inicialmente).
- Formulário "Enviar demanda": categoria (12 opções), bairro, descrição, anexo de foto.
- Painel "Minhas demandas" com status (Recebida, Em análise, Encaminhada, Aguardando resposta, Em acompanhamento, Resolvida, Arquivada).
- Histórico e timeline de atualizações por demanda.
- Agendamento de atendimento (slots simples).

**Painel da equipe (gabinete)**:
- Rota `_authenticated/admin/*` protegida por role.
- Listagem de demandas com filtros (bairro, categoria, status).
- Atualização de status + comentário interno + notificação ao cidadão.
- Tabela de agendamentos.

## Detalhes técnicos

- **Stack**: TanStack Start v1 + React 19 + Tailwind v4 + shadcn/ui (já no projeto).
- **Tokens em `@theme inline`** apontando para variáveis `:root` em oklch — sem custom HEX em componentes, sempre classes semânticas (`bg-primary`, `text-foreground`, `border-accent`).
- **Roles**: tabela `user_roles` separada + função `has_role` SECURITY DEFINER (nunca role na tabela de perfis).
- **Schema Cloud** (Fase 3):
  - `profiles` (id ref auth.users, nome, bairro, telefone)
  - `user_roles` (user_id, role: cidadao | equipe | admin)
  - `demandas` (id, user_id, categoria, bairro, descricao, foto_url, status, created_at)
  - `demanda_updates` (demanda_id, status, comentario, autor_id, created_at)
  - `agendamentos` (id, user_id, data, assunto, status)
  - Storage bucket `demanda-fotos` (privado, RLS por owner).
  - RLS: cidadão vê/cria apenas suas demandas; equipe vê todas; GRANTs explícitos para `authenticated` e `service_role`.
- **Validação** com Zod em todos os formulários (cliente e server function).
- **Server functions** (`src/lib/demandas.functions.ts`) com `requireSupabaseAuth` para criar/listar/atualizar demandas.
- **SEO**: H1 único por rota, alt text em todas as imagens, JSON-LD Person no `/biografia`.

## Ordem de entrega sugerida

1. **Entrega 1 (esta etapa)** — Fase 1 + Fase 2 completas (site institucional navegável, conteúdo real, design premium PSB). Você já consegue publicar e divulgar.
2. **Entrega 2** — Ativar Lovable Cloud e implementar Fase 3 (Área do Cidadão + painel da equipe).

Separar em duas entregas evita um build gigante de uma vez e permite revisar o visual antes de investir no backend.

## Antes de eu começar, preciso confirmar:

1. **Fotos do Cícero João**: você tem fotos profissionais para enviar, ou devo usar placeholders neutros (silhueta / fundos de Sorocaba) até você subir?
2. **Logo / brasão do gabinete**: usar apenas tipografia "Cícero João • Vereador" no header, ou você quer um símbolo (pomba estilizada, monograma CJ)?
3. **Confirma seguir com Entrega 1 primeiro** (site institucional) e depois Entrega 2 (Área do Cidadão com Cloud)?
4. **Partido a exibir**: PSB (como na Câmara hoje) ou manter neutro sem sigla no header?

Confirmando esses 4 pontos, parto para a implementação da Entrega 1.
