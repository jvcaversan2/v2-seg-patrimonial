import { StatsPanel } from "@/components/StatsPanel";

export default function Relatorios() {
  return (
    <div className="min-h-screen bg-[#f6fbff] font-sans">
      <main className="px-8 pt-10 max-w-7xl mx-auto bg-[#f6fbff]">
        <StatsPanel detailed />
      </main>
    </div>
  );
}
