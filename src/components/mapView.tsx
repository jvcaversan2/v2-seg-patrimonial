import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Target,
} from "lucide-react";
import { useOccurrences } from "@/hooks/useOccurrences";

type StatusKind = "active" | "warning" | "critical" | string;

function InvalidateOnResize({
  container,
}: {
  container: React.RefObject<HTMLDivElement>;
}) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (!container.current) return;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(container.current);
    const onWinResize = () => map.invalidateSize();
    window.addEventListener("resize", onWinResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onWinResize);
    };
  }, [map, container]);
  return null;
}

export function MapView() {
  const { data: result, isLoading } = useOccurrences();

  const occurrences = result?.data ?? [];
  const icons = useMemo(() => {
    const base = {
      shadowUrl: "/icons/marker-shadow.png",
      iconSize: [25, 41] as [number, number],
      iconAnchor: [12, 41] as [number, number],
      popupAnchor: [1, -34] as [number, number],
      shadowSize: [41, 41] as [number, number],
    };
    const greenIcon = new L.Icon({
      ...base,
      iconUrl: "src/assets//icons/marker-icon-green.png",
    });
    const yellowIcon = new L.Icon({
      ...base,
      iconUrl: "/src/assets/icons/marker-icon-yellow.png",
    });
    const redIcon = new L.Icon({
      ...base,
      iconUrl: "src/assets//icons/marker-icon-red.png",
    });
    return { greenIcon, yellowIcon, redIcon };
  }, []);

  const getMarkerIcon = (status: StatusKind) =>
    status === "warning"
      ? icons.yellowIcon
      : status === "critical"
      ? icons.redIcon
      : icons.greenIcon;

  const getStatusColor = (status: StatusKind) =>
    status === "critical"
      ? "bg-red-500"
      : status === "warning"
      ? "bg-yellow-500"
      : "bg-green-500";

  const getStatusIcon = (status: StatusKind) =>
    status === "critical"
      ? AlertTriangle
      : status === "warning"
      ? Clock
      : CheckCircle;

  const defaultCenter: [number, number] = [-21.5, -45];
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="border border-gray-200 shadow-sm bg-white w-full">
      <CardHeader className="bg-gray-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Mapa de Ocorrências
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Visualização interativa das ocorrências registradas
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          ref={containerRef}
          className="relative h-[500px] w-full min-w-0 z-0"
        >
          <MapContainer
            center={defaultCenter}
            zoom={5}
            scrollWheelZoom
            className="!w-full !h-full"
            style={{ height: "100%", width: "100%" }}
          >
            <InvalidateOnResize
              container={containerRef as React.RefObject<HTMLDivElement>}
            />

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            />

            {!isLoading &&
              occurrences.map((occ: any) => {
                const lat = occ.latitude ?? occ.lat;
                const lng = occ.longitude ?? occ.lng;
                if (lat == null || lng == null) return null;

                const status: StatusKind =
                  occ.status === "Em_analise"
                    ? "warning"
                    : occ.status === "Concluido"
                    ? "active"
                    : occ.status === "Grave" || occ.severity === "Grave"
                    ? "critical"
                    : "active";

                const StatusIcon = getStatusIcon(status);

                return (
                  <Marker
                    key={occ.id}
                    position={[lat, lng]}
                    icon={getMarkerIcon(status)}
                  >
                    <Popup>
                      <div className="space-y-2 w-64">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getStatusColor(
                                status
                              )}`}
                            />
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">
                                {occ.titulo ??
                                  occ.title ??
                                  `Ocorrência #${occ.id}`}
                              </h4>
                              <p className="text-gray-500 text-xs font-medium">
                                Unidade: {occ.setor.unidade.name ?? "-"}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`${
                              status === "critical"
                                ? "bg-red-100 text-red-700 border border-red-300"
                                : status === "warning"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                : "bg-green-100 text-green-700 border border-green-300"
                            } font-semibold text-xs`}
                          >
                            {status === "critical"
                              ? "Crítico"
                              : status === "warning"
                              ? "Atenção"
                              : "Ativo"}
                          </Badge>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <StatusIcon className="h-4 w-4 text-gray-600" />
                            <span className="font-semibold text-gray-700">
                              Status:{" "}
                              {status === "active"
                                ? "Ativo"
                                : status === "warning"
                                ? "Atenção"
                                : "Crítico"}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {occ.report ?? "Sem detalhamento."}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                          <div className="bg-gray-50 p-2 border border-gray-200 rounded">
                            <p className="font-semibold">Data</p>
                            <p>{new Date(occ.date).toLocaleDateString()}</p>
                          </div>
                          <div className="bg-gray-50 p-2 border border-gray-200 rounded">
                            <p className="font-semibold">Hora</p>
                            <p>
                              {occ.time
                                ? new Date(occ.time).toLocaleTimeString()
                                : "--:--"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all border border-gray-300 flex items-center justify-center space-x-1">
                            <ArrowUpRight className="h-3 w-3" />
                            <span>Ver Detalhes</span>
                          </button>
                          <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all border border-gray-300 flex items-center justify-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span>Relatório</span>
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
