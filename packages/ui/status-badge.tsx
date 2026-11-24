type StatusBadgeProps = {
  label: string;
  tone?: "available" | "building" | "neutral";
  className?: string;
};

const tones: Record<NonNullable<StatusBadgeProps["tone"]>, string> = {
  available: "bg-sage-soft text-primary",
  building: "bg-accent text-muted",
  neutral: "bg-accent text-foreground",
};

export function StatusBadge({ label, tone = "neutral", className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {label}
    </span>
  );
}
