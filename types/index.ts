export interface FormularioData {
  // Etapa 1 — Situação Atual
  cargo_atual: string;
  area: string;
  salario_atual: string;
  tempo_experiencia: string;

  // Etapa 2 — Objetivo
  cargo_objetivo: string;
  salario_objetivo: string;
  prazo: string;
  motivacao: string;

  // Etapa 3 — Habilidades e Gaps
  habilidades: string;
  gaps: string;
  entrevistas: string;
  tempo_disponivel: string;

  // Etapa 4 — Contexto Pessoal
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  preferencias_aprendizado: string[];
  contexto: string;
}

export interface GapPrioritario {
  gap: string;
  impacto: string;
  solucao: string;
}

export interface Acao {
  semana: number;
  objetivo: string;
  acoes: string[];
  entregavel: string;
  tempo_estimado: string;
}

export interface Mes {
  foco: string;
  semanas: Acao[];
}

export interface Recurso {
  tipo: string;
  nome: string;
  link_busca: string;
}

export interface HabilidadeDesenvolver {
  habilidade: string;
  prioridade: "alta" | "media" | "baixa";
  recursos: Recurso[];
}

export interface EstrategiaPromocao {
  timing_ideal: string;
  argumentos: string[];
  script_conversa: string;
  alertas: string[];
}

export interface PlanoGerado {
  resumo_executivo: string;
  gaps_prioritarios: GapPrioritario[];
  plano_90_dias: {
    mes1: Mes;
    mes2: Mes;
    mes3: Mes;
  };
  habilidades_desenvolver: HabilidadeDesenvolver[];
  estrategia_promocao: EstrategiaPromocao;
  mensagem_motivacional: string;
}

export interface Plano {
  id: string;
  createdAt: string;
  email: string;
  nome: string;
  billingId: string;
  paymentProvider: "woovi" | "stripe";
  status: "pendente" | "gerado" | "erro";
  dadosFormulario: FormularioData;
  planoGerado: PlanoGerado | null;
  cargoAtual: string | null;
  cargoObjetivo: string | null;
}
