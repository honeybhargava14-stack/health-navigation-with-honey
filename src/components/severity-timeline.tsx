type TimelineDay = {
  date: string;
  severity: number | null;
};

export function SeverityTimeline({ days }: { days: TimelineDay[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" role="list" aria-label="Severity over the last 14 days">
      {days.map((day) => (
        <div key={day.date} role="listitem" className="flex w-9 shrink-0 flex-col items-center gap-2">
          <div className="flex h-28 w-full items-end">
            <div
              className={`w-full rounded-full ${day.severity == null ? "h-1 bg-border" : "bg-primary"}`}
              style={day.severity == null ? undefined : { height: `${Math.max(8, (day.severity / 10) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-muted">{day.date.slice(5)}</span>
          <span className="sr-only">
            {day.date}: {day.severity == null ? "no entry" : `severity ${day.severity}`}
          </span>
        </div>
      ))}
    </div>
  );
}
