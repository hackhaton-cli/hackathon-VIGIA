export type RiskLevel = "alto" | "medio" | "baixo";

export type Condition =
  | "hipertensao"
  | "diabetes"
  | "avc"
  | "doenca_cardiaca"
  | "colesterol"
  | "tabagismo"
  | "obesidade";

export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  times: string[];
  continuous: boolean;
  observation?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: "masculino" | "feminino" | "outro";
  address: string;
  phone: string;
  conditions: Condition[];
  otherConditions: string[];
  medications: Medication[];
  lastVisit?: string;
  createdAt: string;
}

export const conditionLabels: Record<Condition, string> = {
  hipertensao: "Hipertensão",
  diabetes: "Diabetes",
  avc: "Histórico de AVC",
  doenca_cardiaca: "Doença Cardíaca",
  colesterol: "Colesterol Alto",
  tabagismo: "Tabagismo",
  obesidade: "Obesidade",
};

export function calculateRiskScore(patient: Patient): number {
  let score = 0;

  if (patient.age > 70) score += 3;
  else if (patient.age >= 60) score += 2;
  else if (patient.age >= 50) score += 1;

  if (patient.conditions.includes("avc")) score += 3;
  if (patient.conditions.includes("doenca_cardiaca")) score += 3;
  if (patient.conditions.includes("hipertensao")) score += 2;
  if (patient.conditions.includes("diabetes")) score += 2;
  if (patient.conditions.includes("colesterol")) score += 1;
  if (patient.conditions.includes("tabagismo")) score += 1;
  if (patient.conditions.includes("obesidade")) score += 1;

  return score;
}

export function getRiskLevel(patient: Patient): RiskLevel {
  const score = calculateRiskScore(patient);
  if (score >= 7) return "alto";
  if (score >= 3) return "medio";
  return "baixo";
}

export function getRiskReasons(patient: Patient): string[] {
  const reasons: string[] = [];
  if (patient.age > 70) reasons.push("Idade acima de 70 anos");
  else if (patient.age >= 60) reasons.push("Idade entre 60 e 70 anos");

  const conditionNames: Partial<Record<Condition, string>> = {
    avc: "Histórico de AVC",
    doenca_cardiaca: "Doença cardíaca diagnosticada",
    hipertensao: "Hipertensão arterial",
    diabetes: "Diabetes mellitus",
    colesterol: "Colesterol elevado",
    tabagismo: "Tabagismo ativo",
    obesidade: "Obesidade",
  };

  patient.conditions.forEach((c) => {
    if (conditionNames[c]) reasons.push(conditionNames[c]!);
  });

  return reasons;
}

export function getRecommendations(patient: Patient): string[] {
  const level = getRiskLevel(patient);
  const recs: string[] = [];

  if (level === "alto") {
    recs.push("Acompanhamento semanal obrigatório");
    recs.push("Encaminhamento imediato para UBS");
    recs.push("Monitoramento de pressão arterial diário");
  } else if (level === "medio") {
    recs.push("Visita quinzenal recomendada");
    recs.push("Consulta médica no próximo mês");
    recs.push("Orientação sobre hábitos saudáveis");
  } else {
    recs.push("Visita mensal de rotina");
    recs.push("Manter estilo de vida saudável");
    recs.push("Retorno para consulta preventiva anual");
  }

  if (patient.conditions.includes("hipertensao")) {
    recs.push("Monitoramento de pressão arterial");
  }
  if (patient.conditions.includes("diabetes")) {
    recs.push("Controle glicêmico regular");
  }
  if (patient.conditions.includes("avc")) {
    recs.push("Fisioterapia e acompanhamento neurológico");
  }

  return recs;
}

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Maria da Silva",
    age: 72,
    sex: "feminino",
    address: "Rua das Flores, 123 – Bairro Centro",
    phone: "(38) 99123-4567",
    conditions: ["hipertensao", "diabetes"],
    otherConditions: [],
    medications: [
      { id: "m1", name: "Losartana", dose: "50mg", frequency: "1x ao dia", times: ["08:00"], continuous: true },
      { id: "m2", name: "Metformina", dose: "850mg", frequency: "2x ao dia", times: ["08:00", "20:00"], continuous: true },
      { id: "m3", name: "AAS", dose: "100mg", frequency: "1x ao dia", times: ["08:00"], continuous: true, observation: "Tomar após o café" },
    ],
    lastVisit: "2026-02-28",
    createdAt: "2025-01-10",
  },
  {
    id: "2",
    name: "José Ferreira",
    age: 68,
    sex: "masculino",
    address: "Av. Brasil, 456 – Bairro Jardim",
    phone: "(38) 98765-4321",
    conditions: ["doenca_cardiaca", "colesterol"],
    otherConditions: [],
    medications: [
      { id: "m4", name: "Atorvastatina", dose: "40mg", frequency: "1x ao dia", times: ["22:00"], continuous: true },
      { id: "m5", name: "Carvedilol", dose: "12,5mg", frequency: "2x ao dia", times: ["08:00", "20:00"], continuous: true },
    ],
    lastVisit: "2026-02-20",
    createdAt: "2025-02-05",
  },
  {
    id: "3",
    name: "Ana Oliveira",
    age: 55,
    sex: "feminino",
    address: "Rua São Paulo, 789 – Vila Nova",
    phone: "(38) 97654-3210",
    conditions: ["hipertensao"],
    otherConditions: [],
    medications: [
      { id: "m6", name: "Enalapril", dose: "10mg", frequency: "2x ao dia", times: ["08:00", "20:00"], continuous: true },
    ],
    lastVisit: "2026-03-01",
    createdAt: "2025-03-12",
  },
  {
    id: "4",
    name: "Carlos Santos",
    age: 63,
    sex: "masculino",
    address: "Rua das Palmeiras, 321 – Bairro Sul",
    phone: "(38) 96543-2109",
    conditions: ["diabetes", "obesidade", "tabagismo"],
    otherConditions: [],
    medications: [
      { id: "m7", name: "Metformina", dose: "500mg", frequency: "3x ao dia", times: ["08:00", "13:00", "20:00"], continuous: true },
    ],
    lastVisit: "2026-02-15",
    createdAt: "2025-04-18",
  },
  {
    id: "5",
    name: "Tereza Lima",
    age: 78,
    sex: "feminino",
    address: "Alameda Central, 654 – Centro",
    phone: "(38) 95432-1098",
    conditions: ["avc", "hipertensao", "diabetes"],
    otherConditions: ["Insuficiência renal leve"],
    medications: [
      { id: "m8", name: "AAS", dose: "100mg", frequency: "1x ao dia", times: ["08:00"], continuous: true },
      { id: "m9", name: "Losartana", dose: "100mg", frequency: "1x ao dia", times: ["08:00"], continuous: true },
      { id: "m10", name: "Metformina", dose: "850mg", frequency: "2x ao dia", times: ["08:00", "20:00"], continuous: true },
      { id: "m11", name: "Sinvastatina", dose: "20mg", frequency: "1x ao dia", times: ["22:00"], continuous: true, observation: "Tomar à noite" },
    ],
    lastVisit: "2026-02-10",
    createdAt: "2025-05-22",
  },
  {
    id: "6",
    name: "Roberto Costa",
    age: 45,
    sex: "masculino",
    address: "Rua da Paz, 987 – Bairro Norte",
    phone: "(38) 94321-0987",
    conditions: ["tabagismo"],
    otherConditions: [],
    medications: [],
    lastVisit: "2026-03-05",
    createdAt: "2025-06-30",
  },
  {
    id: "7",
    name: "Francisca Mendes",
    age: 80,
    sex: "feminino",
    address: "Rua do Sol, 147 – Vila Esperança",
    phone: "(38) 93210-9876",
    conditions: ["doenca_cardiaca", "hipertensao", "diabetes", "obesidade"],
    otherConditions: ["Osteoporose"],
    medications: [
      { id: "m12", name: "Enalapril", dose: "20mg", frequency: "2x ao dia", times: ["08:00", "20:00"], continuous: true },
      { id: "m13", name: "Metformina", dose: "850mg", frequency: "2x ao dia", times: ["08:00", "20:00"], continuous: true },
      { id: "m14", name: "Furosemida", dose: "40mg", frequency: "1x ao dia", times: ["08:00"], continuous: true, observation: "Evitar à noite" },
      { id: "m15", name: "Carbonato de Cálcio", dose: "500mg", frequency: "2x ao dia", times: ["12:00", "18:00"], continuous: true },
    ],
    lastVisit: "2026-02-05",
    createdAt: "2025-07-14",
  },
  {
    id: "8",
    name: "Paulo Rodrigues",
    age: 38,
    sex: "masculino",
    address: "Rua das Acácias, 258 – Jd. América",
    phone: "(38) 92109-8765",
    conditions: [],
    otherConditions: [],
    medications: [],
    lastVisit: "2026-03-04",
    createdAt: "2025-08-20",
  },
];