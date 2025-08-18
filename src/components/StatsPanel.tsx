import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  MapPin,
  Building,
  TrendingUp,
  Globe,
  Target,
  ArrowUpRight,
  CheckCircle,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { locaisEspecificos } from "@/data/data";
import { useOccurrences } from "@/hooks/useOccurrences";
import { useUnidades } from "@/hooks/useUnidades";
import { statusMap, statusColorMap } from "@/utils/statusUtils";
import type { Unidade } from "@/types/unidade";

interface StatsPanelProps {
  detailed?: boolean;
}

type Severity = "Grave" | "Moderada" | "Leve";
type Status = "Aberto" | "Em_analise" | "Em_andamento" | "Concluido";

type OccurrenceWithRelations = {
  id: number | string;
  location: string;
  date: string;
  status?: Status | null;
  report: string;
  severity: Severity;
  setor?: {
    unidade?: {
      id?: string | number;
      name: string;
      codigo?: string;
    } | null;
  } | null;
};

const severityOrder: Severity[] = ["Grave", "Moderada", "Leve"];
const statusPriority: Status[] = [
  "Aberto",
  "Em_analise",
  "Em_andamento",
  "Concluido",
];

function dotClassBySeverity(sev?: Severity | null) {
  if (sev === "Grave") return "bg-red-500";
  if (sev === "Moderada") return "bg-yellow-500";
  if (sev === "Leve") return "bg-green-500";
  return "bg-gray-300";
}

function badgeClassBySeverity(sev?: Severity | null) {
  if (sev === "Grave") return "bg-red-100 text-red-600 border border-red-300";
  if (sev === "Moderada")
    return "bg-yellow-100 text-yellow-700 border border-yellow-300";
  if (sev === "Leve")
    return "bg-green-100 text-green-600 border border-green-300";
  return "bg-gray-100 text-gray-600 border border-gray-300";
}

function iconByStatus(status?: Status | null): LucideIcon | undefined {
  switch (status) {
    case "Aberto":
      return AlertTriangle;
    case "Em_analise":
      return Clock;
    case "Em_andamento":
      return ArrowUpRight;
    case "Concluido":
      return CheckCircle;
    default:
      return undefined;
  }
}

function getWorstSeverity(list: OccurrenceWithRelations[]): Severity | null {
  let worst: Severity | null = null;
  for (const o of list) {
    if (!o?.severity) continue;
    if (!worst) {
      worst = o.severity;
      continue;
    }
    if (severityOrder.indexOf(o.severity) < severityOrder.indexOf(worst)) {
      worst = o.severity;
    }
  }
  return worst;
}

function getPredominantStatus(list: OccurrenceWithRelations[]): Status | null {
  for (const s of statusPriority) {
    if (list.some((o) => o.status === s)) return s;
  }
  return null;
}

export function StatsPanel({ detailed = false }: StatsPanelProps) {
  const { data: occData, isLoading: loadingOcc } = useOccurrences();
  const { data: units, isLoading: loadingUnits } = useUnidades();

  const isLoading = loadingOcc || loadingUnits;

  const pageData =
    (occData?.data as unknown as OccurrenceWithRelations[] | undefined) ?? [];
  const totalOccurrences = occData?.meta?.total ?? pageData.length;

  const byUnitName = pageData.reduce<Record<string, OccurrenceWithRelations[]>>(
    (acc, o) => {
      const unitName = o?.setor?.unidade?.name;
      if (!unitName) return acc;
      if (!acc[unitName]) acc[unitName] = [];
      acc[unitName].push(o);
      return acc;
    },
    {}
  );

  const unitStats =
    (units ?? []).map((u: Unidade) => {
      const list = byUnitName[u.name] ?? [];
      const occurrences = list.length;
      const worstSeverity = getWorstSeverity(list);
      const predominantStatus = getPredominantStatus(list);

      return {
        id: u.id,
        unit: u.name,
        state: (u.state ?? "").trim().toUpperCase() || null,
        occurrences,
        worstSeverity,
        predominantStatus,
        dotClass: dotClassBySeverity(worstSeverity),
        badgeClass: badgeClassBySeverity(worstSeverity),
      };
    }) ?? [];

  const unitStatsSorted = [...unitStats].sort((a, b) => {
    const aHas = a.occurrences > 0 ? 1 : 0;
    const bHas = b.occurrences > 0 ? 1 : 0;
    if (aHas !== bHas) return bHas - aHas;

    if (a.occurrences !== b.occurrences) return b.occurrences - a.occurrences;

    return a.unit.localeCompare(b.unit);
  });

  const statesOrdered = Array.from(
    new Set(
      (units ?? [])
        .map((u) => (u.state ?? "").trim().toUpperCase())
        .filter(Boolean)
    )
  ).sort();

  const stateStats = statesOrdered
    .map((uf) => {
      const unitsInUf = unitStats.filter((u) => u.state === uf);
      const occurrences = unitsInUf.reduce((sum, u) => sum + u.occurrences, 0);
      const worstStateSeverity = getWorstSeverity(
        unitsInUf.flatMap((u) => byUnitName[u.unit] ?? [])
      );
      return {
        state: uf,
        occurrences,
        units: unitsInUf.length,
        dotClass: dotClassBySeverity(worstStateSeverity),
        worstSeverity: worstStateSeverity,
      };
    })
    .filter((s) => s.occurrences > 0);

  const totalLocaisEspecificos = locaisEspecificos.length;
  const totalUnits = units?.length ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="bg-white border-2 border-gray-200 animate-pulse">
          <CardContent className="p-4">
            <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-24 bg-gray-200 rounded" />
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-gray-200 animate-pulse">
          <CardContent className="p-4">
            <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-24 bg-gray-200 rounded" />
          </CardContent>
        </Card>
        <Card className="bg-white border-2 border-gray-200 animate-pulse">
          <CardContent className="p-4">
            <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-24 bg-gray-200 rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (detailed) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white border-2 border-red-500 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-red-100 p-3 rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex items-center space-x-1 text-red-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">+12%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-red-600 text-sm font-semibold uppercase tracking-wide">
                    Total de Ocorrências
                  </p>
                  <p className="text-4xl font-bold text-red-600 mt-2">
                    {totalOccurrences}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-red-500">
                  <ArrowUpRight className="h-3 w-3" />
                  <span className="text-xs">vs mês anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-green-500 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">Ativo</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">
                    Unidades Ativas
                  </p>
                  <p className="text-4xl font-bold text-green-600 mt-2">
                    {totalUnits}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-green-500">
                  <CheckCircle className="h-3 w-3" />
                  <span className="text-xs">100% operacionais</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex items-center space-x-1 text-blue-600">
                  <Target className="h-4 w-4" />
                  <span className="text-xs font-medium">Monitorado</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
                    Locais Específicos
                  </p>
                  <p className="text-4xl font-bold text-blue-600 mt-2">
                    {totalLocaisEspecificos}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-blue-500">
                  <MapPin className="h-3 w-3" />
                  <span className="text-xs">Pontos de monitoramento</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-[560px] overflow-hidden">
          <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 flex flex-col min-h-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="mr-3 h-5 w-5 text-purple-600" />
                Distribuição por Estado
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ocorrências registradas por região
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-2 pb-2 flex-1 min-h-0 overflow-hidden bg-[#f6fbff]">
              <div className="h-full overflow-y-auto pr-2">
                <div className="flex flex-col gap-3">
                  {stateStats.map((stat) => (
                    <div
                      key={stat.state}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-4 h-4 rounded-full ${stat.dotClass}`}
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {stat.state}
                          </p>
                          <p className="text-sm text-gray-500">
                            {stat.occurrences} ocorrências registradas
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-gray-200 text-gray-700 font-medium"
                      >
                        {stat.units} unidade{stat.units > 1 ? "s" : ""}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-white hover:shadow-2xl transition-all duration-300 flex flex-col min-h-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Building className="mr-3 h-5 w-5 text-blue-600" />
                Status das Unidades
              </CardTitle>
              <CardDescription className="text-gray-600">
                Monitoramento operacional em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 px-2 pb-2 flex-1 min-h-0 overflow-hidden bg-[#f6fbff]">
              <div className="h-full overflow-y-auto pr-2">
                <div className="flex flex-col gap-3">
                  {unitStatsSorted.map((stat) => {
                    const st = stat.predominantStatus ?? undefined;
                    const Icon = st ? iconByStatus(st) : undefined;

                    return (
                      <div
                        key={stat.unit}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-4 h-4 rounded-full ${stat.dotClass}`}
                          />
                          <div>
                            <p className="font-semibold text-sm text-gray-900">
                              {stat.unit}
                            </p>
                            {stat.state && (
                              <p className="text-xs text-gray-500">
                                UF: {stat.state}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge className={`${stat.badgeClass} font-medium`}>
                            {stat.occurrences}
                          </Badge>

                          {st && (
                            <>
                              {Icon && (
                                <Icon
                                  className={`h-4 w-4 ${
                                    statusColorMap[st] ?? ""
                                  }`}
                                />
                              )}
                              <span
                                className={`text-xs font-medium ${
                                  statusColorMap[st] ?? ""
                                }`}
                              >
                                {statusMap[st] ?? st}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white border-2 border-red-500 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-red-600 text-sm font-semibold uppercase tracking-wide">
                Ocorrências
              </p>
              <p className="text-2xl font-bold text-red-600">
                {totalOccurrences}
              </p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-green-500 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">
                Unidades
              </p>
              <p className="text-2xl font-bold text-green-600">{totalUnits}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Building className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">
                Estados
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stateStats.length}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-2 border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">
                Pontos monitorados
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {locaisEspecificos.length}
              </p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
