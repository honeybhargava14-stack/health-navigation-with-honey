"use client";

import { Button, Card } from "@health/ui";
import { useState } from "react";

type VisitPrepClientProps = {
  appointmentId: string;
  doctorName: string;
  specialty: string;
  reason: string;
  symptoms: { label: string; category: string }[];
  recentNotes: string[];
};

export function VisitPrepClient(props: VisitPrepClientProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [advisory, setAdvisory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/visit-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
      });
      const data = (await response.json()) as {
        questions?: string[];
        advisory?: string;
        error?: string;
      };
      if (!response.ok) {
        setError(data.error ?? "Could not prepare questions right now.");
        return;
      }
      setQuestions(data.questions ?? []);
      setAdvisory(data.advisory ?? "");
    } catch {
      setError("Could not prepare questions right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Questions you might ask">
      <Button type="button" onClick={generate} disabled={loading}>
        {loading ? "Preparing..." : "Suggest gentle questions"}
      </Button>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
      {advisory ? <p className="mt-4 text-sm leading-6 text-muted">{advisory}</p> : null}
      {questions.length > 0 ? (
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      ) : null}
    </Card>
  );
}
