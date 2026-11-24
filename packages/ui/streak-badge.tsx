type StreakBadgeProps = {
  count: number;
};

export function StreakBadge({ count }: StreakBadgeProps) {
  if (count <= 0) {
    return (
      <p className="rounded-2xl bg-sage-soft px-4 py-3 text-sm leading-6 text-foreground">
        Today is a gentle place to begin. Honey is here when you are ready.
      </p>
    );
  }

  return (
    <p className="rounded-2xl bg-sage-soft px-4 py-3 text-sm leading-6 text-foreground">
      {count} {count === 1 ? "day" : "days"} of showing up for yourself. That matters.
    </p>
  );
}
