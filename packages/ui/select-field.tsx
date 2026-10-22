type SelectFieldProps = {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
  required?: boolean;
  hint?: string;
};

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  required,
  hint,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="min-h-12 rounded-2xl border border-border bg-card px-4 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        <option value="" disabled>
          Choose one
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {hint ? <p className="text-sm leading-6 text-muted">{hint}</p> : null}
    </div>
  );
}
