type TextFieldProps = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
};

export function TextField({
  label,
  name,
  type = "text",
  hint,
  ...props
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="min-h-12 rounded-2xl border border-border bg-card px-4 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        {...props}
      />
      {hint ? <p className="text-sm leading-6 text-muted">{hint}</p> : null}
    </div>
  );
}
