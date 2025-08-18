import { MapPinned, BarChart3, Plus, FileText, Search } from "lucide-react";

type TabItem = {
  label: string;
  key: string;
  icon: React.ComponentType<{ className?: string }>;
};

const TABS: TabItem[] = [
  { label: "Mapa", key: "mapa", icon: MapPinned },
  { label: "Estatísticas", key: "estatisticas", icon: BarChart3 },
  { label: "Registrar", key: "registrar", icon: Plus },
  { label: "Ocorrências", key: "ocorrencias", icon: FileText },
  { label: "Auditoria", key: "auditoria", icon: Search },
];

export default function TabsNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-2xl bg-white/80 border border-gray-200 shadow px-2 py-2">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={[
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all",
                isActive
                  ? "bg-[#e8f0fe] text-[#1f2a37] shadow-inner"
                  : "text-[#5B7F95] hover:text-[#1f2a37] hover:bg-gray-50",
              ].join(" ")}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
