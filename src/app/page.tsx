import { buttonClass, Card, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Health Intelligence",
  description:
    "Track a recurring symptom, notice personal patterns, and prepare questions for a clinician.",
};

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-6 px-5 py-8">
      <p className="text-sm font-medium text-primary">Health Intelligence</p>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Understand what keeps coming back.
        </h1>
        <p className="text-lg leading-8 text-muted">
          Track a recurring symptom in about a minute a day. See how sleep, stress, and
          treatments line up, then bring a 14-day summary to your clinician.
        </p>
      </div>
      <SafetyNotice />
      <div className="grid gap-3">
        <Card title="One question">
          <p className="text-sm leading-6 text-muted">
            Start with the health question you want a clearer record for.
          </p>
        </Card>
        <Card title="A short daily log">
          <p className="text-sm leading-6 text-muted">
            Rate the symptom, sleep, stress, and what you tried.
          </p>
        </Card>
        <Card title="A visit-ready report">
          <p className="text-sm leading-6 text-muted">
            Observations, limits, and questions. No diagnosis.
          </p>
        </Card>
      </div>
      <div className="flex flex-col gap-3">
        <Link href="/signup" className={buttonClass()}>
          Create account
        </Link>
        <Link href="/login" className={buttonClass("secondary")}>
          Sign in
        </Link>
      </div>
    </main>
  );
}
