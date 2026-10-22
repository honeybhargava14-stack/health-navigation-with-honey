"use client";

type FilterChipsProps = {
  legend: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
};

export function FilterChips({
  legend,
  options,
  value,
  onChange,
  allLabel = "All",
}: FilterChipsProps) {
  const items = [allLabel, ...options];

  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-foreground">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {items.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={selected}
              className={`min-h-11 rounded-full px-4 text-sm font-medium transition ${
                selected
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:bg-accent"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
