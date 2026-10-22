"use client";

type SearchFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchField({ label, value, onChange, placeholder }: SearchFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="resource-search" className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id="resource-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="min-h-12 rounded-2xl border border-border bg-card px-4 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}
