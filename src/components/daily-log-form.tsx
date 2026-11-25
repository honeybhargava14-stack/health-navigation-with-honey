"use client";

import { useReportPainText } from "@/components/honey-widget/pain-intent-context";
import { saveDailyLog } from "@/lib/actions";
import { initialActionState } from "@/lib/action-state";
import type { Symptom, TreatmentOption } from "@/lib/data";
import {
  Button,
  FormError,
  MicButton,
  SeverityControl,
  TextArea,
  TextField,
} from "@health/ui";
import { useActionState, useEffect, useRef, useState } from "react";

type DailyLogFormProps = {
  loggedOn: string;
  sleepHours: number;
  stress: number;
  mood: number;
  energy: number;
  overallNote: string;
  rawSpeechTranscript: string;
  symptoms: Symptom[];
  symptomSeverities: Record<string, number>;
  symptomNotes: Record<string, string>;
  treatments: (TreatmentOption & { taken: boolean })[];
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

export function DailyLogForm({
  loggedOn,
  sleepHours,
  stress,
  mood,
  energy,
  overallNote,
  rawSpeechTranscript,
  symptoms,
  symptomSeverities,
  symptomNotes,
  treatments,
}: DailyLogFormProps) {
  const [state, action, pending] = useActionState(saveDailyLog, initialActionState);
  const [note, setNote] = useState(overallNote);
  const [speech, setSpeech] = useState(rawSpeechTranscript);
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const reportPainText = useReportPainText();

  useEffect(() => {
    reportPainText(`${note}\n${speech}`);
  }, [note, speech, reportPainText]);

  useEffect(() => {
    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? (
            window as unknown as {
              SpeechRecognition?: new () => SpeechRecognitionLike;
              webkitSpeechRecognition?: new () => SpeechRecognitionLike;
            }
          ).SpeechRecognition ||
          (
            window as unknown as {
              webkitSpeechRecognition?: new () => SpeechRecognitionLike;
            }
          ).webkitSpeechRecognition
        : undefined;
    setSupported(Boolean(SpeechRecognitionCtor));
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
      setSpeech(transcript);
      setNote((current) => (current.trim() ? current : transcript));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  async function categorizeSpeech() {
    if (!speech.trim()) return;
    setSuggestion("Listening through your words…");
    try {
      const response = await fetch("/api/ai/categorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: speech, symptoms: symptoms.map((s) => ({ id: s.id, label: s.label, category: s.category })) }),
      });
      const data = (await response.json()) as {
        summary?: string;
        error?: string;
      };
      if (!response.ok) {
        setSuggestion(data.error ?? "Honey could not sort that just now. Your words are still saved below.");
        return;
      }
      if (data.summary) {
        setNote((current) => (current.trim() ? `${current}\n\n${data.summary}` : data.summary!));
      }
      setSuggestion(data.summary ?? "Honey sorted a few notes for you. Review before saving.");
    } catch {
      setSuggestion("Honey could not reach the helper right now. You can still save what you wrote.");
    }
  }

  function toggleMic() {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
      void categorizeSpeech();
      return;
    }
    recognition.start();
    setListening(true);
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <FormError message={state.error} />
      <input type="hidden" name="logged_on" value={loggedOn} />
      <input type="hidden" name="raw_speech_transcript" value={speech} />

      <div className="flex flex-col gap-2">
        <MicButton listening={listening} supported={supported} onToggle={toggleMic} />
        {suggestion ? <p className="text-sm leading-6 text-muted">{suggestion}</p> : null}
      </div>

      <SeverityControl label="Mood today" name="mood" defaultValue={mood} hint="0 is very low. 10 is bright." />
      <SeverityControl label="Energy today" name="energy" defaultValue={energy} hint="0 is drained. 10 is steady." />
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
      <SeverityControl label="Stress today" name="stress" defaultValue={stress} hint="0 is calm. 10 is overwhelmed." />

      {symptoms.map((symptom) => (
        <div key={symptom.id} className="rounded-3xl border border-border bg-card p-4">
          <input type="hidden" name="symptom_id" value={symptom.id} />
          <SeverityControl
            label={`${symptom.label} severity`}
            name={`severity_${symptom.id}`}
            defaultValue={symptomSeverities[symptom.id] ?? 0}
            hint="0 is none. 10 is the hardest this symptom feels for you."
          />
          <div className="mt-3">
            <TextArea
              label="Note for this symptom"
              name={`note_${symptom.id}`}
              defaultValue={symptomNotes[symptom.id] ?? ""}
              maxLength={300}
              hint="Optional."
            />
          </div>
        </div>
      ))}

      <TextArea
        label="How are you, in your own words?"
        name="overall_note"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        maxLength={1000}
        hint="Optional. A sentence is enough. Honey is listening."
        placeholder="I woke up sore… the afternoon felt easier…"
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
        <TextField
          label="Add a treatment"
          name="new_treatment"
          placeholder="Optional"
          hint="Saved to your list for next time."
        />
      </fieldset>

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save today's check-in"}
      </Button>
    </form>
  );
}
