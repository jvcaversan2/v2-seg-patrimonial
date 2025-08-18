import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Calendar,
  MapPin,
  User,
  Search,
  Filter,
} from "lucide-react";
import { useOccurrences } from "@/hooks/useOccurrences";
import { useUnidades } from "@/hooks/useUnidades";
import type { Unidade } from "@/types/unidade";
import type { Severity, Status } from "@/types/types";

type Occurrence = {
  id: number | string;
  title?: string | null;
  description?: string | null;
  report?: string | null;
  location?: string | null;
  date: string;
  time?: string | null;
  status?: Status | null;
  severity?: Severity | null;
  reporter?: string | null;
  setor?: {
    unidade?: {
      name?: string | null;
      state?: string | null;
    } | null;
  } | null;
};

type Paginated<T> = { data: T[]; meta?: { total?: number } };

const toText = (v: unknown): string => {
  if (v == null) return "";
  const t = typeof v;
  if (t === "string") return v as string;
  if (t === "number" || t === "boolean") return String(v);
  if (t === "bigint") return (v as bigint).toString();
  return "";
};

const fmtDate = (iso: string) => {
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? toText(iso) : d.toLocaleDateString();
  } catch {
    return toText(iso);
  }
};

const severityBadge = (sev?: Severity | null) => {
  switch (sev) {
    case "Grave":
      return { label: "🔴 Grave", cls: "bg-red-600 text-white" };
    case "Moderada":
      return { label: "🟠 Moderada", cls: "bg-orange-500 text-white" };
    case "Leve":
      return { label: "🟢 Leve", cls: "bg-green-600 text-white" };
    default:
      return { label: "⚪ N/D", cls: "bg-gray-300 text-gray-800" };
  }
};

const statusDot = (st?: Status | null) => {
  switch (st) {
    case "Aberto":
      return { label: "Aberto", cls: "bg-red-500" };
    case "Em_analise":
      return { label: "Em análise", cls: "bg-yellow-500" };
    case "Em_andamento":
      return { label: "Em andamento", cls: "bg-blue-500" };
    case "Concluido":
      return { label: "Concluído", cls: "bg-green-500" };
    default:
      return { label: "Desconhecido", cls: "bg-gray-400" };
  }
};

export default function Ocorrencias() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<"all" | Severity>("all");
  const [filterUnitName, setFilterUnitName] = useState<string>("all");

  const { data: occRes, isLoading: loadingOcc } = useOccurrences();
  const { data: units = [], isLoading: loadingUnits } = useUnidades();

  const unitUFByName = useMemo(() => {
    const map = new Map<string, string>();
    (units as Unidade[]).forEach((u) => {
      const name = toText((u as any).name).trim();
      const uf = toText((u as any).state).toUpperCase();
      if (name) map.set(name, uf);
    });
    return map;
  }, [units]);

  const occurrences: Occurrence[] = useMemo(() => {
    if (!occRes) return [];
    if (Array.isArray(occRes)) return occRes as Occurrence[];
    if (Array.isArray((occRes as Paginated<Occurrence>).data))
      return (occRes as Paginated<Occurrence>).data;
    return [];
  }, [occRes]);

  const total = useMemo(() => {
    if (!occRes) return 0;
    if (Array.isArray(occRes)) return (occRes as Occurrence[]).length;
    return (occRes as Paginated<Occurrence>).meta?.total ?? occurrences.length;
  }, [occRes, occurrences.length]);

  const isLoading = loadingOcc || loadingUnits;

  const unitNames = useMemo(() => {
    const set = new Set<string>();
    (units as Unidade[]).forEach((u) => {
      const name = toText((u as any).name).trim();
      if (name) set.add(name);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [units]);

  const filteredOccurrences = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return occurrences.filter((o) => {
      const unitName = toText(o.setor?.unidade?.name).trim();
      const unitUF =
        toText(o.setor?.unidade?.state).toUpperCase() ||
        unitUFByName.get(unitName) ||
        "";

      const haystack = [
        o.title,
        o.description,
        o.report,
        o.location,
        unitName,
        unitUF,
      ]
        .map(toText)
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = term ? haystack.includes(term) : true;
      const matchesSeverity =
        filterSeverity === "all" || o.severity === filterSeverity;
      const matchesUnit =
        filterUnitName === "all" || unitName === filterUnitName;

      return matchesSearch && matchesSeverity && matchesUnit;
    });
  }, [occurrences, searchTerm, filterSeverity, filterUnitName, unitUFByName]);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg py-4">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <AlertTriangle className="mr-3 h-6 w-6 text-blue-600" />
            Lista de Ocorrências
            <Badge className="ml-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              {filteredOccurrences.length} / {total}
            </Badge>
          </CardTitle>
          <CardDescription>
            Gerencie e monitore todas as ocorrências registradas no sistema
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-0 shadow-lg py-4">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Filter className="mr-2 h-5 w-5 text-gray-600" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, descrição, relato, unidade ou local..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Severidade
              </label>
              <Select
                value={filterSeverity}
                onValueChange={(v) => setFilterSeverity(v as "all" | Severity)}
              >
                <SelectTrigger className="bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder="Todas as severidades" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">Todas as severidades</SelectItem>
                  <SelectItem value="Grave">🔴 Grave</SelectItem>
                  <SelectItem value="Moderada">🟠 Moderada</SelectItem>
                  <SelectItem value="Leve">🟢 Leve</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Unidade
              </label>
              <Select
                value={filterUnitName}
                onValueChange={setFilterUnitName}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder="Todas as unidades" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200">
                  <SelectItem value="all">Todas as unidades</SelectItem>
                  {unitNames.map((name) => {
                    const uf = unitUFByName.get(name);
                    return (
                      <SelectItem key={`${name}|${uf ?? ""}`} value={name}>
                        {name} {uf ? `(${uf})` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {(loadingOcc || loadingUnits) &&
          [...Array(3)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 w-48 bg-gray-200 rounded mb-3" />
                <div className="h-3 w-80 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-64 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}

        {!isLoading &&
          filteredOccurrences.map((o) => {
            const sev = severityBadge(o.severity);
            const st = statusDot(o.status);
            const title =
              o.title ??
              o.report?.slice(0, 80) ??
              o.description ??
              "Ocorrência";
            const description = o.description ?? o.report ?? "(sem descrição)";
            const unitName = toText(o.setor?.unidade?.name) || "-";
            const unitUF =
              toText(o.setor?.unidade?.state).toUpperCase() ||
              unitUFByName.get(unitName) ||
              "";

            return (
              <Card
                key={String(o.id)}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={`${sev.cls} border-0`}>
                          {sev.label}
                        </Badge>
                        <div
                          className={`w-3 h-3 rounded-full ${st.cls} animate-pulse`}
                        />
                        <span className="text-sm text-gray-500">
                          {st.label}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {title}
                        </h3>
                        <p className="text-gray-600 mb-3">{description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-1 text-gray-600 ml-[-5px]">
                          <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                          <span className="truncate">
                            {o.location ?? "Sem local informado"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {o.reporter ?? "—"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-600">
                          <span>
                            Unidade: {unitName}
                            {unitUF ? ` • UF: ${unitUF}` : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {fmtDate(o.date)}
                          </span>
                        </div>
                        {o.time && (
                          <span className="text-sm text-gray-500">
                            {o.time}
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/detalhesocorrencias/${o.id}`)
                          }
                        >
                          Ver Detalhes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(`/detalhesocorrencias/${o.id}/edit`)
                          }
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

        {!isLoading && filteredOccurrences.length === 0 && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma ocorrência encontrada
              </h3>
              <p className="text-gray-500">
                Tente ajustar os filtros ou criar uma nova ocorrência.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
