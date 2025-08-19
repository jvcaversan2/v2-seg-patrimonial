import { Upload, X } from "lucide-react";

export function PhotoUploader({
  files64,
  onAdd,
  onRemove,
  disabled,
}: {
  files64: string[];
  onAdd: (base64s: string[]) => void;
  onRemove: (index: number) => void;
  disabled?: boolean;
}) {
  const toBase64 = (f: File) =>
    new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = rej;
      r.readAsDataURL(f);
    });

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgs = Array.from(e.target.files ?? []).filter((f) =>
      f.type.startsWith("image/")
    );
    if (!imgs.length) return;
    const base64 = await Promise.all(imgs.map(toBase64));
    onAdd(base64);
  };

  return (
    <div className="space-y-4">
      <label
        htmlFor="photo-input"
        className="block cursor-pointer rounded-2xl border-2 border-dashed border-border bg-white hover:bg-accent/30 transition-colors p-6 text-center"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-xl bg-accent/50 flex items-center justify-center">
            <Upload className="h-7 w-7 text-foreground" />
          </div>
          <p className="text-sm font-medium">Clique para adicionar imagens</p>
          <p className="text-xs text-muted-foreground">
            Formatos: PNG, JPG (máx. 10MB)
          </p>
        </div>
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleSelect}
          disabled={disabled}
          className="hidden"
        />
      </label>

      {files64.length > 0 && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {files64.map((b64, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl border border-border bg-white shadow-sm"
            >
              <img
                src={b64}
                alt={`foto-${i}`}
                className="w-full aspect-video object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground h-7 w-7 shadow hover:opacity-90 transition"
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
