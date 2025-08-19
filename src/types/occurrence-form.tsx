export type Currency = "BRL" | "USD" | "EUR";

export type FormValues = {
  date: string;
  time: string;
  occurrenceTypeId: string;
  unidadeId: string;
  setorId: string;
  attendedArea?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  occurrenceFamily?: string;
  report: string;
  classification: "Negativa" | "Positiva";
  severity: "Grave" | "Moderada" | "Leve";
  status?: "Aberto" | "Em_analise" | "Em_andamento" | "Concluido";
  type?: "AVU" | "BRO";
  eventCost?: string;
  currency?: Currency;
  totalCost?: string;
  securityActionIds: number[];
  aggravatingSituationIds: number[];
};
