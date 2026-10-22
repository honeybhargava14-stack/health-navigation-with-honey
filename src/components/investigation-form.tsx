"use client";

import { completeOnboarding, updateInvestigation } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import { DURATION_OPTIONS } from "@/lib/constants";
import type { Investigation } from "@/lib/data";
import { Button, FormError, SelectField, TextArea, TextField } from "@health/ui";
import { useActionState } from "react";

type InvestigationFormProps = {
  mode: "onboarding" | "settings";
  investigation?: Investigation | null;
  displayName?: string;
};

export function InvestigationForm({ mode, investigation, displayName = "" }: InvestigationFormProps) {
  const action = mode === "onboarding" ? completeOnboarding : updateInvestigation;
  const [state, formAction, pending] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormError message={state.error} />
      {mode === "onboarding" ? (
        <TextField label="What should we call you?" name="display_name" defaultValue={displayName} />
      ) : null}
      <TextArea
        label="Your health question"
        name="health_question"
        required
        defaultValue={investigation?.healthQuestion}
        placeholder="Why does this symptom flare on some days and not others?"
        hint="One question you want a clearer record for."
      />
      <TextField
        label="Symptom you are tracking"
        name="symptom_label"
        required
        defaultValue={investigation?.symptomLabel}
        placeholder="Headache"
      />
      <SelectField
        label="How long has this been happening?"
        name="duration"
        required
        options={DURATION_OPTIONS}
        defaultValue={investigation?.duration}
      />
      <TextArea
        label="What do you hope to learn?"
        name="goal"
        required
        defaultValue={investigation?.goal}
        placeholder="Whether sleep or stress shows up alongside worse days."
      />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : mode === "onboarding" ? "Start my log" : "Save investigation"}
      </Button>
    </form>
  );
}
