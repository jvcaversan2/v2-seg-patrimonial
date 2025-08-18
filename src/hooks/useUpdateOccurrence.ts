// // src/hooks/useUpdateOccurrence.ts
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { api } from "../api/axios";
// import { useAuthStore } from "@/store/auth";

// type Classification = "Positiva" | "Negativa";
// type Severity = "Grave" | "Moderada" | "Leve";
// type Status = "Aberto" | "Em_analise" | "Em_andamento" | "Concluido";
// type Currency = "BRL" | "USD" | "EUR";
// type OccurrenceModel = "AVU" | "BRO";
// type OccurrenceFamily = string;

// export type UpdateOccurrencePayload = {
//   date: string;
//   time: string;
//   occurrenceTypeId: number;
//   setorId: number;
//   attendedArea?: string;
//   projectSite?: string;
//   city?: string;
//   latitude?: number;
//   longitude?: number;
//   report: string;
//   classification: Classification;
//   severity: Severity;
//   status?: Status;
//   occurrenceFamily?: OccurrenceFamily;
//   eventCost?: number;
//   currency?: Currency;
//   totalCost?: number;
//   type?: OccurrenceModel;
//   occurrencePhotos?: string[];
//   securityActionIds: number[];
//   aggravatingSituationIds: number[];
// };

// const normalizeTime = (t: string): string => {
//   const s = t.trim();
//   if (/^\d{2}:\d{2}$/.test(s)) return s;
//   if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s;
//   const d = new Date(s);
//   if (!Number.isNaN(d.getTime())) {
//     const hh = String(d.getHours()).padStart(2, "0");
//     const mm = String(d.getMinutes()).padStart(2, "0");
//     const ss = String(d.getSeconds()).padStart(2, "0");
//     return `${hh}:${mm}:${ss}`;
//   }
//   return s;
// };

// const coerceNumber = (v: unknown) =>
//   v === null || v === undefined || v === "" ? undefined : Number(v);

// const sanitizePayload = (
//   i: UpdateOccurrencePayload
// ): UpdateOccurrencePayload => ({
//   ...i,
//   time: normalizeTime(i.time),
//   occurrenceTypeId: Number(i.occurrenceTypeId),
//   setorId: Number(i.setorId),
//   latitude: coerceNumber(i.latitude),
//   longitude: coerceNumber(i.longitude),
//   eventCost: coerceNumber(i.eventCost),
//   totalCost: coerceNumber(i.totalCost),
//   occurrencePhotos: i.occurrencePhotos?.filter(Boolean),
//   securityActionIds: (i.securityActionIds ?? [])
//     .map((n) => Number(n))
//     .filter((n) => Number.isInteger(n)),
//   aggravatingSituationIds: (i.aggravatingSituationIds ?? [])
//     .map((n) => Number(n))
//     .filter((n) => Number.isInteger(n)),
// });

// const extractErrorMessage = (error: any): string => {
//   const msg = error?.response?.data?.message;
//   if (Array.isArray(msg)) return msg.join("\n");
//   if (typeof msg === "string") return msg;
//   return "Erro ao editar ocorrência.";
// };

// export function useUpdateOccurrence(onSuccessCallback?: (id: number) => void) {
//   const accessToken = useAuthStore((s) => s.token);
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       id,
//       data,
//     }: {
//       id: number;
//       data: UpdateOccurrencePayload;
//     }) => {
//       const payload = sanitizePayload(data);
//       const res = await api.patch(`/occurrences/${id}`, payload, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       return { id, data: res.data };
//     },
//     onSuccess: ({ id }) => {
//       queryClient.invalidateQueries({ queryKey: ["occurrences"] });
//       queryClient.invalidateQueries({ queryKey: ["occurrence", id] });
//       onSuccessCallback?.(id);
//     },
//     onError: (error: any) => {
//       alert(extractErrorMessage(error));
//     },
//   });
// }
