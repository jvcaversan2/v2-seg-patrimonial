import { useMemo } from "react";
import { useOccurrences } from "@/hooks/useOccurrences";
import { useUnidades } from "@/hooks/useUnidades";
import { useSetores } from "@/hooks/useSetores";
import { AlertTriangle, Building2, MapPin } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  accentClass: string;
  subtitle?: string;
};

function StatCard({
  title,
  value,
  icon,
  accentClass,
  subtitle,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white shadow px-5 py-4 flex items-center justify-between ${accentClass}`}
    >
      <div>
        <p className="text-xs font-semibold tracking-wide uppercase text-gray-600">
          {title}
        </p>
        <p className="mt-1 text-3xl font-extrabold text-gray-900 leading-none">
          {value}
        </p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="shrink-0">{icon}</div>
    </div>
  );
}

export default function Stats() {
  const { data: occPaginated, isLoading: occLoading } = useOccurrences();
  const { data: unidades, isLoading: uniLoading } = useUnidades();
  const { data: setores, isLoading: setLoading } = useSetores();

  const loading = occLoading || uniLoading || setLoading;

  const totalOcorrencias = occPaginated?.meta?.total ?? 0;
  const totalUnidades = unidades?.length ?? 0;
  // assumindo Pontos Monitorados = total de setores
  const totalPontos = setores?.length ?? 0;

  const cards = useMemo(
    () => [
      {
        title: "Ocorrências",
        value: loading ? "—" : totalOcorrencias,
        icon: (
          <div className="h-10 w-10 rounded-full bg-red-50 border border-red-200 grid place-items-center">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        ),
        accentClass: "border-red-300",
      },
      {
        title: "Unidades",
        value: loading ? "—" : totalUnidades,
        icon: (
          <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200 grid place-items-center">
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
        ),
        accentClass: "border-emerald-300",
      },
      {
        title: "Pontos monitorados",
        value: loading ? "—" : totalPontos,
        icon: (
          <div className="h-10 w-10 rounded-full bg-violet-50 border border-violet-200 grid place-items-center">
            <MapPin className="h-5 w-5 text-violet-600" />
          </div>
        ),
        accentClass: "border-violet-300",
      },
    ],
    [loading, totalOcorrencias, totalUnidades, totalPontos]
  );

  return (
    <aside className="space-y-4">
      {cards.map((c) => (
        <StatCard
          key={c.title}
          title={c.title}
          value={c.value}
          icon={c.icon}
          accentClass={c.accentClass}
          subtitle={
            c.title === "Pontos monitorados" ? "Total de setores" : undefined
          }
        />
      ))}
    </aside>
  );
}
