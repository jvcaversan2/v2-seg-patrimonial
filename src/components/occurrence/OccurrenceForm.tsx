import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectItem } from "@/components/ui/select";
import { Loader2, RefreshCw, Save } from "lucide-react";

import { useUnidades } from "@/hooks/useUnidades";
import { useSetoresByUnidade } from "@/hooks/useSetores";
import { useOccurrenceTypes } from "@/hooks/useOccurrenceTypes";
import { useOccurrenceFlags } from "@/hooks/useOccurrenceFlags";
import type { Unidade } from "@/types/unidade";

import { Section } from "./Section";
import { FormSelect } from "./FormSelect";
import { PhotoUploader } from "./PhotoUploader";
import { FlagsChecklist } from "./FlagsChecklist";
import type { FormValues } from "@/types/occurrence-form";

export function OccurrenceForm({
  mode = "create",
  initialValues,
  onSubmit,
  submitting,
  onReset,
}: {
  mode?: "create" | "edit";
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues, extras: { newPhotos64: string[] }) => void;
  submitting?: boolean;
  onReset?: () => void;
}) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const nowHhmm = useMemo(() => {
    const n = new Date();
    return `${String(n.getHours()).padStart(2, "0")}:${String(
      n.getMinutes()
    ).padStart(2, "0")}`;
  }, []);

  const { data: unidades = [] } = useUnidades();
  const { data: occurrenceTypes = [] } = useOccurrenceTypes();
  const { data: flags, isLoading: loadingFlags } = useOccurrenceFlags();
  const securityActions = flags?.securityActions ?? [];
  const aggravants = flags?.aggravatingSituations ?? [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      date: initialValues?.date ?? today,
      time: initialValues?.time ?? nowHhmm,
      occurrenceTypeId: initialValues?.occurrenceTypeId ?? "",
      unidadeId: initialValues?.unidadeId ?? "",
      setorId: initialValues?.setorId ?? "",
      attendedArea: initialValues?.attendedArea ?? "",
      city: initialValues?.city ?? "",
      latitude: initialValues?.latitude ?? "",
      longitude: initialValues?.longitude ?? "",
      occurrenceFamily: initialValues?.occurrenceFamily ?? "",
      report: initialValues?.report ?? "",
      classification: initialValues?.classification ?? "Negativa",
      severity: initialValues?.severity ?? "Moderada",
      status: initialValues?.status ?? undefined,
      type: initialValues?.type ?? undefined,
      eventCost: initialValues?.eventCost ?? "",
      currency: initialValues?.currency ?? "BRL",
      totalCost: initialValues?.totalCost ?? "",
      securityActionIds: initialValues?.securityActionIds ?? [],
      aggravatingSituationIds: initialValues?.aggravatingSituationIds ?? [],
    },
  });

  // ⬇️ quando initialValues mudar (ex.: após buscar a ocorrência), resetar o form
  useEffect(() => {
    if (!initialValues) return;
    reset({
      date: initialValues.date ?? today,
      time: initialValues.time ?? nowHhmm,
      occurrenceTypeId: initialValues.occurrenceTypeId ?? "",
      unidadeId: initialValues.unidadeId ?? "",
      setorId: initialValues.setorId ?? "",
      attendedArea: initialValues.attendedArea ?? "",
      city: initialValues.city ?? "",
      latitude: initialValues.latitude ?? "",
      longitude: initialValues.longitude ?? "",
      occurrenceFamily: initialValues.occurrenceFamily ?? "",
      report: initialValues.report ?? "",
      classification: initialValues.classification ?? "Negativa",
      severity: initialValues.severity ?? "Moderada",
      status: initialValues.status ?? undefined,
      type: initialValues.type ?? undefined,
      eventCost: initialValues.eventCost ?? "",
      currency: initialValues.currency ?? "BRL",
      totalCost: initialValues.totalCost ?? "",
      securityActionIds: initialValues.securityActionIds ?? [],
      aggravatingSituationIds: initialValues.aggravatingSituationIds ?? [],
    });
    // não zera fotos novas aqui
  }, [initialValues, reset, today, nowHhmm]);

  const unidadeId = watch("unidadeId");
  const unidadeIdNum = unidadeId ? Number(unidadeId) : undefined;
  const { data: setores = [], isLoading: loadingSetores } =
    useSetoresByUnidade(unidadeIdNum);

  // só limpa setor quando a unidade realmente muda
  const prevUnidadeIdRef = useRef<string | undefined>(unidadeId);
  const handleChangeUnidade = (v: string) => {
    const prev = prevUnidadeIdRef.current ?? "";
    prevUnidadeIdRef.current = v;
    setValue("unidadeId", v);
    if (v !== prev) setValue("setorId", "");
  };

  const [newPhotos64, setNewPhotos64] = useState<string[]>([]);
  const isBusy = !!submitting;

  const submitForm = (v: FormValues) => {
    onSubmit(v, { newPhotos64 });
  };

  const resetAll = () => {
    reset({
      date: today,
      time: nowHhmm,
      occurrenceTypeId: "",
      unidadeId: "",
      setorId: "",
      attendedArea: "",
      city: "",
      latitude: "",
      longitude: "",
      occurrenceFamily: "",
      report: "",
      classification: "Negativa",
      severity: "Moderada",
      status: undefined,
      type: undefined,
      eventCost: "",
      currency: "BRL",
      totalCost: "",
      securityActionIds: [],
      aggravatingSituationIds: [],
    });
    setNewPhotos64([]);
    onReset?.();
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-8">
      {/* Contexto */}
      <Section title="Contexto Operacional" subtitle="Unidade, setor e tipo">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Unidade *</Label>
            <Controller
              control={control}
              name="unidadeId"
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={handleChangeUnidade}
                  placeholder="Selecione uma unidade"
                >
                  {(unidades as Unidade[]).map((u) => (
                    <SelectItem key={String(u.id)} value={String(u.id)}>
                      {u.name}
                      {u.state ? ` (${u.state})` : ""}
                    </SelectItem>
                  ))}
                </FormSelect>
              )}
            />
            {errors.unidadeId && (
              <p className="text-sm text-destructive mt-1">
                {errors.unidadeId.message}
              </p>
            )}
          </div>

          <div>
            <Label>Setor *</Label>
            <Controller
              control={control}
              name="setorId"
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!unidadeIdNum || loadingSetores}
                  placeholder={
                    !unidadeIdNum
                      ? "Selecione a unidade"
                      : loadingSetores
                      ? "Carregando..."
                      : "Selecione"
                  }
                >
                  {(setores ?? []).map((s: any) => (
                    <SelectItem key={String(s.id)} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </FormSelect>
              )}
            />
            {errors.setorId && (
              <p className="text-sm text-destructive mt-1">
                {errors.setorId.message}
              </p>
            )}
          </div>

          <div>
            <Label>Tipo *</Label>
            <Controller
              control={control}
              name="occurrenceTypeId"
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Selecione o tipo"
                >
                  {(occurrenceTypes ?? []).map((t: any) => (
                    <SelectItem key={String(t.id)} value={String(t.id)}>
                      {t.name}
                    </SelectItem>
                  ))}
                </FormSelect>
              )}
            />
            {errors.occurrenceTypeId && (
              <p className="text-sm text-destructive mt-1">
                {errors.occurrenceTypeId.message}
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* Detalhes */}
      <Section
        title="Detalhes do Evento"
        subtitle="Data, hora e classificações"
      >
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label>Data *</Label>
            <Input
              type="date"
              className="h-11 rounded-xl bg-white border border-input-border"
              {...register("date", { required: "Campo obrigatório" })}
            />
            {errors.date && (
              <p className="text-sm text-destructive mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          <div>
            <Label>Hora *</Label>
            <Input
              type="time"
              step={1}
              className="h-11 rounded-xl bg-white border border-input-border"
              {...register("time", { required: "Campo obrigatório" })}
            />
            {errors.time && (
              <p className="text-sm text-destructive mt-1">
                {errors.time.message}
              </p>
            )}
          </div>

          <div>
            <Label>Classificação *</Label>
            <Controller
              control={control}
              name="classification"
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Selecione"
                >
                  <SelectItem value="Negativa">Negativa</SelectItem>
                  <SelectItem value="Positiva">Positiva</SelectItem>
                </FormSelect>
              )}
            />
          </div>

          <div>
            <Label>Severidade *</Label>
            <Controller
              control={control}
              name="severity"
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <FormSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Selecione"
                >
                  <SelectItem value="Grave">Grave</SelectItem>
                  <SelectItem value="Moderada">Moderada</SelectItem>
                  <SelectItem value="Leve">Leve</SelectItem>
                </FormSelect>
              )}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <FormSelect
                  value={field.value ?? ""}
                  onValueChange={(v) => field.onChange(v || undefined)}
                  placeholder="Selecione"
                >
                  <SelectItem value="Aberto">Aberto</SelectItem>
                  <SelectItem value="Em_analise">Em análise</SelectItem>
                  <SelectItem value="Em_andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluido">Concluído</SelectItem>
                </FormSelect>
              )}
            />
          </div>

          <div>
            <Label>Modelo</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <FormSelect
                  value={field.value ?? ""}
                  onValueChange={(v) => field.onChange((v || undefined) as any)}
                  placeholder="Selecione"
                >
                  <SelectItem value="AVU">AVU</SelectItem>
                  <SelectItem value="BRO">BRO</SelectItem>
                </FormSelect>
              )}
            />
          </div>
        </div>
      </Section>

      {/* Localização */}
      <Section title="Localização e Contexto">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Área Atendida</Label>
            <Input
              placeholder="Ex.: Portaria"
              className="h-11 rounded-xl bg-white border border-input-border"
              {...register("attendedArea")}
            />
          </div>
          <div>
            <Label>Cidade</Label>
            <Input
              placeholder="Ex.: Salvador/BA"
              className="h-11 rounded-xl bg-white border border-input-border"
              {...register("city")}
            />
          </div>
          <div>
            <Label>Família</Label>
            <Controller
              control={control}
              name="occurrenceFamily"
              render={({ field }) => (
                <FormSelect
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  placeholder="Selecione"
                >
                  {["Ocorrencia", "Vulnerabilidade"].map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </FormSelect>
              )}
            />
          </div>
          <div>
            <Label>Latitude</Label>
            <Input
              type="number"
              step="0.00000001"
              inputMode="decimal"
              placeholder="-12.3456789"
              className="h-11 rounded-xl bg-white border border-input-border"
              {...register("latitude")}
            />
          </div>
          <div>
            <Label>Longitude</Label>
            <Input
              type="number"
              step="0.00000001"
              inputMode="decimal"
              placeholder="-45.6789123"
              className="h-11 rounded-xl bg-white border border-input-border"
              {...register("longitude")}
            />
          </div>
        </div>
      </Section>

      {/* Relato */}
      <Section title="Relato">
        <Label>Descrição da Ocorrência *</Label>
        <Textarea
          rows={5}
          placeholder="Descreva em detalhes..."
          className="min-h-[120px] rounded-xl bg-white border border-input-border"
          {...register("report", { required: "Campo obrigatório" })}
        />
        {errors.report && (
          <p className="text-sm text-destructive mt-1">
            {errors.report.message}
          </p>
        )}
      </Section>

      {/* Custos */}
      <Section title="Custos">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label>Custo do Evento</Label>
            <Input
              type="number"
              step="0.01"
              inputMode="decimal"
              className="h-11 rounded-xl bg-white border border-input-border"
              {...register("eventCost")}
            />
          </div>
          <div>
            <Label>Moeda</Label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <FormSelect
                  value={field.value ?? "BRL"}
                  onValueChange={(v) => field.onChange((v || "BRL") as any)}
                  placeholder="Selecione"
                >
                  <SelectItem value="BRL">BRL</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </FormSelect>
              )}
            />
          </div>
          <div>
            <Label>Custo Total</Label>
            <Input
              type="number"
              step="0.01"
              inputMode="decimal"
              className="h-11 rounded-xl bg-white border border-input-border"
              {...register("totalCost")}
            />
          </div>
        </div>
      </Section>

      {/* Ações e Agravantes */}
      <Section title="Ações e Agravantes">
        <div className="grid gap-6 md:grid-cols-2">
          <Controller
            control={control}
            name="securityActionIds"
            rules={{
              validate: (v) =>
                (v?.length ?? 0) > 0 || "Selecione ao menos 1 ação",
            }}
            render={({ field, fieldState }) => (
              <FlagsChecklist
                items={securityActions}
                value={field.value ?? []}
                onChange={field.onChange}
                loading={loadingFlags}
                requiredMessage={fieldState.error?.message}
                label="Ações de Segurança *"
              />
            )}
          />

          <Controller
            control={control}
            name="aggravatingSituationIds"
            rules={{
              validate: (v) =>
                (v?.length ?? 0) > 0 || "Selecione ao menos 1 agravante",
            }}
            render={({ field, fieldState }) => (
              <FlagsChecklist
                items={aggravants}
                value={field.value ?? []}
                onChange={field.onChange}
                loading={loadingFlags}
                requiredMessage={fieldState.error?.message}
                label="Agravantes *"
              />
            )}
          />
        </div>
      </Section>

      {/* Anexos */}
      <Section
        title="Anexos"
        subtitle={
          mode === "edit"
            ? "Você pode adicionar novas fotos"
            : "Adicione fotos (PNG/JPG)"
        }
      >
        <PhotoUploader
          files64={newPhotos64}
          onAdd={(arr) => setNewPhotos64((p) => [...p, ...arr])}
          onRemove={(i) =>
            setNewPhotos64((p) => p.filter((_, idx) => idx !== i))
          }
          disabled={isBusy}
        />

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={resetAll}
            disabled={isBusy}
            className="h-11 rounded-xl"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          <Button
            type="submit"
            disabled={isBusy}
            className="h-11 rounded-xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:opacity-95 text-white px-6 shadow-md"
          >
            {isBusy ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {mode === "edit" ? "Salvando..." : "Registrando..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {mode === "edit" ? "Salvar alterações" : "Registrar Ocorrência"}
              </>
            )}
          </Button>
        </div>
      </Section>
    </form>
  );
}
