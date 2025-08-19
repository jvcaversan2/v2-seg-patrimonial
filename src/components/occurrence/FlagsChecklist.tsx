export function FlagsChecklist({
  items,
  value,
  onChange,
  loading,
  requiredMessage,
  label,
}: {
  items: { id: number; name: string }[];
  value: number[];
  onChange: (ids: number[]) => void;
  loading?: boolean;
  requiredMessage?: string;
  label: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center py-2 text-muted-foreground">
        <span className="animate-pulse mr-2">●</span> Carregando...
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 font-medium">{label}</p>
      <div className="grid gap-2">
        {items.map((it) => {
          const checked = value?.includes(it.id);
          return (
            <label key={it.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border"
                checked={!!checked}
                onChange={() =>
                  checked
                    ? onChange(value.filter((id) => id !== it.id))
                    : onChange([...(value ?? []), it.id])
                }
              />
              <span className="text-sm">{it.name}</span>
            </label>
          );
        })}
      </div>
      {requiredMessage && !value?.length && (
        <p className="text-sm text-destructive mt-1">{requiredMessage}</p>
      )}
    </div>
  );
}
