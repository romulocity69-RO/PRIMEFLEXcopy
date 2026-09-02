// ============================================================
// GLÚTEO PRIME - Mock data (frontend-only phase)
// All data here is fake and will later be replaced by backend.
// ============================================================

export const HERO_IMG =
  "https://images.unsplash.com/photo-1643633807086-ebb17d55f97e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxmaXRuZXNzJTIwbW9kZWwlMjBsZWdnaW5nc3xlbnwwfHx8fDE3ODgzNzI1MTd8MA&ixlib=rb-4.1.0&q=85";

export const TRAINER_IMG =
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&q=85&w=200";

export const EXERCISE_IMGS = {
  hipthrust:
    "https://images.unsplash.com/photo-1649887974297-4be052375a67?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
  squat:
    "https://images.unsplash.com/photo-1618168220187-ef594ca55286?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
  bulgarian:
    "https://images.unsplash.com/photo-1609899494145-417d7327ea9e?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
  abductor:
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?crop=entropy&cs=srgb&fm=jpg&q=85&w=200",
};

export const brand = {
  name: "GLÚTEO",
  name2: "PRIME",
  tagline: "MÉTODO EXCLUSIVO PARA TRANSFORMAR SEU CORPO E SUA VIDA.",
  footer: "VOCÊ NO SEU MELHOR. TODOS OS DIAS.",
  footerAccent: "ESSE É O MÉTODO PRIME.",
};

export const navItems = [
  { icon: "Dumbbell", label: "TREINOS", sub: "PERSONALIZADOS" },
  { icon: "UtensilsCrossed", label: "ACOMPANHAMENTO", sub: "PREMIUM" },
  { icon: "BarChart3", label: "RESULTADOS", sub: "REAIS" },
  { icon: "Users", label: "COMUNIDADE", sub: "PRIME" },
  { icon: "ShieldCheck", label: "SUPORTE", sub: "PRIME" },
];

export const drika = {
  hiName: "Eu sou",
  name: "Drika Host",
  bio: "Criadora do método Glúteo Prime. Minha missão é ajudar mulheres a alcançarem sua melhor versão com treinos inteligentes, flexíveis e resultados reais.",
  motto: "Você no seu melhor todos os dias.",
  instagram: "@drikahostt",
  tiktok: "@drikahostt",
};

export const primeFlex = {
  badge: "EXCLUSIVO PRIME",
  title1: "PRIME",
  title2: "FLEX",
  headline: ["TREINE NO SEU TEMPO.", "PAUSE SEM CULPA.", "EVOLUA SEM PRESSÃO."],
  description:
    "O Prime Flex entende sua rotina, seu ciclo e seus desafios. Mais liberdade para você manter o foco e não parar.",
  features: [
    { icon: "CalendarDays", label: "Pause quando precisar" },
    { icon: "RefreshCw", label: "Dias extras em todos os planos" },
    { icon: "Heart", label: "Sem culpa, sem pressão" },
    { icon: "TrendingUp", label: "Consistência que gera resultado" },
  ],
};

export const phoneFlex = {
  time: "9:41",
  appTitle: "PRIME FLEX",
  appTag: "EXCLUSIVO",
  availLabel: "Seus dias Flex disponíveis",
  availDays: "+10 DIAS",
  plan: "Plano Trimestral",
  planNote: "Use quando precisar, sem culpa.",
  button: "PAUSAR TREINO",
  monthLabel: "MAIO 2025",
  weekDays: ["D", "S", "T", "Q", "Q", "S", "S"],
  // calendar cells with special markers
  calendar: [
    { d: "", },
    { d: "", },
    { d: "", },
    { d: "", },
    { d: 1, active: true },
    { d: 2 },
    { d: 3 },
    { d: 4 },
    { d: 5 },
    { d: 6, gold: true },
    { d: 7, gold: true },
    { d: 8, gold: true },
    { d: 9 },
    { d: 10 },
    { d: 11 },
    { d: 12 },
    { d: 13 },
    { d: 14 },
    { d: 15 },
    { d: 16 },
    { d: 17 },
    { d: 18 },
    { d: 19 },
    { d: 20, ring: true },
    { d: 21 },
    { d: 22 },
    { d: 23 },
    { d: 24 },
    { d: 25 },
    { d: 26 },
    { d: 27 },
    { d: 28 },
    { d: 29 },
    { d: 30 },
    { d: 31 },
  ],
  historyTitle: "Histórico de pausas",
  history: [
    { range: "02/05 – 03/05", note: "2 dias usados", done: true },
    { range: "12/05", note: "1 dia usado", done: true },
    { range: "20/05 – ...", note: "Em andamento", done: false },
  ],
  footerNote:
    "Use seus dias Flex sempre que precisar. Seu plano será estendido automaticamente.",
};

export const diasExtras = {
  badge: "EXCLUSIVO DE LANÇAMENTO",
  title: "DIAS EXTRAS",
  subtitle: "EM TODOS OS PLANOS!",
  items: [
    { period: "MENSAL", days: "+5", unit: "DIAS" },
    { period: "TRIMESTRAL", days: "+10", unit: "DIAS" },
    { period: "SEMESTRAL", days: "+20", unit: "DIAS" },
    { period: "ANUAL", days: "+30", unit: "DIAS" },
  ],
  cta: "MAIS LIBERDADE PARA CUIDAR DE VOCÊ SEM SAIR DO FOCO!",
};

export const plans = [
  {
    id: "start",
    label: "PLANO",
    name: "START",
    icon: "Apple",
    discount: "35% OFF",
    subtitle: "TREINOS PRONTOS PARA VOCÊ COMEÇAR",
    features: [
      "+ de 30 treinos prontos",
      "Vídeos de execução",
      "Guias e materiais de apoio",
      "Organização semanal",
      "Comunidade Prime",
      "Prime Flex incluso",
    ],
    pricing: [
      { period: "MENSAL", old: "R$ 59,90", price: "R$ 39,90", unit: "/mês", extra: "+5 DIAS" },
      { period: "TRIMESTRAL", old: "R$ 149,90", price: "R$ 99,90", unit: "/3 meses", perMonth: "R$ 33,30/mês", extra: "+10 DIAS" },
      { period: "SEMESTRAL", old: "R$ 269,90", price: "R$ 179,90", unit: "/6 meses", perMonth: "R$ 29,98/mês", extra: "+20 DIAS" },
      { period: "ANUAL", old: "R$ 499,90", price: "R$ 299,90", unit: "/12 meses", perMonth: "R$ 24,99/mês", extra: "+30 DIAS" },
    ],
    button: "QUERO O START",
    tagline: "Ideal para quem está começando!",
  },
  {
    id: "2.0",
    label: "PLANO",
    name: "2.0",
    icon: "Dumbbell",
    discount: "30% OFF",
    subtitle: "TREINO PERSONALIZADO PARA SEUS RESULTADOS",
    features: [
      "Treinos personalizados",
      "Acompanhamento da personal",
      "Registro de cargas e repetições",
      "Substituições de exercícios",
      "Atualizações periódicas",
      "Prime Flex incluso",
    ],
    pricing: [
      { period: "MENSAL", old: "R$ 99,90", price: "R$ 69,90", unit: "/mês", extra: "+5 DIAS" },
      { period: "TRIMESTRAL", old: "R$ 259,90", price: "R$ 179,90", unit: "/3 meses", perMonth: "R$ 59,97/mês", extra: "+10 DIAS" },
      { period: "SEMESTRAL", old: "R$ 479,90", price: "R$ 279,90", unit: "/6 meses", perMonth: "R$ 46,65/mês", extra: "+20 DIAS" },
      { period: "ANUAL", old: "R$ 899,90", price: "R$ 499,90", unit: "/12 meses", perMonth: "R$ 41,66/mês", extra: "+30 DIAS" },
    ],
    button: "QUERO O PRIME 2.0",
    tagline: "Mais resultado, mais acompanhamento!",
  },
  {
    id: "3d",
    label: "PLANO",
    name: "3D",
    icon: "Gem",
    discount: "27% OFF",
    subtitle: "ACOMPANHAMENTO PREMIUM COMPLETO",
    features: [
      "Treino personalizado",
      "Plano alimentar individualizado",
      "Acompanhamento Premium",
      "Avaliações e ajustes constantes",
      "Suporte direto com a equipe",
      "Análise de evolução completa",
      "Prime Flex incluso",
    ],
    pricing: [
      { period: "MENSAL", old: "R$ 159,90", price: "R$ 109,90", unit: "/mês", extra: "+5 DIAS" },
      { period: "TRIMESTRAL", old: "R$ 399,90", price: "R$ 279,90", unit: "/3 meses", perMonth: "R$ 93,30/mês", extra: "+10 DIAS" },
      { period: "SEMESTRAL", old: "R$ 699,90", price: "R$ 479,90", unit: "/6 meses", perMonth: "R$ 79,98/mês", extra: "+20 DIAS" },
      { period: "ANUAL", old: "R$ 1.099,90", price: "R$ 799,90", unit: "/12 meses", perMonth: "R$ 66,66/mês", extra: "+30 DIAS" },
    ],
    button: "QUERO O PRIME 3D",
    tagline: "A experiência completa para transformar!",
  },
];

export const guarantee = {
  title: "7 DIAS DE GARANTIA",
  text: "Não gostou? Devolvemos 100% do seu dinheiro.",
  script1: "Sua melhor versão",
  script2: "começa agora!",
  ratingLabel: "EXCELENTE",
  ratingNote: "+15.000 mulheres transformadas",
  trustpilot: "Trustpilot",
};

export const bottomFeatures = [
  { icon: "Apple", title: "MÉTODO EXCLUSIVO", text: "Desenvolvido para mulheres que querem resultados reais." },
  { icon: "Heart", title: "ACOMPANHAMENTO HUMANO", text: "Você nunca estará sozinha." },
  { icon: "BarChart3", title: "RESULTADOS QUE TRANSFORMAM", text: "Seu melhor corpo, sua melhor versão." },
  { icon: "CalendarClock", title: "FLEXIBILIDADE PARA A VIDA REAL", text: "Treine no seu tempo, sem culpa." },
  { icon: "ShieldCheck", title: "SEGURANÇA E PRIVACIDADE", text: "Seus dados protegidos sempre." },
];

// ============================================================
// APP (workout) mock data
// ============================================================

export const weekDays = [
  { day: "SEG", date: 20, active: true },
  { day: "TER", date: 21 },
  { day: "QUA", date: 22 },
  { day: "QUI", date: 23 },
  { day: "SEX", date: 24 },
  { day: "SÁB", date: 25 },
  { day: "DOM", date: 26 },
];

export const bottomNav = [
  { icon: "Home", label: "Início" },
  { icon: "Dumbbell", label: "Treino" },
  { icon: "TrendingUp", label: "Evolução" },
  { icon: "MessageSquare", label: "Mensagens", badge: 2 },
  { icon: "User", label: "Perfil" },
];

const baseExercises = [
  { id: 1, name: "Hip Thrust", tag: "Exercício principal", img: EXERCISE_IMGS.hipthrust, sets: "4 séries", reps: "8–10 reps", rest: "Descanso: 90s", suggested: "40 kg", prev: "40 kg", current: "45 kg" },
  { id: 2, name: "Agachamento Livre", img: EXERCISE_IMGS.squat, sets: "3 séries", reps: "12–15 reps", rest: "Descanso: 90s", suggested: "30 kg", prev: "30 kg", current: "32,5 kg" },
  { id: 3, name: "Búlgaro", img: EXERCISE_IMGS.bulgarian, sets: "3 séries", reps: "10–12 reps cada perna", rest: "Descanso: 60s", suggested: "12 kg", prev: "12 kg", current: "14 kg" },
  { id: 4, name: "Cadeira Abdutora", img: EXERCISE_IMGS.abductor, sets: "3 séries", reps: "15–20 reps", rest: "Descanso: 45s", suggested: "25 kg", prev: "25 kg", current: "27,5 kg" },
];

export const appPlans = {
  start: {
    name: "START",
    icon: "Apple",
    subtitle: "TREINOS PRONTOS PARA VOCÊ COMEÇAR",
    workoutTitle: "Treino A",
    workoutName: "Glúteos + Quadríceps",
    duration: "60 min",
    level: "Iniciante",
    frequency: "3x por semana",
    exercises: baseExercises,
    receiveTitle: "O QUE VOCÊ RECEBE NO START",
    receive: [
      "Treinos prontos e práticos",
      "Exercícios com vídeos e demonstrações",
      "Organização semanal",
      "Acesso à comunidade Prime",
    ],
  },
  "2.0": {
    name: "2.0",
    icon: "Dumbbell",
    subtitle: "TREINO PERSONALIZADO PARA SEUS RESULTADOS",
    workoutTitle: "Treino A",
    workoutName: "Glúteos + Quadríceps",
    personalNote: "Treino personalizado para você",
    personalObjective: "Objetivo: Hipertrofia de glúteos",
    personalLevel: "Nível: Intermediário · 4x por semana",
    exercises: baseExercises,
    receiveTitle: "O QUE VOCÊ RECEBE NO PRIME 2.0",
    receive: [
      "Treinos personalizados pelo seu perfil",
      "Substituições para cada exercício",
      "Registro de cargas e repetições",
      "Acompanhamento da sua evolução",
      "Orientações da sua personal",
      "Atualizações periódicas do treino",
    ],
    chartTitle: "Evolução",
    chartSub: "Força (Carga média)",
    chart: [
      { label: "JAN", value: 20 },
      { label: "FEV", value: 25 },
      { label: "MAR", value: 30 },
      { label: "ABR", value: 35 },
      { label: "MAI", value: 40 },
    ],
  },
  "3d": {
    name: "3D",
    icon: "Gem",
    subtitle: "ACOMPANHAMENTO PREMIUM COMPLETO",
    workoutTitle: "Treino A",
    workoutName: "Glúteos + Quadríceps",
    personalName: "Juliana",
    personalRole: "Sua personal",
    nextEval: "Próxima avaliação: 27/05",
    focus: "Foco de hoje: mantenha a amplitude e controle na fase de descida dos movimentos.",
    exercises: baseExercises,
    receiveTitle: "O QUE VOCÊ RECEBE NO PRIME 3D",
    receive: [
      "Tudo do Prime 2.0",
      "Acompanhamento nutricional",
      "Avaliações e ajustes constantes",
      "Feedback e mensagens da personal",
      "Análise de evolução (cargas e medidas)",
      "Planos adaptados para seus resultados",
    ],
    sidePanels: {
      followTitle: "Seu acompanhamento 3D",
      followItems: [
        { icon: "ClipboardList", label: "Avaliações" },
        { icon: "UtensilsCrossed", label: "Plano alimentar" },
        { icon: "Sliders", label: "Ajustes" },
        { icon: "LineChart", label: "Histórico de cargas" },
        { icon: "TrendingUp", label: "Gráficos de evolução" },
        { icon: "Camera", label: "Fotos progresso" },
        { icon: "MessageSquare", label: "Feedback da personal" },
        { icon: "StickyNote", label: "Anotações" },
        { icon: "Sparkles", label: "Prime Flex" },
      ],
      bodyTitle: "Evolução corporal",
      bodySub: "Últimas medidas · 20/05",
      body: [
        { label: "Peso", value: "54,2 kg", delta: "-1,3 kg" },
        { label: "Cintura", value: "66 cm", delta: "-2 cm" },
        { label: "Quadril", value: "98 cm", delta: "+1 cm" },
        { label: "Coxa", value: "55 cm", delta: "-0,5 cm" },
      ],
      summaryTitle: "Resumo da evolução",
      summarySub: "Últimos 30 dias",
      summary: [
        { label: "Treinos concluídos", value: "18/20" },
        { label: "Volume total", value: "+18%" },
        { label: "Carga média", value: "+12%" },
        { label: "Frequência", value: "100%" },
        { label: "Dias seguidos", value: "7", fire: true },
      ],
      chartTitle: "Gráfico de cargas",
      chartSub: "Hip Thrust (carga média)",
      chart: [
        { label: "JAN", value: 20 },
        { label: "FEV", value: 25 },
        { label: "MAR", value: 30 },
        { label: "ABR", value: 35 },
        { label: "MAI", value: 40 },
        { label: "JUN", value: 45 },
      ],
    },
  },
};
