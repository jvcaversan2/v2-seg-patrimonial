export const Classification = {
  Negativa: "Negativa",
  Positiva: "Positiva",
} as const;

export type Classification = keyof typeof Classification;

// severity.ts
export const Severity = {
  Grave: "Grave",
  Moderada: "Moderada",
  Leve: "Leve",
} as const;

export type Severity = keyof typeof Severity;

// status.ts
export const Status = {
  Aberto: "Aberto",
  Em_analise: "Em_analise",
  Em_andamento: "Em_andamento",
  Concluido: "Concluido",
} as const;

export type Status = keyof typeof Status;

// currency.ts
export const Currency = {
  BRL: "BRL",
  USD: "USD",
  EUR: "EUR",
} as const;

export type Currency = keyof typeof Currency;

// occurrence-type.ts
export const OccurrenceType = {
  AVU: "AVU",
  BRO: "BRO",
} as const;

export type OccurrenceType = keyof typeof OccurrenceType;

export interface EmitenteFormData {
  name: string;
  registration: string;
  unit: string;
  ciu?: string;
}

export const OccurrenceFamily = {
  Ocorrencia: "Ocorrencia",
  Vulnerabilidade: "Vulnerabilidade",
} as const;

export type OccurrenceFamily = keyof typeof OccurrenceFamily;
