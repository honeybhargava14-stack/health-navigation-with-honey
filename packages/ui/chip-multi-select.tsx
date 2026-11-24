"use client";

type ChipMultiSelectProps = {
  label: string;
  name: string;
  options: readonly string[];
  defaultSelected?: string[];
  hint?: string;
};

export function ChipMultiSelect({
  label,
  name,
  options,
  defaultSelected = [],
  hint,
}: ChipMultiSelectProps) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = defaultSelected.includes(option);
          return (
            <label
              key={option}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm has-[:checked]:border-primary has-[:checked]:bg-sage-soft"
            >
              <input
                type="checkbox"
                name={name}
                value={option}
                defaultChecked={checked}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
      {hint ? <p className="text-sm leading-6 text-muted">{hint}</p> : null}
    </fieldset>
  );
}
