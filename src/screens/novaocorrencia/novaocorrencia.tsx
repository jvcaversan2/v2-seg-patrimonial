import { useNavigate } from "react-router-dom";
import { OccurrenceForm } from "@/components/occurrence/OccurrenceForm";
import { useCreateOccurrence } from "@/hooks/useCreateOccurrence";
import type { FormValues } from "@/types/occurrence-form";

export default function NovaOcorrencia() {
  const navigate = useNavigate();
  const { mutate: createOccurrence, isPending } = useCreateOccurrence(() => {
    navigate("/home");
  });

  const handleSubmit = (
    v: FormValues,
    { newPhotos64 }: { newPhotos64: string[] }
  ) => {
    createOccurrence({
      date: v.date,
      time: v.time,
      occurrenceTypeId: Number(v.occurrenceTypeId),
      setorId: Number(v.setorId),
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
    } as any);
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <OccurrenceForm
          mode="create"
          onSubmit={handleSubmit}
          submitting={isPending}
        />
      </main>
    </div>
  );
}
