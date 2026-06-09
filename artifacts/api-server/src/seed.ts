import {
  db,
  categoriesTable,
  neighborhoodsTable,
  mandateStatsTable,
  projectsTable,
  newsTable,
  agendaTable,
  demandsTable,
  demandActivitiesTable,
} from "@workspace/db";

async function main() {
  console.log("Seeding Gabinete Digital data...");

  await db.delete(demandActivitiesTable);
  await db.delete(demandsTable);
  await db.delete(newsTable);
  await db.delete(agendaTable);
  await db.delete(projectsTable);
  await db.delete(mandateStatsTable);
  await db.delete(neighborhoodsTable);

  const categories = [
    { slug: "saude", name: "Saúde", icon: "heart-pulse" },
    { slug: "educacao", name: "Educação", icon: "graduation-cap" },
    { slug: "infraestrutura", name: "Infraestrutura", icon: "construction" },
    { slug: "iluminacao-publica", name: "Iluminação Pública", icon: "lightbulb" },
    { slug: "saneamento", name: "Saneamento", icon: "droplets" },
    { slug: "seguranca", name: "Segurança", icon: "shield" },
    { slug: "transporte", name: "Transporte", icon: "bus" },
    { slug: "meio-ambiente", name: "Meio Ambiente", icon: "leaf" },
    { slug: "assistencia-social", name: "Assistência Social", icon: "hand-heart" },
    { slug: "esporte-lazer", name: "Esporte e Lazer", icon: "dumbbell" },
  ];
  for (const c of categories) {
    await db.insert(categoriesTable).values(c).onConflictDoNothing();
  }

  const neighborhoods = [
    { name: "Centro", region: "Central" },
    { name: "Zona Norte", region: "Norte" },
    { name: "Zona Leste", region: "Leste" },
    { name: "Éden", region: "Norte" },
    { name: "Ipanema", region: "Norte" },
    { name: "Aparecidinha", region: "Norte" },
    { name: "Brigadeiro Tobias", region: "Norte" },
    { name: "Cajuru", region: "Leste" },
    { name: "Wanel Ville", region: "Oeste" },
    { name: "Vila Haro", region: "Central" },
    { name: "Além Ponte", region: "Central" },
  ];
  await db.insert(neighborhoodsTable).values(neighborhoods);

  await db.insert(mandateStatsTable).values({
    requerimentos: 184,
    indicacoes: 312,
    projetosLei: 27,
    leisAprovadas: 11,
    emendas: 9,
    atendimentos: 1450,
  });

  await db.insert(projectsTable).values([
    {
      title: "Lei de Iluminação Pública em LED nos Bairros",
      summary:
        "Estabelece a substituição gradual das luminárias convencionais por tecnologia LED em todos os bairros do município, ampliando a segurança e a eficiência energética.",
      theme: "Infraestrutura",
      type: "lei",
      status: "aprovado",
      year: 2024,
    },
    {
      title: "Programa Saúde Mais Perto do Cidadão",
      summary:
        "Cria mutirões periódicos de atendimento médico e exames nas Unidades Básicas de Saúde dos bairros com maior demanda reprimida.",
      theme: "Saúde",
      type: "projeto_lei",
      status: "em_tramitacao",
      year: 2025,
    },
    {
      title: "Requerimento de Reforma da UBS do Éden",
      summary:
        "Solicita ao Executivo a reforma estrutural e ampliação do quadro de profissionais da Unidade Básica de Saúde do bairro Éden.",
      theme: "Saúde",
      type: "requerimento",
      status: "aprovado",
      year: 2025,
    },
    {
      title: "Indicação de Recapeamento de Vias na Zona Leste",
      summary:
        "Indica a necessidade de recapeamento asfáltico das principais vias da Zona Leste, atendendo reivindicação histórica dos moradores.",
      theme: "Infraestrutura",
      type: "indicacao",
      status: "em_tramitacao",
      year: 2025,
    },
    {
      title: "Lei de Incentivo ao Esporte Comunitário",
      summary:
        "Institui apoio a projetos esportivos em praças e centros comunitários, promovendo inclusão social por meio do esporte e do lazer.",
      theme: "Esporte e Lazer",
      type: "lei",
      status: "aprovado",
      year: 2023,
    },
    {
      title: "Projeto de Coleta Seletiva Municipal",
      summary:
        "Implanta um sistema integrado de coleta seletiva e pontos de entrega voluntária, fortalecendo a reciclagem e a educação ambiental.",
      theme: "Meio Ambiente",
      type: "projeto_lei",
      status: "em_tramitacao",
      year: 2025,
    },
  ]);

  await db.insert(newsTable).values([
    {
      title: "Nova iluminação em LED chega à Zona Norte",
      summary:
        "Bairros da região recebem modernização da rede de iluminação pública, com mais segurança e economia de energia.",
      body: "Após meses de articulação do mandato junto ao Executivo, a substituição das luminárias convencionais por tecnologia LED começou a ser implantada em diversos bairros da Zona Norte. A medida amplia a luminosidade das vias, reduz o consumo de energia e aumenta a sensação de segurança para os moradores. O gabinete acompanha de perto o cronograma de instalação e segue recebendo demandas por novos pontos de iluminação.",
      imageUrl: "/seed/news-iluminacao.png",
    },
    {
      title: "UBS do Éden recebe melhorias e novos atendimentos",
      summary:
        "Unidade Básica de Saúde passa por reforma e amplia o número de consultas oferecidas à população.",
      body: "A Unidade Básica de Saúde do bairro Éden foi contemplada com melhorias estruturais e ampliação do quadro de atendimento. A conquista é resultado de requerimento aprovado e do acompanhamento contínuo das demandas dos moradores. Com as mudanças, a unidade passa a oferecer mais horários de consulta e melhor acolhimento aos pacientes da região.",
      imageUrl: "/seed/news-saude.png",
    },
    {
      title: "Recapeamento de vias avança na Zona Leste",
      summary:
        "Obras de recuperação asfáltica atendem reivindicação histórica e melhoram a mobilidade na região.",
      body: "As obras de recapeamento asfáltico avançam em importantes vias da Zona Leste, beneficiando motoristas, ciclistas e pedestres. A intervenção atende a uma reivindicação histórica dos moradores e foi pauta de indicação apresentada pelo mandato. O gabinete continua fiscalizando a qualidade dos serviços e a inclusão de novas ruas no programa.",
      imageUrl: "/seed/news-obras.png",
    },
  ]);

  await db.insert(agendaTable).values([
    {
      title: "Sessão Ordinária da Câmara Municipal",
      description:
        "Sessão de votação de projetos e debates sobre as principais pautas do município.",
      location: "Plenário da Câmara Municipal de Sorocaba",
      type: "sessao",
      startsAt: new Date("2026-06-16T17:00:00.000Z"),
    },
    {
      title: "Audiência Pública: Saúde nos Bairros",
      description:
        "Espaço de escuta da população sobre as condições das unidades de saúde e propostas de melhoria.",
      location: "Câmara Municipal de Sorocaba",
      type: "audiencia",
      startsAt: new Date("2026-06-20T22:00:00.000Z"),
    },
    {
      title: "Atendimento ao Cidadão no Éden",
      description:
        "Atendimento itinerante do mandato para registro de demandas e orientação à população.",
      location: "Subprefeitura da Zona Norte",
      type: "atendimento",
      startsAt: new Date("2026-06-25T12:00:00.000Z"),
    },
  ]);

  const cats = await db.select().from(categoriesTable);
  const hoods = await db.select().from(neighborhoodsTable);
  const catId = (slug: string) => cats.find((c) => c.slug === slug)?.id ?? null;
  const hoodId = (name: string) =>
    hoods.find((h) => h.name === name)?.id ?? null;

  const demands = [
    {
      protocol: "DEM-2026-0001",
      title: "Buraco em via pública na Zona Leste",
      description:
        "Há um buraco de grandes proporções na via que dificulta o tráfego de veículos e oferece risco aos motociclistas, especialmente à noite.",
      status: "em_acompanhamento",
      categoryId: catId("infraestrutura"),
      neighborhoodId: hoodId("Zona Leste"),
      photoUrl: "/seed/demand-buraco.png",
      citizenName: "Maria Oliveira",
      citizenEmail: "maria.oliveira@example.com",
      citizenPhone: "(15) 99999-1001",
      activities: [
        { status: "recebida", note: "Demanda registrada pelo portal do cidadão." },
        { status: "em_analise", note: "Demanda em análise pela equipe técnica do gabinete." },
        { status: "encaminhada", note: "Ofício encaminhado à Secretaria de Obras solicitando reparo." },
        { status: "em_acompanhamento", note: "Aguardando agendamento da equipe de manutenção viária." },
      ],
    },
    {
      protocol: "DEM-2026-0002",
      title: "Praça comunitária abandonada em Wanel Ville",
      description:
        "A praça do bairro está com bancos quebrados, mato alto e brinquedos danificados, sem condições de uso pelas famílias.",
      status: "em_analise",
      categoryId: catId("esporte-lazer"),
      neighborhoodId: hoodId("Wanel Ville"),
      photoUrl: "/seed/demand-praca.png",
      citizenName: "João Santos",
      citizenEmail: "joao.santos@example.com",
      citizenPhone: "(15) 99999-1002",
      activities: [
        { status: "recebida", note: "Demanda registrada pelo portal do cidadão." },
        { status: "em_analise", note: "Equipe avaliando a melhor forma de encaminhamento." },
      ],
    },
    {
      protocol: "DEM-2026-0003",
      title: "Falta de iluminação na rua principal de Aparecidinha",
      description:
        "Diversos postes estão sem lâmpadas há semanas, deixando a rua escura e insegura para quem passa à noite.",
      status: "resolvida",
      categoryId: catId("iluminacao-publica"),
      neighborhoodId: hoodId("Aparecidinha"),
      photoUrl: null,
      citizenName: "Ana Souza",
      citizenEmail: "ana.souza@example.com",
      citizenPhone: "(15) 99999-1003",
      activities: [
        { status: "recebida", note: "Demanda registrada pelo portal do cidadão." },
        { status: "em_analise", note: "Localização dos pontos confirmada pela equipe." },
        { status: "encaminhada", note: "Solicitação encaminhada à concessionária de iluminação." },
        { status: "resolvida", note: "Lâmpadas substituídas e iluminação restabelecida no local." },
      ],
    },
    {
      protocol: "DEM-2026-0004",
      title: "Coleta de lixo irregular no Centro",
      description:
        "O caminhão de coleta tem passado em dias alternados sem aviso, gerando acúmulo de lixo nas calçadas.",
      status: "encaminhada",
      categoryId: catId("saneamento"),
      neighborhoodId: hoodId("Centro"),
      photoUrl: null,
      citizenName: "Carlos Lima",
      citizenEmail: "carlos.lima@example.com",
      citizenPhone: "(15) 99999-1004",
      activities: [
        { status: "recebida", note: "Demanda registrada pelo portal do cidadão." },
        { status: "em_analise", note: "Verificação da rota de coleta junto à empresa responsável." },
        { status: "encaminhada", note: "Encaminhado pedido de regularização do cronograma de coleta." },
      ],
    },
  ];

  for (const d of demands) {
    const { activities, ...demand } = d;
    const [created] = await db.insert(demandsTable).values(demand).returning();
    for (const a of activities) {
      await db.insert(demandActivitiesTable).values({
        demandId: created.id,
        status: a.status,
        note: a.note,
        authorName: "Equipe do Gabinete",
      });
    }
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
