"use client";

import { addTreatment, removeTreatment } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import type { TreatmentOption } from "@/lib/data";
import { Button, FormError, TextField } from "@health/ui";
import { useActionState } from "react";

export function TreatmentManager({ treatments }: { treatments: TreatmentOption[] }) {
  const [state, action, pending] = useActionState(addTreatment, initialActionState);

  return (
    <div className="flex flex-col gap-4">
      <form action={action} className="flex flex-col gap-4">
        <FormError message={state.error} />
        <TextField label="Treatment name" name="name" placeholder="Magnesium, walk, inhaler..." />
        <Button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add treatment"}
        </Button>
      </form>
      {treatments.length === 0 ? (
        <p className="text-sm text-muted">Treatments you add can be checked off in each daily log.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {treatments.map((treatment) => (
            <li
              key={treatment.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border px-4 py-2"
            >
              <span>{treatment.name}</span>
              <form action={removeTreatment}>
                <input type="hidden" name="treatment_id" value={treatment.id} />
                <Button type="submit" variant="ghost" fullWidth={false} className="px-3">
                  Remove
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
