type MonthCalendarProps = {
  year: number;
  month: number;
  markedDates: string[];
  selectedDate?: string;
  onSelectHref?: (isoDate: string) => string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthCalendar({
  year,
  month,
  markedDates,
  selectedDate,
  onSelectHref,
}: MonthCalendarProps) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const marked = new Set(markedDates);
  const cells: (number | null)[] = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = first.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="rounded-3xl border border-border bg-card p-4">
      <p className="mb-3 text-center font-serif text-lg font-semibold">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="min-h-10" />;
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isMarked = marked.has(iso);
          const isSelected = selectedDate === iso;
          const className = `relative flex min-h-10 items-center justify-center rounded-xl text-sm ${
            isSelected ? "bg-primary text-primary-foreground" : isMarked ? "bg-sage-soft text-foreground" : "text-foreground"
          }`;
          if (onSelectHref) {
            return (
              <a key={iso} href={onSelectHref(iso)} className={className}>
                {day}
                {isMarked ? (
                  <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-rose" />
                ) : null}
              </a>
            );
          }
          return (
            <div key={iso} className={className}>
              {day}
              {isMarked ? (
                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-rose" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
