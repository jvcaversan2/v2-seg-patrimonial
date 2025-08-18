import React, { Suspense, lazy, useState } from "react";
import MainHeader from "@/components/MainHeader";
import TabsNav from "@/components/TabsNav";
import { MapView } from "@/components/mapView";
import Stats from "@/components/Stats";
// import Stats from "@/components/Stats";

// lazy das suas rotas existentes
const Relatorios = lazy(() => import("@/screens/relatorios/relatorios"));
const NovaOcorrencia = lazy(
  () => import("@/screens/novaocorrencia/novaocorrencia")
);
const Ocorrencias = lazy(() => import("@/screens/ocorrencias/ocorrencias"));

function MapPanel() {
  return (
    <section className="rounded-2xl bg-white border border-gray-200 shadow">
      <div className="rounded-b-2xl w-full min-w-0">
        <MapView />
      </div>
    </section>
  );
}

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("mapa");

  return (
    <div className="min-h-screen bg-[#f6fbff] font-sans">
      <MainHeader />

      <section className="px-8 mt-2 mb-6 max-w-[1200px] mx-auto">
        {/* título + subtítulo */}
        <div className="mb-6">
          <div className="bg-white shadow-lg border border-gray-200 p-8 rounded-md">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
              Portal de Monitoramento
            </h1>
            <p className="text-gray-600 text-lg">
              Mosaic Fertilizantes - Acompanhe ocorrências em tempo real
            </p>
          </div>
        </div>

        {/* tabs controladas */}
        <div className="mb-6">
          <TabsNav active={activeTab} onChange={setActiveTab} />
        </div>

        {/* conteúdo da aba */}
        <div className="bg-transparent">
          <Suspense
            fallback={
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6 text-sm text-gray-500">
                Carregando...
              </div>
            }
          >
            {activeTab === "mapa" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* mapa ocupa 2 colunas no desktop */}
                <div className="lg:col-span-2">
                  <MapPanel />
                </div>
                {/* painel lateral */}
                <div className="lg:col-span-1">
                  <Stats />
                </div>
              </div>
            )}

            {activeTab === "estatisticas" && <Relatorios />}
            {activeTab === "registrar" && <NovaOcorrencia />}
            {activeTab === "ocorrencias" && <Ocorrencias />}
            {activeTab === "auditoria" && (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-2">Auditoria</h3>
                <p className="text-gray-600 text-sm">Em breve…</p>
              </div>
            )}
          </Suspense>
        </div>
      </section>
    </div>
  );
};

export default Home;
