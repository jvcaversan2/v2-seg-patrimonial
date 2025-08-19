export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}
