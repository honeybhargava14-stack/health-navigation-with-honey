import Link from "next/link";

type RangeTabsProps = {
  value: string;
  options: readonly { value: string; label: string }[];
  basePath: string;
};

export function RangeTabs({ value, options, basePath }: RangeTabsProps) {
  return (
    <div className="grid grid-cols-4 gap-1 rounded-2xl border border-border bg-card p-1">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Link
            key={option.value}
            href={`${basePath}?range=${option.value}`}
            className={`flex min-h-10 items-center justify-center rounded-xl text-sm font-medium ${
              active ? "bg-accent text-foreground" : "text-muted"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
