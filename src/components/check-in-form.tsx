"use client";

import { saveCheckIn } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import type { TreatmentOption } from "@/lib/data";
import { Button, FormError, SeverityControl, TextArea, TextField } from "@health/ui";
import { useActionState } from "react";

type CheckInFormProps = {
  loggedOn: string;
  severity: number;
  sleepHours: number;
  stress: number;
  lifestyleNote: string;
  treatments: (TreatmentOption & { taken: boolean })[];
};

export function CheckInForm({
  loggedOn,
  severity,
  sleepHours,
  stress,
  lifestyleNote,
  treatments,
}: CheckInFormProps) {
  const [state, action, pending] = useActionState(saveCheckIn, initialActionState);

  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={state.error} />
      <input type="hidden" name="logged_on" value={loggedOn} />
      <SeverityControl
        label="Symptom severity"
        name="severity"
        defaultValue={severity}
        hint="0 is none. 10 is the worst you can imagine for this symptom."
      />
      <TextField
        label="Sleep last night"
        name="sleep_hours"
        type="number"
        min={0}
        max={24}
        step={0.5}
        defaultValue={sleepHours}
        required
        hint="Hours, to the nearest half hour."
      />
      <SeverityControl
        label="Stress today"
        name="stress"
        defaultValue={stress}
        hint="0 is calm. 10 is overwhelmed."
      />
      <TextArea
        label="Lifestyle note"
        name="lifestyle_note"
        defaultValue={lifestyleNote}
        maxLength={500}
        hint="Optional. A sentence is enough."
        placeholder="Late meal, travel, skipped a walk..."
      />
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-foreground">Treatments taken today</legend>
        {treatments.length === 0 ? (
          <p className="text-sm text-muted">No saved treatments yet. Add one below if you want.</p>
        ) : (
          treatments.map((treatment) => (
            <label key={treatment.id} className="flex min-h-12 items-center gap-3 text-base">
              <input
                type="checkbox"
                name="treatment_id"
                value={treatment.id}
                defaultChecked={treatment.taken}
                className="size-5 accent-primary"
              />
              {treatment.name}
            </label>
          ))
        )}
      </fieldset>
      <TextField
        label="Add a treatment"
        name="new_treatment"
        placeholder="Optional"
        hint="Saved to your list and marked for today."
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save today's check-in"}
      </Button>
    </form>
  );
}
