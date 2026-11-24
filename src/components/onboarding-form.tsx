"use client";

import { completeOnboarding } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import {
  APP_GOAL_OPTIONS,
  BODY_AREA_OPTIONS,
  DIAGNOSED_STATUS_OPTIONS,
  DIAGNOSIS_STAGE_OPTIONS,
  DURATION_OPTIONS,
  SYMPTOM_CATEGORY_OPTIONS,
} from "@/lib/constants";
import { Button, FormError } from "@health/ui";
import { useActionState, useState } from "react";

type SymptomDraft = {
  label: string;
  category: string;
  duration: string;
  bodyArea: string;
  notes: string;
};

const emptySymptom = (): SymptomDraft => ({
  label: "",
  category: "",
  duration: "",
  bodyArea: "",
  notes: "",
});

export function OnboardingForm({ displayName = "" }: { displayName?: string }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(displayName);
  const [appGoal, setAppGoal] = useState("");
  const [appGoalNote, setAppGoalNote] = useState("");
  const [diagnosed, setDiagnosed] = useState("unsure");
  const [diagnosisStage, setDiagnosisStage] = useState("");
  const [symptoms, setSymptoms] = useState<SymptomDraft[]>([emptySymptom()]);
  const [state, formAction, pending] = useActionState(completeOnboarding, initialActionState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormError message={state.error} />
      <input type="hidden" name="display_name" value={name} />
      <input type="hidden" name="app_goal" value={appGoal} />
      <input type="hidden" name="app_goal_note" value={appGoalNote} />
      <input type="hidden" name="diagnosed_status" value={diagnosed} />
      <input type="hidden" name="diagnosis_stage" value={diagnosisStage} />
      <input type="hidden" name="symptom_count" value={symptoms.length} />
      {symptoms.map((symptom, index) => (
        <div key={index} className="hidden">
          <input name={`symptom_label_${index}`} value={symptom.label} readOnly />
          <input name={`symptom_category_${index}`} value={symptom.category} readOnly />
          <input name={`symptom_duration_${index}`} value={symptom.duration} readOnly />
          <input name={`symptom_body_area_${index}`} value={symptom.bodyArea} readOnly />
          <input name={`symptom_notes_${index}`} value={symptom.notes} readOnly />
        </div>
      ))}

      {step === 0 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-muted">
            Hi. I am Honey. This space is for you to be heard, gently and without rush.
          </p>
          <label className="flex flex-col gap-2 text-sm font-medium">
            What should we call you?
            <input
              className="min-h-12 rounded-2xl border border-border bg-card px-4 text-base"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            What brings you here?
            <select
              className="min-h-12 rounded-2xl border border-border bg-card px-4 text-base"
              value={appGoal}
              onChange={(event) => setAppGoal(event.target.value)}
              required
            >
              <option value="">Choose one</option>
              {APP_GOAL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="font-normal text-muted">There is no wrong answer. Choose what feels closest.</span>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Anything else you want Honey to know?
            <textarea
              className="min-h-24 rounded-2xl border border-border bg-card px-4 py-3 text-base"
              value={appGoalNote}
              onChange={(event) => setAppGoalNote(event.target.value)}
              placeholder="Optional. A sentence is enough."
            />
          </label>
          <Button type="button" onClick={() => setStep(1)} disabled={!appGoal}>
            Continue
          </Button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-muted">
            Some people arrive with a diagnosis. Some are still figuring things out. Both belong here.
          </p>
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-foreground">
              Have you already been diagnosed?
            </legend>
            {DIAGNOSED_STATUS_OPTIONS.map((option) => (
              <label key={option.value} className="flex min-h-12 items-center gap-3 text-base">
                <input
                  type="radio"
                  value={option.value}
                  checked={diagnosed === option.value}
                  onChange={() => setDiagnosed(option.value)}
                  className="size-5 accent-primary"
                />
                {option.label}
              </label>
            ))}
          </fieldset>
          {diagnosed === "yes" ? (
            <label className="flex flex-col gap-2 text-sm font-medium">
              Where are you in that journey?
              <select
                className="min-h-12 rounded-2xl border border-border bg-card px-4 text-base"
                value={diagnosisStage}
                onChange={(event) => setDiagnosisStage(event.target.value)}
              >
                <option value="">Choose one</option>
                {DIAGNOSIS_STAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={diagnosed === "yes" && !diagnosisStage}
            >
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-muted">
            Tell Honey what you would like to track. You can add more later.
          </p>
          {symptoms.map((symptom, index) => (
            <div key={index} className="rounded-3xl border border-border bg-card p-4">
              <p className="mb-3 text-sm font-medium text-foreground">Symptom {index + 1}</p>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-2 text-sm font-medium">
                  What do you call it?
                  <input
                    className="min-h-12 rounded-2xl border border-border bg-background px-4 text-base"
                    value={symptom.label}
                    onChange={(event) =>
                      setSymptoms((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, label: event.target.value } : item,
                        ),
                      )
                    }
                    placeholder="Headache, fatigue, stomach ache…"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Category
                  <select
                    className="min-h-12 rounded-2xl border border-border bg-background px-4 text-base"
                    value={symptom.category}
                    onChange={(event) =>
                      setSymptoms((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, category: event.target.value } : item,
                        ),
                      )
                    }
                  >
                    <option value="">Choose one</option>
                    {SYMPTOM_CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  How long has this been happening?
                  <select
                    className="min-h-12 rounded-2xl border border-border bg-background px-4 text-base"
                    value={symptom.duration}
                    onChange={(event) =>
                      setSymptoms((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, duration: event.target.value } : item,
                        ),
                      )
                    }
                  >
                    <option value="">Choose one</option>
                    {DURATION_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Where do you feel it most?
                  <select
                    className="min-h-12 rounded-2xl border border-border bg-background px-4 text-base"
                    value={symptom.bodyArea}
                    onChange={(event) =>
                      setSymptoms((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, bodyArea: event.target.value } : item,
                        ),
                      )
                    }
                  >
                    <option value="">Choose one</option>
                    {BODY_AREA_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-medium">
                  Optional note
                  <textarea
                    className="min-h-20 rounded-2xl border border-border bg-background px-4 py-3 text-base"
                    value={symptom.notes}
                    onChange={(event) =>
                      setSymptoms((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, notes: event.target.value } : item,
                        ),
                      )
                    }
                    placeholder="Anything that helps you remember this one."
                  />
                </label>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() => setSymptoms((current) => [...current, emptySymptom()])}
          >
            Add another symptom
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-col gap-4">
          <p className="font-serif text-2xl font-semibold text-foreground">You are not alone in this.</p>
          <p className="text-sm leading-6 text-muted">
            Honey will check in with you gently. You can speak or type. Your words stay with your
            account, and you can leave whenever you need a pause.
          </p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : "Start with Honey"}
            </Button>
          </div>
        </div>
      ) : null}
    </form>
  );
}
