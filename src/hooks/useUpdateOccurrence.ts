import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useAuthStore } from "@/store/auth";

type Classification = "Positiva" | "Negativa";
type Severity = "Grave" | "Moderada" | "Leve";
type Status = "Aberto" | "Em_analise" | "Em_andamento" | "Concluido";
type Currency = "BRL" | "USD" | "EUR";
type OccurrenceModel = "AVU" | "BRO";
type OccurrenceFamily = string;

export type UpdateOccurrencePayload = Partial<{
  date: string;
  time: string;
  occurrenceTypeId: number;
  setorId: number;
  attendedArea: string;
  projectSite: string;
  city: string;
  latitude: number;
  longitude: number;
  report: string;
  classification: Classification;
  severity: Severity;
  status: Status;
  occurrenceFamily: OccurrenceFamily;
  eventCost: number;
  currency: Currency;
  totalCost: number;
  type: OccurrenceModel;
  occurrencePhotos: string[];
  securityActionIds: number[];
  aggravatingSituationIds: number[];
}>;

type Variables = { id: number; data: UpdateOccurrencePayload };

const normalizeTime = (t: string): string => {
  const s = t.trim();
  if (/^\d{2}:\d{2}$/.test(s)) return s;
  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }
  return s;
};

const coerceNumber = (v: unknown) =>
  v === null || v === undefined || v === "" ? undefined : Number(v);

const sanitize = (i: UpdateOccurrencePayload): UpdateOccurrencePayload => {
  const out: UpdateOccurrencePayload = { ...i };

  if (out.time != null) out.time = normalizeTime(out.time);
  if (out.occurrenceTypeId != null)
    out.occurrenceTypeId = Number(out.occurrenceTypeId);
  if (out.setorId != null) out.setorId = Number(out.setorId);

  if (out.latitude != null) out.latitude = coerceNumber(out.latitude)!;
  if (out.longitude != null) out.longitude = coerceNumber(out.longitude)!;
  if (out.eventCost != null) out.eventCost = coerceNumber(out.eventCost)!;
  if (out.totalCost != null) out.totalCost = coerceNumber(out.totalCost)!;

  if (out.occurrencePhotos)
    out.occurrencePhotos = out.occurrencePhotos.filter(Boolean);

  if (out.securityActionIds)
    out.securityActionIds = out.securityActionIds
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n));

  if (out.aggravatingSituationIds)
    out.aggravatingSituationIds = out.aggravatingSituationIds
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n));

  return out;
};

const stripUndefined = (obj: UpdateOccurrencePayload) => {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as UpdateOccurrencePayload;
};

const extractErrorMessage = (error: any): string => {
  const msg = error?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join("\n");
  if (typeof msg === "string") return msg;
  return "Erro ao atualizar ocorrência.";
};

export function useUpdateOccurrence(onSuccessCallback?: (id: number) => void) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: Variables) => {
      const payload = stripUndefined(sanitize(data));
      const res = await api.patch(`/occurrences/${id}`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return { id, data: res.data };
    },
    onSuccess: ({ id }) => {
      // lista + detalhe
      queryClient.invalidateQueries({ queryKey: ["occurrences"] });
      queryClient.invalidateQueries({ queryKey: ["occurrence", id] });
      onSuccessCallback?.(id);
    },
    onError: (error: any) => {
      alert(extractErrorMessage(error));
    },
  });
}
