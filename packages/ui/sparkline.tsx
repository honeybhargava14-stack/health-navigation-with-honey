type SparklineProps = {
  values: (number | null)[];
  label: string;
  max?: number;
};

export function Sparkline({ values, label, max = 10 }: SparklineProps) {
  const width = 280;
  const height = 64;
  const points = values
    .map((value, index) => {
      if (value == null) return null;
      const x = values.length <= 1 ? width / 2 : (index / (values.length - 1)) * width;
      const y = height - (Math.min(value, max) / max) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(" ");

  const filled = values.filter((value) => value != null) as number[];
  const avg =
    filled.length === 0
      ? null
      : Math.round((filled.reduce((sum, value) => sum + value, 0) / filled.length) * 10) / 10;

  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted">{avg == null ? "No logs yet" : `Avg ${avg}`}</p>
      </div>
      {points ? (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-16 w-full" role="img" aria-label={label}>
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
            points={points}
          />
        </svg>
      ) : (
        <p className="text-sm leading-6 text-muted">Log a few days and a soft line will appear here.</p>
      )}
    </div>
  );
}
