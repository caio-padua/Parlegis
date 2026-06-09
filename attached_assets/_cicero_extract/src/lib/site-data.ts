export const bairros = [
  "Centro", "Zona Norte", "Zona Leste", "Éden", "Ipanema",
  "Aparecidinha", "Brigadeiro Tobias", "Cajuru", "Wanel Ville",
  "Vila Haro", "Além Ponte", "Vila Helena", "Jardim Maria Eugênia",
  "Vila Barão", "Júlio de Mesquita",
];

export const areasTematicas = [
  { titulo: "Saúde", desc: "UBS, atendimento e prevenção." },
  { titulo: "Segurança", desc: "Iluminação, GCM e prevenção." },
  { titulo: "Acessibilidade", desc: "Calçadas e rebaixamentos." },
  { titulo: "Zeladoria", desc: "Limpeza, poda e manutenção." },
  { titulo: "Trânsito", desc: "Sinalização e mobilidade." },
  { titulo: "Bairros", desc: "Demandas locais ouvidas." },
  { titulo: "Comércio local", desc: "Apoio ao pequeno empreendedor." },
  { titulo: "Educação", desc: "Escolas, creches e cultura." },
] as const;

export const mandatoNumeros = [
  { numero: "1.039", label: "Requerimentos" },
  { numero: "306", label: "Indicações" },
  { numero: "51", label: "Projetos de Lei" },
  { numero: "12", label: "Leis Ordinárias" },
  { numero: "111", label: "Emendas" },
] as const;

export type Projeto = {
  slug: string;
  titulo: string;
  tema: string;
  status: "Aprovado" | "Em tramitação" | "Sancionado";
  resumo: string;
  ano: string;
};

export const projetos: Projeto[] = [
  {
    slug: "lei-13219-2025-pedagio",
    titulo: "Lei 13.219/2025 — Manifestação contrária à instalação de pedágio",
    tema: "Mobilidade",
    status: "Sancionado",
    resumo:
      "Estabelece manifestação institucional do Município contra a instalação de pedágios em vias urbanas de Sorocaba.",
    ano: "2025",
  },
  {
    slug: "rebaixamento-calcadas",
    titulo: "Rebaixamento de calçadas para acessibilidade",
    tema: "Acessibilidade",
    status: "Aprovado",
    resumo:
      "Indicação para rebaixamento de calçadas em pontos críticos de tráfego, garantindo passagem segura a pedestres e cadeirantes.",
    ano: "2024",
  },
  {
    slug: "iluminacao-publica-bairros",
    titulo: "Reforço de iluminação pública nos bairros",
    tema: "Segurança",
    status: "Em tramitação",
    resumo:
      "Requerimentos para substituição de luminárias por LED e ampliação da iluminação em ruas e praças de bairros periféricos.",
    ano: "2024",
  },
  {
    slug: "apoio-comercio-local",
    titulo: "Apoio ao comércio local e empreendedorismo",
    tema: "Economia",
    status: "Em tramitação",
    resumo:
      "Conjunto de propostas para desburocratizar licenças e fortalecer pequenos comércios de bairro em Sorocaba.",
    ano: "2025",
  },
  {
    slug: "trafego-zona-norte",
    titulo: "Reordenação de tráfego — Zona Norte",
    tema: "Trânsito",
    status: "Aprovado",
    resumo:
      "Indicações para nova sinalização, lombadas e travessias seguras em vias com alto fluxo escolar.",
    ano: "2024",
  },
  {
    slug: "zeladoria-pracas",
    titulo: "Programa permanente de zeladoria de praças",
    tema: "Zeladoria",
    status: "Em tramitação",
    resumo:
      "Cronograma fixo de poda, limpeza e manutenção de praças, com canal direto para moradores reportarem problemas.",
    ano: "2025",
  },
];

export const noticias = [
  {
    titulo: "Cícero João solicita rebaixamento de calçada para tráfego seguro",
    data: "12 de maio de 2025",
    resumo:
      "Indicação protocolada pede adequação em via de grande circulação para garantir acessibilidade.",
  },
  {
    titulo: "Reunião com lideranças da Zona Leste discute zeladoria",
    data: "28 de março de 2025",
    resumo:
      "Encontro com moradores e associações tratou de pavimentação, iluminação e limpeza urbana.",
  },
  {
    titulo: "Audiência pública debate apoio ao comércio de bairro",
    data: "10 de fevereiro de 2025",
    resumo:
      "Vereador participa de debate com pequenos empresários sobre desburocratização e crédito.",
  },
];

export const agenda = [
  { data: "Toda terça · 14h", titulo: "Atendimento no Gabinete", local: "Câmara Municipal — Sala 12" },
  { data: "1ª quinta do mês · 19h", titulo: "Reunião aberta — Zona Norte", local: "Salão paroquial — Aparecidinha" },
  { data: "Sábados alternados · 9h", titulo: "Cícero nos Bairros", local: "Roteiro divulgado nas redes" },
];
