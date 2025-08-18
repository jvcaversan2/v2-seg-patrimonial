// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useForm, Controller } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   MapPin,
//   Upload,
//   X,
//   AlertTriangle,
//   Calendar,
//   FileText,
//   DollarSign,
//   Building,
//   Camera,
//   CheckCircle,
//   Loader2,
//   Save,
//   RefreshCw,
//   Pencil,
// } from "lucide-react";

// import { useUnidades } from "@/hooks/useUnidades";
// import { useSetoresByUnidade } from "@/hooks/useSetores";
// import { useOccurrenceTypes } from "@/hooks/useOccurrenceTypes";
// import { useOccurrenceFlags } from "@/hooks/useOccurrenceFlags";
// import { useOccurrenceById } from "@/hooks/useOccorrencyById";
// import { useUpdateOccurrence } from "@/hooks/useUpdateOccurrence";

// import type { Unidade } from "@/types/unidade";
// import {
//   Classification,
//   Currency,
//   OccurrenceType,
//   Severity,
//   Status,
// } from "@/types/types";

// type FormValues = {
//   date: string;
//   time: string;
//   occurrenceTypeId: string;
//   unidadeId: string;
//   setorId: string;
//   attendedArea?: string;
//   city?: string;
//   latitude?: string;
//   longitude?: string;
//   occurrenceFamily?: string;
//   report: string;
//   classification: keyof typeof Classification;
//   severity: keyof typeof Severity;
//   status?: keyof typeof Status;
//   type?: keyof typeof OccurrenceType;
//   eventCost?: string;
//   currency?: keyof typeof Currency;
//   totalCost?: string;
//   securityActionIds: number[];
//   aggravatingSituationIds: number[];
// };

// type ExistingPhoto = {
//   id: number;
//   url: string;
// };

// const toBase64 = (f: File) =>
//   new Promise<string>((res, rej) => {
//     const r = new FileReader();
//     r.onload = () => res(String(r.result));
//     r.onerror = rej;
//     r.readAsDataURL(f);
//   });

// export default function EditarOcorrencia() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const { data: occurrence, isLoading } = useOccurrenceById(id);
//   const { data: unidades = [] } = useUnidades();
//   const { data: occurrenceTypes = [] } = useOccurrenceTypes();
//   const { data: flags, isLoading: loadingFlags } = useOccurrenceFlags();
//   const securityActions = flags?.securityActions ?? [];
//   const aggravants = flags?.aggravatingSituations ?? [];

//   const GRADIENT_HEADER =
//     "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600";

//   // ---------- estado de edição / fotos ----------
//   const [isEditing, setIsEditing] = React.useState(false);

//   // fotos já existentes (vindas do backend)
//   const [existingPhotos, setExistingPhotos] = React.useState<ExistingPhoto[]>(
//     []
//   );
//   const [removedPhotoIds, setRemovedPhotoIds] = React.useState<number[]>([]);

//   // novas fotos (cliente)
//   const [newPhotos, setNewPhotos] = React.useState<File[]>([]);
//   const [newPhotos64, setNewPhotos64] = React.useState<string[]>([]);

//   // ---------- form ----------
//   const {
//     register,
//     handleSubmit,
//     control,
//     watch,
//     reset,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<FormValues>({
//     defaultValues: {
//       date: "",
//       time: "",
//       occurrenceTypeId: "",
//       unidadeId: "",
//       setorId: "",
//       attendedArea: "",
//       city: "",
//       latitude: "",
//       longitude: "",
//       occurrenceFamily: "",
//       report: "",
//       classification: "Negativa",
//       severity: "Moderada",
//       status: undefined,
//       type: undefined,
//       eventCost: "",
//       currency: "BRL",
//       totalCost: "",
//       securityActionIds: [],
//       aggravatingSituationIds: [],
//     },
//   });

//   // Unidade/setor
//   const unidadeId = watch("unidadeId");
//   const unidadeIdNum = unidadeId ? Number(unidadeId) : undefined;
//   const { data: setores = [], isLoading: loadingSetores } =
//     useSetoresByUnidade(unidadeIdNum);

//   React.useEffect(() => {
//     if (!isLoading && occurrence) {
//       // Derivar unidade: backend pode fornecer direto ou via setor.unidadeId
//       const initialUnidadeId =
//         (occurrence as any).unidadeId ??
//         (occurrence as any)?.setor?.unidadeId ??
//         "";

//       // Date/Time em string
//       const dateISO = new Date(occurrence.date).toISOString().slice(0, 10);
//       const timeISO = (() => {
//         const t = occurrence.time ? new Date(occurrence.time) : new Date();
//         // garante HH:mm[:ss] conforme seu create
//         const hh = String(t.getHours()).padStart(2, "0");
//         const mm = String(t.getMinutes()).padStart(2, "0");
//         const ss = String(t.getSeconds()).padStart(2, "0");
//         return `${hh}:${mm}:${ss}`;
//       })();

//       // fotos existentes
//       const raw = (occurrence as any)?.occurrencePhoto ?? [];
//       const mapped: ExistingPhoto[] = Array.isArray(raw)
//         ? raw
//             .map((p: any) => {
//               const id = Number(p?.id);
//               const v: string = p?.filePath || p?.path || p?.url || "";
//               return id && v ? { id, url: v } : null;
//             })
//             .filter(Boolean)
//         : [];
//       setExistingPhotos(mapped);
//       setRemovedPhotoIds([]);
//       setNewPhotos([]);
//       setNewPhotos64([]);

//       // flags selecionadas
//       const selectedSecIds: number[] = (occurrence as any)?.securityActions?.map(
//         (s: any) => s.securityActionId ?? s.id
//       ) ?? [];
//       const selectedAggIds: number[] =
//         (occurrence as any)?.aggravatingSituations?.map(
//           (g: any) => g.aggravatingSituationId ?? g.id
//         ) ?? [];

//       reset({
//         date: dateISO,
//         time: timeISO,
//         occurrenceTypeId: String(occurrence.occurrenceTypeId ?? ""),
//         unidadeId: String(initialUnidadeId ?? ""),
//         setorId: String(occurrence.setorId ?? ""),
//         attendedArea: occurrence.attendedArea ?? "",
//         city: occurrence.city ?? "",
//         latitude:
//           occurrence.latitude != null ? String(occurrence.latitude) : "",
//         longitude:
//           occurrence.longitude != null ? String(occurrence.longitude) : "",
//         occurrenceFamily: occurrence.occurrenceFamily ?? "",
//         report: occurrence.report ?? "",
//         classification: occurrence.classification ?? "Negativa",
//         severity: occurrence.severity ?? "Moderada",
//         status: occurrence.status ?? undefined,
//         type: occurrence.type ?? undefined,
//         eventCost:
//           occurrence.eventCost != null ? String(occurrence.eventCost) : "",
//         currency: occurrence.currency ?? "BRL",
//         totalCost:
//           occurrence.totalCost != null ? String(occurrence.totalCost) : "",
//         securityActionIds: selectedSecIds,
//         aggravatingSituationIds: selectedAggIds,
//       });

//       // Ao carregar, fica bloqueado (somente leitura)
//       setIsEditing(false);
//     }
//   }, [isLoading, occurrence, reset]);

//   // Limpar setor quando trocar unidade (igual ao seu create)
//   React.useEffect(() => {
//     setValue("setorId", "");
//   }, [unidadeIdNum, setValue]);

//   const { mutate: updateOccurrence, isPending } = useUpdateOccurrence(Number(id));

//   const isBusy = isPending || isSubmitting;

//   // ---------- handlers de fotos ----------
//   const onSelectImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const imgs = Array.from(e.target.files ?? []).filter((f) =>
//       f.type.startsWith("image/")
//     );
//     setNewPhotos((p) => [...p, ...imgs]);
//     const base64s = await Promise.all(imgs.map(toBase64));
//     setNewPhotos64((p) => [...p, ...base64s]);
//   };

//   const removeExistingPhoto = (photoId: number) => {
//     setExistingPhotos((arr) => arr.filter((p) => p.id !== photoId));
//     setRemovedPhotoIds((arr) => Array.from(new Set([...arr, photoId])));
//   };

//   const removeNewPhoto = (i: number) => {
//     setNewPhotos((p) => p.filter((_, x) => x !== i));
//     setNewPhotos64((p) => p.filter((_, x) => x !== i));
//   };

//   // ---------- submit ----------
//   const onSubmit = (v: FormValues) => {
//     if (!id) return;

//     updateOccurrence({
//       id: Number(id),
//       date: v.date,
//       time: v.time,
//       occurrenceTypeId: Number(v.occurrenceTypeId),
//       setorId: Number(v.setorId),
//       attendedArea: v.attendedArea || undefined,
//       city: v.city || undefined,
//       latitude: v.latitude ? Number(v.latitude) : undefined,
//       longitude: v.longitude ? Number(v.longitude) : undefined,
//       occurrenceFamily: v.occurrenceFamily || undefined,
//       report: v.report,
//       classification: v.classification,
//       severity: v.severity,
//       status: v.status || undefined,
//       type: v.type || undefined,
//       eventCost: v.eventCost ? Number(v.eventCost) : undefined,
//       currency: v.currency || undefined,
//       totalCost: v.totalCost ? Number(v.totalCost) : undefined,

//       // Fotos
//       addOccurrencePhotos: newPhotos64.length ? newPhotos64 : undefined,
//       removeOccurrencePhotoIds:
//         removedPhotoIds.length ? removedPhotoIds : undefined,

//       // Flags
//       securityActionIds: v.securityActionIds,
//       aggravatingSituationIds: v.aggravatingSituationIds,
//     } as any);
//   };

//   const toggleEdit = () => setIsEditing((s) => !s);

//   const cancelEdit = () => {
//     // restaura valores originais carregados
//     if (occurrence) {
//       setIsEditing(false);
//       // dispara novamente o efeito de reset “manual”:
//       const evt = new Event("refresh");
//       window.dispatchEvent(evt);
//       // ou simplesmente força reset chamando nosso effect reutilizando occurrence atual:
//       const dateISO = new Date(occurrence.date).toISOString().slice(0, 10);
//       const t = occurrence.time ? new Date(occurrence.time) : new Date();
//       const hh = String(t.getHours()).padStart(2, "0");
//       const mm = String(t.getMinutes()).padStart(2, "0");
//       const ss = String(t.getSeconds()).padStart(2, "0");
//       const timeISO = `${hh}:${mm}:${ss}`;

//       const initialUnidadeId =
//         (occurrence as any).unidadeId ??
//         (occurrence as any)?.setor?.unidadeId ??
//         "";

//       const raw = (occurrence as any)?.occurrencePhoto ?? [];
//       const mapped: ExistingPhoto[] = Array.isArray(raw)
//         ? raw
//             .map((p: any) => {
//               const pid = Number(p?.id);
//               const v: string = p?.filePath || p?.path || p?.url || "";
//               return pid && v ? { id: pid, url: v } : null;
//             })
//             .filter(Boolean)
//         : [];
//       setExistingPhotos(mapped);
//       setRemovedPhotoIds([]);
//       setNewPhotos([]);
//       setNewPhotos64([]);

//       const selectedSecIds: number[] = (occurrence as any)?.securityActions?.map(
//         (s: any) => s.securityActionId ?? s.id
//       ) ?? [];
//       const selectedAggIds: number[] =
//         (occurrence as any)?.aggravatingSituations?.map(
//           (g: any) => g.aggravatingSituationId ?? g.id
//         ) ?? [];

//       reset({
//         date: dateISO,
//         time: timeISO,
//         occurrenceTypeId: String(occurrence.occurrenceTypeId ?? ""),
//         unidadeId: String(initialUnidadeId ?? ""),
//         setorId: String(occurrence.setorId ?? ""),
//         attendedArea: occurrence.attendedArea ?? "",
//         city: occurrence.city ?? "",
//         latitude:
//           occurrence.latitude != null ? String(occurrence.latitude) : "",
//         longitude:
//           occurrence.longitude != null ? String(occurrence.longitude) : "",
//         occurrenceFamily: occurrence.occurrenceFamily ?? "",
//         report: occurrence.report ?? "",
//         classification: occurrence.classification ?? "Negativa",
//         severity: occurrence.severity ?? "Moderada",
//         status: occurrence.status ?? undefined,
//         type: occurrence.type ?? undefined,
//         eventCost:
//           occurrence.eventCost != null ? String(occurrence.eventCost) : "",
//         currency: occurrence.currency ?? "BRL",
//         totalCost:
//           occurrence.totalCost != null ? String(occurrence.totalCost) : "",
//         securityActionIds: selectedSecIds,
//         aggravatingSituationIds: selectedAggIds,
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-24">
//         <Loader2 className="h-6 w-6 animate-spin mr-2" />
//         Carregando ocorrência...
//       </div>
//     );
//   }

//   if (!occurrence) {
//     return <div className="p-8">Ocorrência não encontrada.</div>;
//   }

//   return (
//     <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100">
//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {/* Barra de ação superior */}
//         <div className="mb-6 flex items-center justify-between">
//           <h2 className="text-xl font-semibold">
//             Ocorrência #{String(occurrence.id)}
//           </h2>
//           <div className="flex gap-3">
//             {!isEditing ? (
//               <Button onClick={toggleEdit} className="rounded-xl">
//                 <Pencil className="h-4 w-4 mr-2" />
//                 Editar
//               </Button>
//             ) : (
//               <>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={cancelEdit}
//                   disabled={isBusy}
//                   className="rounded-xl"
//                 >
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                   Cancelar
//                 </Button>
//                 <Button
//                   form="edit-occurrence-form"
//                   type="submit"
//                   disabled={isBusy}
//                   className="rounded-xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:opacity-90"
//                 >
//                   {isBusy ? (
//                     <>
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                       Salvando...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="h-4 w-4 mr-2" />
//                       Salvar alterações
//                     </>
//                   )}
//                 </Button>
//               </>
//             )}
//           </div>
//         </div>

//         <form
//           id="edit-occurrence-form"
//           onSubmit={handleSubmit(onSubmit)}
//           className="space-y-8"
//         >
//           {/* 1. Contexto Operacional */}
//           <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
//             <div className={`${GRADIENT_HEADER} p-6`}>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
//                   <Building className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">
//                     Contexto Operacional
//                   </h3>
//                   <p className="text-white/80 text-sm">
//                     Unidade, setor e tipo de ocorrência
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-8">
//               <div className="grid gap-6 lg:grid-cols-3">
//                 {/* Unidade */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">
//                     Unidade <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     control={control}
//                     name="unidadeId"
//                     rules={{ required: "Campo obrigatório" }}
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                         disabled={!isEditing}
//                       >
//                         <SelectTrigger className="h-12 rounded-xl">
//                           <SelectValue placeholder="Selecione uma unidade" />
//                         </SelectTrigger>
//                         <SelectContent className="rounded-xl">
//                           {(unidades as Unidade[]).map((u) => (
//                             <SelectItem
//                               key={String(u.id)}
//                               value={String(u.id)}
//                               className="rounded-lg"
//                             >
//                               {u.name}
//                               {u.state ? ` (${u.state})` : ""}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.unidadeId && (
//                     <p className="text-sm text-destructive mt-1">
//                       {errors.unidadeId.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Setor */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">
//                     Setor <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     control={control}
//                     name="setorId"
//                     rules={{ required: "Campo obrigatório" }}
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                         disabled={!isEditing || !unidadeIdNum || loadingSetores}
//                       >
//                         <SelectTrigger className="h-12 rounded-xl">
//                           <SelectValue
//                             placeholder={
//                               !unidadeIdNum
//                                 ? "Selecione a unidade primeiro"
//                                 : loadingSetores
//                                 ? "Carregando..."
//                                 : "Selecione um setor"
//                             }
//                           />
//                         </SelectTrigger>
//                         <SelectContent className="rounded-xl">
//                           {(setores ?? []).map((s: any) => (
//                             <SelectItem
//                               key={String(s.id)}
//                               value={String(s.id)}
//                               className="rounded-lg"
//                             >
//                               {s.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.setorId && (
//                     <p className="text-sm text-destructive mt-1">
//                       {errors.setorId.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Tipo de Ocorrência */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">
//                     Tipo de Ocorrência <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     control={control}
//                     name="occurrenceTypeId"
//                     rules={{ required: "Campo obrigatório" }}
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                         disabled={!isEditing}
//                       >
//                         <SelectTrigger className="h-12 rounded-xl">
//                           <SelectValue placeholder="Selecione o tipo" />
//                         </SelectTrigger>
//                         <SelectContent className="rounded-xl">
//                           {(occurrenceTypes ?? []).map((t: any) => (
//                             <SelectItem
//                               key={String(t.id)}
//                               value={String(t.id)}
//                               className="rounded-lg"
//                             >
//                               {t.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.occurrenceTypeId && (
//                     <p className="text-sm text-destructive mt-1">
//                       {errors.occurrenceTypeId.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* 2. Detalhes do Evento */}
//           <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <div className={`${GRADIENT_HEADER} p-6`}>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
//                   <Calendar className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">
//                     Detalhes do Evento
//                   </h3>
//                 </div>
//               </div>
//             </div>

//             <div className="p-8">
//               <div className="grid gap-6 lg:grid-cols-4">
//                 {/* Data */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">
//                     Data <span className="text-destructive">*</span>
//                   </Label>
//                   <Input
//                     type="date"
//                     className="h-12 rounded-xl"
//                     disabled {!isEditing}
//                     {...register("date", { required: "Campo obrigatório" })}
//                   />
//                   {errors.date && (
//                     <p className="text-sm text-destructive mt-1">
//                       {errors.date.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Hora */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">
//                     Hora <span className="text-destructive">*</span>
//                   </Label>
//                   <Input
//                     type="time"
//                     step={1}
//                     className="h-12 rounded-xl"
//                     disabled {!isEditing}
//                     {...register("time", { required: "Campo obrigatório" })}
//                   />
//                   {errors.time && (
//                     <p className="text-sm text-destructive mt-1">
//                       {errors.time.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Classificação */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">
//                     Classificação <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     control={control}
//                     name="classification"
//                     rules={{ required: "Campo obrigatório" }}
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                         disabled={!isEditing}
//                       >
//                         <SelectTrigger className="h-12 rounded-xl">
//                           <SelectValue placeholder="Selecione" />
//                         </SelectTrigger>
//                         <SelectContent className="rounded-xl">
//                           <SelectItem value="Negativa">Negativa</SelectItem>
//                           <SelectItem value="Positiva">Positiva</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.classification && (
//                     <p className="text-sm text-destructive mt-1">
//                       {errors.classification.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Severidade */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">
//                     Severidade <span className="text-destructive">*</span>
//                   </Label>
//                   <Controller
//                     control={control}
//                     name="severity"
//                     rules={{ required: "Campo obrigatório" }}
//                     render={({ field }) => (
//                       <Select
//                         value={field.value}
//                         onValueChange={field.onChange}
//                         disabled={!isEditing}
//                       >
//                         <SelectTrigger className="h-12 rounded-xl">
//                           <SelectValue placeholder="Selecione" />
//                         </SelectTrigger>
//                         <SelectContent className="rounded-xl">
//                           <SelectItem value="Grave">
//                             <div className="flex items-center gap-2">
//                               <span className="h-3 w-3 rounded-full bg-red-600" />
//                               Grave
//                             </div>
//                           </SelectItem>
//                           <SelectItem value="Moderada">
//                             <div className="flex items-center gap-2">
//                               <span className="h-3 w-3 rounded-full bg-amber-500" />
//                               Moderada
//                             </div>
//                           </SelectItem>
//                           <SelectItem value="Leve">
//                             <div className="flex items-center gap-2">
//                               <span className="h-3 w-3 rounded-full bg-green-600" />
//                               Leve
//                             </div>
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                   {errors.severity && (
//                     <p className="text-sm text-destructive mt-1">
//                       {errors.severity.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Status */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Status</Label>
//                   <Controller
//                     control={control}
//                     name="status"
//                     render={({ field }) => (
//                       <Select
//                         value={field.value ?? ""}
//                         onValueChange={(v) => field.onChange(v || undefined)}
//                         disabled={!isEditing}
//                       >
//                         <SelectTrigger className="h-12 rounded-xl">
//                           <SelectValue placeholder="Selecione" />
//                         </SelectTrigger>
//                         <SelectContent className="rounded-xl">
//                           <SelectItem value="Aberto">Aberto</SelectItem>
//                           <SelectItem value="Em_analise">Em análise</SelectItem>
//                           <SelectItem value="Em_andamento">
//                             Em andamento
//                           </SelectItem>
//                           <SelectItem value="Concluido">Concluído</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                 </div>

//                 {/* Modelo */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Modelo</Label>
//                   <Controller
//                     control={control}
//                     name="type"
//                     render={({ field }) => (
//                       <Select
//                         value={field.value ?? ""}
//                         onValueChange={(v) =>
//                           field.onChange((v || undefined) as any)
//                         }
//                         disabled={!isEditing}
//                       >
//                         <SelectTrigger className="h-12 rounded-xl">
//                           <SelectValue placeholder="Selecione" />
//                         </SelectTrigger>
//                         <SelectContent className="rounded-xl">
//                           <SelectItem value="AVU">AVU</SelectItem>
//                           <SelectItem value="BRO">BRO</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* 3. Localização e Contexto */}
//           <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <div className={`${GRADIENT_HEADER} p-6`}>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
//                   <MapPin className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">
//                     Localização e Contexto
//                   </h3>
//                 </div>
//               </div>
//             </div>

//             <div className="p-8">
//               <div className="grid gap-6 lg:grid-cols-3">
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Área Atendida</Label>
//                   <Input
//                     placeholder="Ex.: Portaria, Almoxarifado…"
//                     className="h-12 rounded-xl"
//                     disabled={!isEditing}
//                     {...register("attendedArea")}
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Cidade</Label>
//                   <Input
//                     placeholder="Ex.: Salvador/BA"
//                     className="h-12 rounded-xl"
//                     disabled={!isEditing}
//                     {...register("city")}
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Família</Label>
//                   <Controller
//                     control={control}
//                     name="occurrenceFamily"
//                     render={({ field }) => (
//                       <Select
//                         value={field.value ?? ""}
//                         onValueChange={field.onChange}
//                         disabled={!isEditing}
//                       >
//                         <SelectTrigger className="h-12 rounded-xl">
//                           <SelectValue placeholder="Selecione a família" />
//                         </SelectTrigger>
//                         <SelectContent className="rounded-xl">
//                           {["Ocorrencia", "Vulnerabilidade"].map((opt) => (
//                             <SelectItem key={opt} value={opt}>
//                               {opt}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Latitude</Label>
//                   <Input
//                     type="number"
//                     step="0.00000001"
//                     inputMode="decimal"
//                     placeholder="-12.3456789"
//                     className="h-12 rounded-xl"
//                     disabled={!isEditing}
//                     {...register("latitude")}
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Longitude</Label>
//                   <Input
//                     type="number"
//                     step="0.00000001"
//                     inputMode="decimal"
//                     placeholder="-45.6789123"
//                     className="h-12 rounded-xl"
//                     disabled={!isEditing}
//                     {...register("longitude")}
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* 4. Relato */}
//           <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <div className={`${GRADIENT_HEADER} p-6`}>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
//                   <FileText className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">Relato</h3>
//                 </div>
//               </div>
//             </div>

//             <div className="p-8">
//               <div className="space-y-3">
//                 <Label className="text-sm font-medium">
//                   Descrição da Ocorrência <span className="text-destructive">*</span>
//                 </Label>
//                 <Textarea
//                   rows={6}
//                   className="min-h-[150px] rounded-xl resize-none"
//                   disabled={!isEditing}
//                   placeholder="Descreva em detalhes..."
//                   {...register("report", { required: "Campo obrigatório" })}
//                 />
//                 {errors.report && (
//                   <p className="text-sm text-destructive mt-1">
//                     {errors.report.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </section>

//           {/* 5. Custos */}
//           <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <div className={`${GRADIENT_HEADER} p-6`}>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
//                   <DollarSign className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">Custos</h3>
//                 </div>
//               </div>
//             </div>

//             <div className="p-8">
//               <div className="grid gap-6 lg:grid-cols-3">
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Custo do Evento</Label>
//                   <Input
//                     type="number"
//                     step="0.01"
//                     inputMode="decimal"
//                     className="h-12 rounded-xl"
//                     disabled={!isEditing}
//                     {...register("eventCost")}
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Moeda</Label>
//                   <Controller
//                     control={control}
//                     name="currency"
//                     render={({ field }) => (
//                       <Select
//                         value={field.value ?? "BRL"}
//                         onValueChange={(v) =>
//                           field.onChange((v || "BRL") as any)
//                         }
//                         disabled={!isEditing}
//                       >
//                         <SelectTrigger className="h-12 rounded-xl">
//                           <SelectValue placeholder="Selecione a moeda" />
//                         </SelectTrigger>
//                         <SelectContent className="rounded-xl">
//                           <SelectItem value="BRL">BRL</SelectItem>
//                           <SelectItem value="USD">USD</SelectItem>
//                           <SelectItem value="EUR">EUR</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     )}
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Custo Total</Label>
//                   <Input
//                     type="number"
//                     step="0.01"
//                     inputMode="decimal"
//                     className="h-12 rounded-xl"
//                     disabled={!isEditing}
//                     {...register("totalCost")}
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* 6. Ações e Agravantes */}
//           <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <div className={`${GRADIENT_HEADER} p-6`}>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
//                   <AlertTriangle className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">
//                     Ações e Agravantes
//                   </h3>
//                 </div>
//               </div>
//             </div>

//             <div className="p-8">
//               <div className="grid gap-8 lg:grid-cols-2">
//                 {/* Security Actions */}
//                 <div className="space-y-4">
//                   <Label className="text-sm font-medium">
//                     Ações de Segurança <span className="text-destructive">*</span>
//                   </Label>
//                   {loadingFlags ? (
//                     <div className="flex items-center justify-center py-8">
//                       <Loader2 className="h-6 w-6 animate-spin mr-2" />
//                       Carregando ações...
//                     </div>
//                   ) : securityActions.length === 0 ? (
//                     <p className="text-sm text-muted-foreground py-4">
//                       Nenhuma ação cadastrada.
//                     </p>
//                   ) : (
//                     <Controller
//                       control={control}
//                       name="securityActionIds"
//                       rules={{
//                         validate: (v) =>
//                           (v?.length ?? 0) > 0 || "Selecione ao menos 1 ação",
//                       }}
//                       render={({ field }) => (
//                         <div className="space-y-3">
//                           {securityActions.map((s: any) => {
//                             const checked = field.value?.includes(s.id);
//                             return (
//                               <div
//                                 key={s.id}
//                                 onClick={() =>
//                                   !isEditing
//                                     ? undefined
//                                     : checked
//                                     ? field.onChange(
//                                         (field.value ?? []).filter(
//                                           (id: number) => id !== s.id
//                                         )
//                                       )
//                                     : field.onChange([
//                                         ...(field.value ?? []),
//                                         s.id,
//                                       ])
//                                 }
//                                 className={`group rounded-xl border-2 p-4 transition-all duration-200 ${
//                                   checked
//                                     ? "border-primary bg-accent/50 shadow-sm"
//                                     : "border-border bg-transparent"
//                                 } ${isEditing ? "cursor-pointer hover:border-primary/50 hover:bg-accent/20" : "opacity-70 cursor-not-allowed"}`}
//                               >
//                                 <div className="flex items-start gap-3">
//                                   <div
//                                     className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
//                                       checked
//                                         ? "border-primary bg-primary"
//                                         : "border-muted-foreground"
//                                     }`}
//                                   >
//                                     {checked && (
//                                       <CheckCircle className="h-3 w-3 text-primary-foreground" />
//                                     )}
//                                   </div>
//                                   <span className="text-sm font-medium">
//                                     {s.name}
//                                   </span>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       )}
//                     />
//                   )}
//                   {errors.securityActionIds && (
//                     <p className="text-sm text-destructive mt-2">
//                       {String(errors.securityActionIds.message)}
//                     </p>
//                   )}
//                 </div>

//                 {/* Agravantes */}
//                 <div className="space-y-4">
//                   <Label className="text-sm font-medium">
//                     Agravantes <span className="text-destructive">*</span>
//                   </Label>
//                   {loadingFlags ? (
//                     <div className="flex items-center justify-center py-8">
//                       <Loader2 className="h-6 w-6 animate-spin mr-2" />
//                       Carregando agravantes...
//                     </div>
//                   ) : aggravants.length === 0 ? (
//                     <p className="text-sm text-muted-foreground py-4">
//                       Nenhum agravante cadastrado.
//                     </p>
//                   ) : (
//                     <Controller
//                       control={control}
//                       name="aggravatingSituationIds"
//                       rules={{
//                         validate: (v) =>
//                           (v?.length ?? 0) > 0 ||
//                           "Selecione ao menos 1 agravante",
//                       }}
//                       render={({ field }) => (
//                         <div className="space-y-3">
//                           {aggravants.map((g: any) => {
//                             const checked = field.value?.includes(g.id);
//                             return (
//                               <div
//                                 key={g.id}
//                                 onClick={() =>
//                                   !isEditing
//                                     ? undefined
//                                     : checked
//                                     ? field.onChange(
//                                         (field.value ?? []).filter(
//                                           (id: number) => id !== g.id
//                                         )
//                                       )
//                                     : field.onChange([
//                                         ...(field.value ?? []),
//                                         g.id,
//                                       ])
//                                 }
//                                 className={`group rounded-xl border-2 p-4 transition-all duration-200 ${
//                                   checked
//                                     ? "border-primary bg-accent/50 shadow-sm"
//                                     : "border-border bg-transparent"
//                                 } ${isEditing ? "cursor-pointer hover:border-primary/50 hover:bg-accent/20" : "opacity-70 cursor-not-allowed"}`}
//                               >
//                                 <div className="flex items-start gap-3">
//                                   <div
//                                     className={`mt-0.5 flex-shrink-0 h-5 w-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
//                                       checked
//                                         ? "border-primary bg-primary"
//                                         : "border-muted-foreground"
//                                     }`}
//                                   >
//                                     {checked && (
//                                       <CheckCircle className="h-3 w-3 text-primary-foreground" />
//                                     )}
//                                   </div>
//                                   <span className="text-sm font-medium">
//                                     {g.name}
//                                   </span>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       )}
//                     />
//                   )}
//                   {errors.aggravatingSituationIds && (
//                     <p className="text-sm text-destructive mt-2">
//                       {String(errors.aggravatingSituationIds.message)}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* 7. Anexos */}
//           <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
//             <div className={`${GRADIENT_HEADER} p-6`}>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
//                   <Camera className="h-6 w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-white">Anexos</h3>
//                   <p className="text-white/80 text-sm">
//                     Visualize, remova ou adicione novas imagens
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-8">
//               {/* Upload novas */}
//               <input
//                 id="image-upload"
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={onSelectImages}
//                 className="hidden"
//                 disabled={isBusy || !isEditing}
//               />
//               <label
//                 htmlFor="image-upload"
//                 className={`block rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
//                   isEditing
//                     ? "cursor-pointer border-border hover:border-primary hover:bg-accent/20"
//                     : "opacity-60 cursor-not-allowed border-border"
//                 }`}
//               >
//                 <div className="flex flex-col items-center gap-4">
//                   <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
//                     <Upload className="h-8 w-8" />
//                   </div>
//                   <div>
//                     <p className="font-semibold">Adicionar imagens</p>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       PNG, JPG (máx. 10MB por arquivo)
//                     </p>
//                   </div>
//                 </div>
//               </label>

//               {/* existentes */}
//               {existingPhotos.length > 0 && (
//                 <>
//                   <h4 className="mt-6 mb-2 font-semibold text-sm">
//                     Imagens anexadas
//                   </h4>
//                   <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//                     {existingPhotos.map((p) => (
//                       <div
//                         key={p.id}
//                         className="group relative overflow-hidden rounded-xl border bg-accent/20"
//                       >
//                         <img
//                           src={p.url}
//                           alt=""
//                           className="w-full aspect-video object-cover"
//                         />
//                         {isEditing && (
//                           <button
//                             type="button"
//                             onClick={() => removeExistingPhoto(p.id)}
//                             className="absolute top-2 right-2 rounded-full bg-destructive/90 p-1.5 text-destructive-foreground shadow-sm hover:bg-destructive transition-all duration-200"
//                             aria-label="Remover imagem existente"
//                           >
//                             <X className="h-4 w-4" />
//                           </button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}

//               {/* novas (pré-visualização) */}
//               {newPhotos.length > 0 && (
//                 <>
//                   <h4 className="mt-6 mb-2 font-semibold text-sm">
//                     Novas imagens (não salvas)
//                   </h4>
//                   <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//                     {newPhotos.map((f, i) => (
//                       <div
//                         key={`${f.name}-${i}`}
//                         className="group relative overflow-hidden rounded-xl border bg-accent/20"
//                       >
//                         <img
//                           src={URL.createObjectURL(f)}
//                           alt=""
//                           className="w-full aspect-video object-cover"
//                         />
//                         {isEditing && (
//                           <button
//                             type="button"
//                             onClick={() => removeNewPhoto(i)}
//                             className="absolute top-2 right-2 rounded-full bg-destructive/90 p-1.5 text-destructive-foreground shadow-sm hover:bg-destructive transition-all duration-200"
//                             aria-label="Remover imagem nova"
//                           >
//                             <X className="h-4 w-4" />
//                           </button>
//                         )}
//                         <div className="p-3 bg-white/90 backdrop-blur-sm">
//                           <p className="truncate text-xs font-medium">
//                             {f.name}
//                           </p>
//                           <p className="text-[10px] text-muted-foreground">
//                             {(f.size / 1024 / 1024).toFixed(2)} MB
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>

//             {/* barra fixa inferior para salvar (repete ações) */}
//             <div className="bg-white/95 backdrop-blur-sm p-6 rounded-t-2xl sticky bottom-0">
//               <div className="flex flex-col sm:flex-row gap-4 justify-end">
//                 {!isEditing ? (
//                   <Button onClick={toggleEdit} className="rounded-xl">
//                     <Pencil className="h-4 w-4 mr-2" />
//                     Editar
//                   </Button>
//                 ) : (
//                   <>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={cancelEdit}
//                       disabled={isBusy}
//                       className="px-8 py-3 rounded-xl"
//                     >
//                       <RefreshCw className="h-4 w-4 mr-2" />
//                       Cancelar
//                     </Button>
//                     <Button
//                       type="submit"
//                       disabled={isBusy}
//                       className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:opacity-90"
//                     >
//                       {isBusy ? (
//                         <>
//                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                           Salvando...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="h-4 w-4 mr-2" />
//                           Salvar alterações
//                         </>
//                       )}
//                     </Button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </section>
//         </form>
//       </main>
//     </div>
//   );
// }
