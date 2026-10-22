"use client";

import { useState } from "react";

type SeverityControlProps = {
  label: string;
  name: string;
  hint?: string;
  min?: number;
  max?: number;
  defaultValue?: number;
};

export function SeverityControl({
  label,
  name,
  hint,
  min = 0,
  max = 10,
  defaultValue = 5,
}: SeverityControlProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <span className="text-lg font-semibold text-primary" aria-hidden="true">
          {value}
        </span>
      </div>
      <input
        id={name}
        name={name}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="h-12 w-full accent-primary"
      />
      {hint ? <p className="text-sm leading-6 text-muted">{hint}</p> : null}
    </div>
  );
}
