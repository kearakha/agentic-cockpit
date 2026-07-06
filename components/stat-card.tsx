export function StatCard({
  value,
  label,
  delta,
}: {
  value: string;
  label: string;
  delta?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-card p-4">
      <p className="font-mono text-3xl">{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{label}</p>
      {delta && (
        <p className="mt-2 font-mono text-xs text-ink-muted">
          {delta} vs minggu lalu
        </p>
      )}
    </div>
  );
}
