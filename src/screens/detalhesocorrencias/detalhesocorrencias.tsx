import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOccurrenceById } from "../../hooks/useOccorrencyById";
import { statusMap } from "../../utils/statusUtils";

type PhotoItem = {
  thumb: string; // src para <img>
  open: string; // src para abrir em nova aba
  revoke?: boolean; // se precisa revogar (blob:)
};

export default function DetalhesOcorrencias() {
  const { id } = useParams<{ id: string }>();
  const { data: occurrence, isLoading } = useOccurrenceById(id);
  const navigate = useNavigate();

  const API_BASE =
    (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") ||
    "http://localhost:62414";

  // util: transforma dataURL -> blobURL
  const dataUrlToBlobUrl = (dataUrl: string) => {
    try {
      // às vezes vem percent-encodado: data%3Aimage%2Fpng...
      const clean = decodeURIComponent(dataUrl);
      const [meta, b64] = clean.split(",");
      const mime =
        meta.match(/data:(.*?);base64/i)?.[1] || "application/octet-stream";
      const bin = atob(b64 || "");
      const len = bin.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
      const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
      return url;
    } catch {
      return ""; // se falhar, volta vazio
    }
  };

  // Normaliza as fotos vindas do backend (relation: occurrencePhoto)
  const photoItems: PhotoItem[] = React.useMemo(() => {
    const raw = (occurrence as any)?.occurrencePhoto ?? [];
    const arr = (Array.isArray(raw) ? raw : [])
      .map((p: any): PhotoItem | null => {
        let v: string = p?.filePath || p?.path || p?.url || "";
        if (!v) return null;

        // Corrige se veio percent-encodado
        if (v.startsWith("data%3A")) {
          try {
            v = decodeURIComponent(v);
          } catch {}
        }

        // Caso 1: Data URL
        if (/^data:/i.test(v)) {
          const blobUrl = dataUrlToBlobUrl(v);
          if (!blobUrl) return null;
          return { thumb: blobUrl, open: blobUrl, revoke: true };
        }

        // Caso 2: URL absoluta
        if (/^https?:\/\//i.test(v)) {
          return { thumb: v, open: v };
        }

        // Caso 3: já vem com prefixo estático
        if (v.startsWith("/uploads/photos/")) {
          const url = `${API_BASE}${v}`;
          return { thumb: url, open: url };
        }

        // Caso 4: só o fileName salvo pelo backend
        const url = `${API_BASE}/uploads/photos/${encodeURIComponent(v)}`;
        return { thumb: url, open: url };
      })
      .filter(Boolean) as PhotoItem[];

    return arr;
  }, [occurrence]);

  // Revoga blob URLs ao desmontar
  React.useEffect(() => {
    return () => {
      photoItems.forEach((it) => {
        if (it.revoke) URL.revokeObjectURL(it.thumb);
      });
    };
  }, [photoItems]);

  const openPhoto = (it: PhotoItem) => {
    try {
      window.open(it.open, "_blank", "noopener");
    } catch (e) {
      console.error("Falha ao abrir imagem:", e);
    }
  };

  if (isLoading || !occurrence) {
    return (
      <div className="min-h-screen bg-[#f6f9fb] font-sans">
        <main className="px-10 pt-10 max-w-[1100px] mx-auto pb-20">
          <p className="text-[#222]">Carregando ocorrência...</p>
        </main>
      </div>
    );
  }

  const etapas = ["Aberto", "Em Análise", "Em Andamento", "Concluído"];
  const statusFormatado =
    statusMap[occurrence.status as keyof typeof statusMap];
  const statusAtualIndex = etapas.findIndex(
    (etapa) => etapa === statusFormatado
  );
  const etapaIndexValido = statusAtualIndex === -1 ? 0 : statusAtualIndex;

  return (
    <div className="min-h-screen bg-[#f6f9fb] font-sans">
      <main className="px-10 pt-10 max-w-[1100px] mx-auto pb-20">
        <h1 className="text-3xl font-bold text-[#222] mb-1">
          OC-{occurrence.id}
        </h1>
        <h2 className="text-xl font-semibold text-[#222] mb-8">
          Detalhamento da Ocorrência
        </h2>

        <div className="flex items-center mb-10">
          {etapas.map((etapa, idx, arr) => (
            <React.Fragment key={etapa}>
              <div className="flex flex-col items-center">
                <span className="text-xs text-[#222] mb-2">
                  {idx === 0 && occurrence.createdAt
                    ? new Date(occurrence.createdAt).toLocaleString("pt-BR")
                    : ""}
                </span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 ${
                    idx <= etapaIndexValido
                      ? "bg-[#2196C9] border-[#2196C9]"
                      : "bg-white border-[#b0bdc6]"
                  }`}
                />
                <span className="text-sm text-[#222] mt-2">{etapa}</span>
              </div>
              {idx < arr.length - 1 && (
                <div
                  className={`h-1 ${
                    idx < etapaIndexValido ? "bg-[#2196C9]" : "bg-[#b0bdc6]"
                  } flex-1`}
                  style={{ minWidth: 40 }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-[#e3e8ee] p-8 mb-10 grid grid-cols-3 gap-8">
          <div>
            <div className="font-semibold text-lg text-[#222] mb-1">
              Emissor
            </div>
            <div className="mb-4">{occurrence.emitente?.name ?? "—"}</div>

            <div className="font-semibold text-lg text-[#222] mb-1">
              Localização
            </div>
            <div className="text-[#2196C9] underline">
              {occurrence.location}
              <br />
              {occurrence.city}
            </div>
          </div>

          <div>
            <div className="font-semibold text-lg text-[#222] mb-1">
              Descrição
            </div>
            <div className="mb-4">{occurrence.report}</div>

            <div className="font-semibold text-lg text-[#222] mb-1">Status</div>
            <div>{statusMap[occurrence.status as keyof typeof statusMap]}</div>
          </div>

          <div>
            <div className="font-semibold text-lg text-[#222] mb-1">Custos</div>
            <div className="mb-4 font-bold text-xl text-[#222]">
              R$ {Number(occurrence.totalCost || 0).toFixed(2)}
            </div>

            <div className="font-semibold text-lg text-[#222] mb-1">
              Arquivos (Fotos)
            </div>

            {photoItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {photoItems.map((it, i) => (
                  <button
                    key={`${i}-${it.thumb}`}
                    type="button"
                    onClick={() => openPhoto(it)}
                    className="cursor-pointer block text-left focus:outline-none"
                    title={`Abrir foto ${i + 1}`}
                  >
                    <img
                      src={it.thumb}
                      alt={`Foto ${i + 1}`}
                      className="w-full h-20 object-cover rounded border border-[#e3e8ee] hover:opacity-90"
                      loading="lazy"
                      onError={(e) => {
                        // fallback discreto se quebrar
                        (e.currentTarget as HTMLImageElement).style.opacity =
                          "0.6";
                      }}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2 text-[#6b7280]">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="7"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                  />
                  <path d="M3 7l9 6 9-6" stroke="#9CA3AF" strokeWidth="2" />
                </svg>
                <span>Nenhuma foto enviada.</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-lg text-[#222]">
              Histórico da Ocorrência
            </span>
            <div className="flex gap-2">
              <button
                className="px-4 py-1 rounded bg-[#e3e8ee] text-[#222] font-semibold"
                onClick={() =>
                  navigate(`/detalhesocorrencias/${occurrence.id}/edit`)
                }
              >
                Editar
              </button>
              <button className="px-4 py-1 rounded bg-[#2196C9] text-white font-semibold">
                Exportar
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-[#f6f9fb] rounded-lg px-4 py-3"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="7"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="#2196C9"
                    strokeWidth="2"
                  />
                  <path d="M3 7l9 6 9-6" stroke="#2196C9" strokeWidth="2" />
                </svg>
                <span className="flex-1 text-[#222]">
                  E-mail de notificação enviado
                </span>
                <span className="text-[#b0bdc6] text-sm">
                  {new Date(occurrence.createdAt).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
