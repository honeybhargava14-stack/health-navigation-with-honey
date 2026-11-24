"use client";

import { addSymptom, deactivateSymptom } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import {
  BODY_AREA_OPTIONS,
  DURATION_OPTIONS,
  SYMPTOM_CATEGORY_OPTIONS,
} from "@/lib/constants";
import type { Symptom } from "@/lib/data";
import { Button, FormError, SelectField, TextArea, TextField } from "@health/ui";
import { useActionState } from "react";

export function SymptomManager({ symptoms }: { symptoms: Symptom[] }) {
  const [state, action, pending] = useActionState(addSymptom, initialActionState);

  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col gap-3">
        {symptoms.length === 0 ? (
          <li className="text-sm text-muted">No active symptoms yet.</li>
        ) : (
          symptoms.map((symptom) => (
            <li
              key={symptom.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-border px-4 py-3"
            >
              <div>
                <p className="font-medium">{symptom.label}</p>
                <p className="text-sm text-muted">
                  {symptom.category}
                  {symptom.body_area ? ` · ${symptom.body_area}` : ""}
                </p>
              </div>
              <form action={deactivateSymptom}>
                <input type="hidden" name="symptom_id" value={symptom.id} />
                <button type="submit" className="text-sm text-muted underline-offset-2 hover:underline">
                  Archive
                </button>
              </form>
            </li>
          ))
        )}
      </ul>
      <form action={action} className="flex flex-col gap-4">
        <FormError message={state.error} />
        <TextField label="Symptom name" name="label" required placeholder="Headache" />
        <SelectField label="Category" name="category" required options={SYMPTOM_CATEGORY_OPTIONS} />
        <SelectField label="Duration" name="duration" options={DURATION_OPTIONS} />
        <SelectField label="Body area" name="body_area" options={BODY_AREA_OPTIONS} />
        <TextArea label="Notes" name="notes" />
        <Button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add symptom"}
        </Button>
      </form>
    </div>
  );
}
