import { useParams, useNavigate } from "react-router-dom";
import { OccurrenceForm } from "@/components/occurrence/OccurrenceForm";
import { useOccurrenceById } from "@/hooks/useOccorrencyById";
import { useUpdateOccurrence } from "@/hooks/useUpdateOccurrence";
import type { FormValues } from "@/types/occurrence-form";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

function toHHmmssFromISO(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function extractSecurityActionIds(list: any[] | undefined | null): number[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => {
      const nested = item?.securityAction?.id;
      const linked = item?.securityActionId;
      const flat = item?.id;
      return Number(nested ?? linked ?? flat);
    })
    .filter((n) => Number.isFinite(n));
}

function extractAggravatingIds(list: any[] | undefined | null): number[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => {
      const nested = item?.aggravatingSituation?.id;
      const linked = item?.aggravatingSituationId;
      const flat = item?.id;
      return Number(nested ?? linked ?? flat);
    })
    .filter((n) => Number.isFinite(n));
}

export default function EditarOcorrencia() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: occurrence, isLoading } = useOccurrenceById(id);
  const { mutate: updateOccurrence, isPending } = useUpdateOccurrence(() => {
    navigate(`/detalhesocorrencias/${id}`);
  });

  if (isLoading) return <div className="p-6">Carregando...</div>;
  if (!occurrence) return <div className="p-6">Ocorrência não encontrada.</div>;

  const unidadeIdResolved =
    (occurrence as any)?.unidadeId ??
    (occurrence as any)?.setor?.unidadeId ??
    "";

  const initial: Partial<FormValues> = {
    date: new Date(occurrence.date).toISOString().slice(0, 10),
    time: toHHmmssFromISO(occurrence.time), // agora pode retornar ""
    occurrenceTypeId: String(occurrence.occurrenceTypeId ?? ""),
    unidadeId: String(unidadeIdResolved ?? ""),
    setorId: String(occurrence.setorId ?? ""),
    attendedArea: occurrence.attendedArea ?? "",
    city: occurrence.city ?? "",
    latitude:
      occurrence.latitude !== undefined && occurrence.latitude !== null
        ? String(occurrence.latitude)
        : "",
    longitude:
      occurrence.longitude !== undefined && occurrence.longitude !== null
        ? String(occurrence.longitude)
        : "",
    occurrenceFamily: occurrence.occurrenceFamily ?? "",
    report: occurrence.report ?? "",
    classification: occurrence.classification ?? "Negativa",
    severity: occurrence.severity ?? "Moderada",
    status: occurrence.status ?? undefined,
    type: occurrence.type ?? undefined,
    eventCost:
      occurrence.eventCost !== undefined && occurrence.eventCost !== null
        ? String(occurrence.eventCost)
        : "",
    currency: occurrence.currency ?? "BRL",
    totalCost:
      occurrence.totalCost !== undefined && occurrence.totalCost !== null
        ? String(occurrence.totalCost)
        : "",
    securityActionIds: extractSecurityActionIds(
      (occurrence as any)?.securityActions
    ),
    aggravatingSituationIds: extractAggravatingIds(
      (occurrence as any)?.aggravatingSituations
    ),
  };

  const handleSubmit = (
    v: FormValues,
    { newPhotos64 }: { newPhotos64: string[] }
  ) => {
    if (!id) return;

    // normaliza time: "" -> undefined e valida formato HH:mm[:ss]
    const timeNormalized = v.time && TIME_RE.test(v.time) ? v.time : undefined;

    updateOccurrence({
      id: Number(id),
      data: {
        date: v.date,
        time: timeNormalized, // evita enviar "" pro backend
        occurrenceTypeId: v.occurrenceTypeId
          ? Number(v.occurrenceTypeId)
          : undefined,
        setorId: v.setorId ? Number(v.setorId) : undefined,
        attendedArea: v.attendedArea || undefined,
        city: v.city || undefined,
        latitude: v.latitude ? Number(v.latitude) : undefined,
        longitude: v.longitude ? Number(v.longitude) : undefined,
        occurrenceFamily: v.occurrenceFamily || undefined,
        report: v.report,
        classification: v.classification,
        severity: v.severity,
        status: v.status || undefined,
        type: v.type || undefined,
        eventCost: v.eventCost ? Number(v.eventCost) : undefined,
        currency: v.currency || undefined,
        totalCost: v.totalCost ? Number(v.totalCost) : undefined,
        occurrencePhotos: newPhotos64.length ? newPhotos64 : undefined,
        securityActionIds: v.securityActionIds,
        aggravatingSituationIds: v.aggravatingSituationIds,
      },
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <OccurrenceForm
          mode="edit"
          initialValues={initial}
          onSubmit={handleSubmit}
          submitting={isPending}
        />
      </main>
    </div>
  );
}
