import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Upload,
  X,
  AlertTriangle,
  Calendar,
  FileText,
  DollarSign,
  Building,
  Camera,
  CheckCircle,
  Loader2,
  Save,
  RefreshCw,
} from "lucide-react";
import { useCreateOccurrence } from "@/hooks/useCreateOccurrence";
import { useUnidades } from "@/hooks/useUnidades";
import { useSetoresByUnidade } from "@/hooks/useSetores";
import { useOccurrenceTypes } from "@/hooks/useOccurrenceTypes";
import { useOccurrenceFlags } from "@/hooks/useOccurrenceFlags";
import type { Unidade } from "@/types/unidade";
import {
  Classification,
  Currency,
  OccurrenceType,
  Severity,
  Status,
} from "@/types/types";

type FormValues = {
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
  classification: keyof typeof Classification;
  severity: keyof typeof Severity;
  status?: keyof typeof Status;
  type?: keyof typeof OccurrenceType;
  eventCost?: string;
  currency?: keyof typeof Currency;
  totalCost?: string;
  securityActionIds: number[];
  aggravatingSituationIds: number[];
};

const toBase64 = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(f);
  });

export default function NovaOcorrencia() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const nowHhmm = new Date().toTimeString().slice(0, 5);

  const [photos, setPhotos] = useState<File[]>([]);
  const [photos64, setPhotos64] = useState<string[]>([]);

  const { data: unidades = [] } = useUnidades();
  const { data: occurrenceTypes = [] } = useOccurrenceTypes();
  const { data: flags, isLoading: loadingFlags } = useOccurrenceFlags();
  const securityActions = flags?.securityActions ?? [];
  const aggravants = flags?.aggravatingSituations ?? [];

  const GRADIENT_HEADER =
    "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600";

  const defaults: FormValues = useMemo(
    () => ({
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
    }),
    [today, nowHhmm]
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: defaults });

  const unidadeId = watch("unidadeId");
  const unidadeIdNum = unidadeId ? Number(unidadeId) : undefined;

  const { data: setores = [], isLoading: loadingSetores } =
    useSetoresByUnidade(unidadeIdNum);

  useEffect(() => {
    setValue("setorId", "");
  }, [unidadeIdNum, setValue]);

  const { mutate: createOccurrence, isPending } = useCreateOccurrence(() => {
    reset(defaults);
    setPhotos([]);
    setPhotos64([]);
    navigate("/home");
  });
  const isBusy = isPending || isSubmitting;

  const onSelectImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgs = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith("image/")
    );
    setPhotos((p) => [...p, ...imgs]);
    Promise.all(imgs.map(toBase64)).then((base64Imgs) =>
      setPhotos64((p) => [...p, ...base64Imgs])
    );
  };

  const removeImage = (i: number) => {
    setPhotos((p) => p.filter((_, x) => x !== i));
    setPhotos64((p) => p.filter((_, x) => x !== i));
  };

  const onSubmit = (v: FormValues) =>
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
      occurrencePhotos: photos64.length ? photos64 : undefined,
      securityActionIds: v.securityActionIds,
      aggravatingSituationIds: v.aggravatingSituationIds,
    } as any);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 1. Contexto Operacional */}
          <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <div className={`${GRADIENT_HEADER} p-6`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Contexto Operacional
                  </h3>
                  <p className="text-white/80 text-sm">
                    Defina a unidade, setor e tipo de ocorrência
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Unidade */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Unidade <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="unidadeId"
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl">
                          <SelectValue placeholder="Selecione uma unidade" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-50">
                          {(unidades as Unidade[]).map((u) => (
                            <SelectItem
                              key={String(u.id)}
                              value={String(u.id)}
                              className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                            >
                              {u.name}
                              {u.state ? ` (${u.state})` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.unidadeId && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.unidadeId.message}
                    </p>
                  )}
                </div>

                {/* Setor */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Setor <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="setorId"
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!unidadeIdNum || loadingSetores}
                      >
                        <SelectTrigger className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl disabled:opacity-50">
                          <SelectValue
                            placeholder={
                              !unidadeIdNum
                                ? "Selecione a unidade primeiro"
                                : loadingSetores
                                ? "Carregando..."
                                : "Selecione um setor"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-50">
                          {(setores ?? []).map((s: any) => (
                            <SelectItem
                              key={String(s.id)}
                              value={String(s.id)}
                              className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                            >
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.setorId && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.setorId.message}
                    </p>
                  )}
                </div>

                {/* Tipo de Ocorrência */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Tipo de Ocorrência{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="occurrenceTypeId"
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-50">
                          {(occurrenceTypes ?? []).map((t: any) => (
                            <SelectItem
                              key={String(t.id)}
                              value={String(t.id)}
                              className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                            >
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.occurrenceTypeId && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.occurrenceTypeId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Detalhes do Evento */}
          <section className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className={`${GRADIENT_HEADER} p-6`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Detalhes do Evento
                  </h3>
                  <p className="text-white/80 text-sm">
                    Data, hora e classificações da ocorrência
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid gap-6 lg:grid-cols-4">
                {/* Data */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Data <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date"
                    className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl"
                    {...register("date", { required: "Campo obrigatório" })}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                {/* Hora */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Hora <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="time"
                    step={1}
                    className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl"
                    {...register("time", { required: "Campo obrigatório" })}
                  />
                  {errors.time && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.time.message}
                    </p>
                  )}
                </div>

                {/* Classificação (usar os nomes das chaves) */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Classificação <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="classification"
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-50">
                          <SelectItem
                            value="Negativa"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            Negativa
                          </SelectItem>
                          <SelectItem
                            value="Positiva"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            Positiva
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.classification && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.classification.message}
                    </p>
                  )}
                </div>

                {/* Severidade */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Severidade <span className="text-destructive">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="severity"
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-50">
                          <SelectItem
                            value="Grave"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full bg-red-600" />
                              Grave
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="Moderada"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full bg-amber-500" />
                              Moderada
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="Leve"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span className="h-3 w-3 rounded-full bg-green-600" />
                              Leve
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.severity && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.severity.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Status
                  </Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(v) => field.onChange(v || undefined)}
                      >
                        <SelectTrigger className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-50">
                          <SelectItem
                            value="Aberto"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            Aberto
                          </SelectItem>
                          <SelectItem
                            value="Em_analise"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            Em análise
                          </SelectItem>
                          <SelectItem
                            value="Em_andamento"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            Em andamento
                          </SelectItem>
                          <SelectItem
                            value="Concluido"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            Concluído
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Modelo */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Modelo
                  </Label>
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(v) =>
                          field.onChange((v || undefined) as any)
                        }
                      >
                        <SelectTrigger className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-50">
                          <SelectItem
                            value="AVU"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            AVU
                          </SelectItem>
                          <SelectItem
                            value="BRO"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            BRO
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Localização e Contexto */}
          <section className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className={`${GRADIENT_HEADER} p-6`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Localização e Contexto
                  </h3>
                  <p className="text-white/80 text-sm">
                    Informações geográficas e contextuais
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Área Atendida
                  </Label>
                  <Input
                    placeholder="Ex.: Portaria, Almoxarifado…"
                    className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl"
                    {...register("attendedArea")}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Cidade
                  </Label>
                  <Input
                    placeholder="Ex.: Salvador/BA"
                    className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl"
                    {...register("city")}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Família
                  </Label>
                  <Controller
                    control={control}
                    name="occurrenceFamily"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl">
                          <SelectValue placeholder="Selecione a família" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-50">
                          {["Ocorrencia", "Vulnerabilidade"].map((opt) => (
                            <SelectItem
                              key={opt}
                              value={opt}
                              className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                            >
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Latitude
                  </Label>
                  <Input
                    type="number"
                    step="0.00000001"
                    inputMode="decimal"
                    placeholder="-12.3456789"
                    className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl"
                    {...register("latitude")}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Longitude
                  </Label>
                  <Input
                    type="number"
                    step="0.00000001"
                    inputMode="decimal"
                    placeholder="-45.6789123"
                    className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl"
                    {...register("longitude")}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 4. Relato */}
          <section className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className={`${GRADIENT_HEADER} p-6`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Relato</h3>
                  <p className="text-white/80 text-sm">
                    Descrição detalhada da ocorrência
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  Descrição da Ocorrência{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  rows={6}
                  className="min-h-[150px] bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl resize-none"
                  placeholder="Descreva em detalhes o que aconteceu, quem esteve envolvido, evidências encontradas, ações tomadas..."
                  {...register("report", { required: "Campo obrigatório" })}
                />
                {errors.report && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.report.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 5. Custos */}
          <section className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className={`${GRADIENT_HEADER} p-6`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Custos</h3>
                  <p className="text-white/80 text-sm">
                    Informações financeiras relacionadas à ocorrência
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Custo do Evento
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0,00"
                    className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl"
                    {...register("eventCost")}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Moeda
                  </Label>
                  <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? "BRL"}
                        onValueChange={(v) =>
                          field.onChange((v || "BRL") as any)
                        }
                      >
                        <SelectTrigger className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl">
                          <SelectValue placeholder="Selecione a moeda" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg z-50">
                          <SelectItem
                            value="BRL"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            BRL
                          </SelectItem>
                          <SelectItem
                            value="USD"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            USD
                          </SelectItem>
                          <SelectItem
                            value="EUR"
                            className="focus:bg-accent focus:text-accent-foreground rounded-lg"
                          >
                            EUR
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Custo Total
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0,00"
                    className="h-12 bg-input border-input-border focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl"
                    {...register("totalCost")}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 6. Ações e Agravantes */}
          <section className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className={`${GRADIENT_HEADER} p-6`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Ações e Agravantes
                  </h3>
                  <p className="text-white/80 text-sm">
                    Selecione as ações de segurança e situações agravantes
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Security Actions */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Ações de Segurança{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  {loadingFlags ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">
                        Carregando ações...
                      </span>
                    </div>
                  ) : securityActions.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      Nenhuma ação cadastrada.
                    </p>
                  ) : (
                    <Controller
                      control={control}
                      name="securityActionIds"
                      rules={{
                        validate: (v) =>
                          (v?.length ?? 0) > 0 || "Selecione ao menos 1 ação",
                      }}
                      render={({ field }) => (
                        <div className="space-y-3">
                          {securityActions.map((s: any) => {
                            const checked = field.value?.includes(s.id);
                            return (
                              <div
                                key={s.id}
                                onClick={() =>
                                  checked
                                    ? field.onChange(
                                        (field.value ?? []).filter(
                                          (id: number) => id !== s.id
                                        )
                                      )
                                    : field.onChange([
                                        ...(field.value ?? []),
                                        s.id,
                                      ])
                                }
                                className={`group cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                                  checked
                                    ? "border-primary bg-accent/50 shadow-sm"
                                    : "border-border bg-transparent hover:border-primary/50 hover:bg-accent/20"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                                      checked
                                        ? "border-primary bg-primary"
                                        : "border-muted-foreground group-hover:border-primary"
                                    }`}
                                  >
                                    {checked && (
                                      <CheckCircle className="h-3 w-3 text-primary-foreground" />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium text-foreground">
                                    {s.name}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  )}
                  {errors.securityActionIds && (
                    <p className="text-sm text-destructive mt-2">
                      {String(errors.securityActionIds.message)}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                    Agravantes <span className="text-destructive">*</span>
                  </Label>
                  {loadingFlags ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">
                        Carregando agravantes...
                      </span>
                    </div>
                  ) : aggravants.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">
                      Nenhum agravante cadastrado.
                    </p>
                  ) : (
                    <Controller
                      control={control}
                      name="aggravatingSituationIds"
                      rules={{
                        validate: (v) =>
                          (v?.length ?? 0) > 0 ||
                          "Selecione ao menos 1 agravante",
                      }}
                      render={({ field }) => (
                        <div className="space-y-3">
                          {aggravants.map((g: any) => {
                            const checked = field.value?.includes(g.id);
                            return (
                              <div
                                key={g.id}
                                onClick={() =>
                                  checked
                                    ? field.onChange(
                                        (field.value ?? []).filter(
                                          (id: number) => id !== g.id
                                        )
                                      )
                                    : field.onChange([
                                        ...(field.value ?? []),
                                        g.id,
                                      ])
                                }
                                className={`group cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                                  checked
                                    ? "border-primary bg-accent/50 shadow-sm"
                                    : "border-border bg-transparent hover:border-primary/50 hover:bg-accent/20"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                                      checked
                                        ? "border-primary bg-primary"
                                        : "border-muted-foreground group-hover:border-primary"
                                    }`}
                                  >
                                    {checked && (
                                      <CheckCircle className="h-3 w-3 text-primary-foreground" />
                                    )}
                                  </div>
                                  <span className="text-sm font-medium text-foreground">
                                    {g.name}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  )}
                  {errors.aggravatingSituationIds && (
                    <p className="text-sm text-destructive mt-2">
                      {String(errors.aggravatingSituationIds.message)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 7. Anexos */}
          <section className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className={`${GRADIENT_HEADER} p-6`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Anexos</h3>
                  <p className="text-white/80 text-sm">
                    Adicione fotos e documentos relacionados
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={onSelectImages}
                className="hidden"
                disabled={isBusy}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer group block rounded-2xl border-2 border-dashed border-border p-8 text-center transition-all duration-200 hover:border-primary hover:bg-accent/20"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent group-hover:bg-primary/10 transition-colors duration-200">
                    <Upload className="h-8 w-8 text-accent-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Clique para adicionar imagens
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Formatos aceitos: PNG, JPG (máximo 10MB por arquivo)
                    </p>
                  </div>
                </div>
              </label>

              {photos.length > 0 && (
                <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {photos.map((f, i) => (
                    <div
                      key={`${f.name}-${i}`}
                      className="group relative overflow-hidden rounded-xl border border-border bg-accent/20"
                    >
                      <img
                        src={URL.createObjectURL(f)}
                        alt=""
                        className="w-full aspect-video object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 rounded-full bg-destructive/90 p-1.5 text-destructive-foreground shadow-sm hover:bg-destructive transition-all duration-200 opacity-0 group-hover:opacity-100"
                        aria-label="Remover imagem"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="p-3 bg-white/90 backdrop-blur-sm">
                        <p className="truncate text-xs font-medium text-foreground">
                          {f.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {(f.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-t-2xl">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset(defaults)}
                  disabled={isBusy}
                  className="px-8 py-3 rounded-xl border-border hover:bg-accent"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isBusy}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:opacity-90 transition-opacity duration-200"
                >
                  {isBusy ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Registrar Ocorrência
                    </>
                  )}
                </Button>
              </div>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}
