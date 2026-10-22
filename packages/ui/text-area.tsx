type TextAreaProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  maxLength?: number;
  rows?: number;
};

export function TextArea({ label, name, hint, rows = 3, ...props }: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        className="rounded-2xl border border-border bg-card px-4 py-3 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        {...props}
      />
      {hint ? <p className="text-sm leading-6 text-muted">{hint}</p> : null}
    </div>
  );
}
