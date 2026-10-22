import { PrintButton } from "@/components/print-button";
import { HIGH_STRESS_THRESHOLD, MIN_PATTERN_DAYS, SHORT_SLEEP_HOURS } from "@/lib/constants";
import { formatDate, todayLocal } from "@/lib/dates";
import { getCheckIns, getInvestigation, requireUser, windowStart } from "@/lib/data";
import { buildReport } from "@/lib/patterns";
import { buttonClass, Card, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "14-day report" };

export default function ReportPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Preparing your report...</p>}>
      <ReportContent />
    </Suspense>
  );
}

async function ReportContent() {
  const { supabase, user } = await requireUser();
  const today = todayLocal();
  const [investigation, checkIns] = await Promise.all([
    getInvestigation(supabase, user.id),
    getCheckIns(supabase, user.id, windowStart(today)),
  ]);
  const report = buildReport(checkIns, today);

  return (
    <article className="flex flex-col gap-5">
      <header>
        <p className="text-sm font-medium text-primary print:text-black">Health Intelligence</p>
        <h1 className="mt-2 text-3xl font-semibold">14-day health report</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {formatDate(report.rangeStart)} to {formatDate(report.rangeEnd)}
        </p>
      </header>
      <SafetyNotice />
      <Card title={investigation?.symptomLabel ?? "Symptom"}>
        <p className="text-sm leading-6">{investigation?.healthQuestion}</p>
        {investigation ? (
          <p className="mt-2 text-sm text-muted">
            Duration: {investigation.duration}. Goal: {investigation.goal}
          </p>
        ) : null}
      </Card>
      <Card title="Observations">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-6">
          <li>
            You logged {report.daysLogged} of 14 days. Average severity was{" "}
            {report.averageSeverity ?? "not available"}, average sleep was{" "}
            {report.averageSleep ?? "not available"} hours, and average stress was{" "}
            {report.averageStress ?? "not available"}.
          </li>
          {report.peak ? (
            <li>
              Highest severity was {report.peak.severity} on {formatDate(report.peak.date)}.
              {report.low
                ? ` Lowest was ${report.low.severity} on ${formatDate(report.low.date)}.`
                : ""}
            </li>
          ) : (
            <li>There are no check-ins in this window yet.</li>
          )}
          {report.notesOnHigherDays.map((note) => (
            <li key={note.date}>
              Note on {formatDate(note.date)} (severity {note.severity}): {note.note}
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Patterns in this log">
        {report.daysLogged < MIN_PATTERN_DAYS ? (
          <p className="text-sm leading-6 text-muted">
            There is not enough data for a pattern. Log at least {MIN_PATTERN_DAYS} days in this
            window. You have logged {report.daysLogged}.
          </p>
        ) : report.comparisons.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            You have enough days to look, but not enough variation to compare groups. Higher
            stress means {HIGH_STRESS_THRESHOLD} or higher. Shorter sleep means under{" "}
            {SHORT_SLEEP_HOURS} hours. A comparison needs at least two days in each group.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-6 text-muted">
              Higher stress means a rating of {HIGH_STRESS_THRESHOLD} or higher. Shorter sleep
              means under {SHORT_SLEEP_HOURS} hours.
            </p>
            {report.comparisons.map((comparison) => (
              <section key={comparison.title}>
                <h3 className="font-medium">{comparison.title}</h3>
                <p className="mt-1 text-sm leading-6">{comparison.sentence}</p>
              </section>
            ))}
          </div>
        )}
      </Card>
      <Card title="Limitations">
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-6">
          {report.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
      <Card title="Questions for a clinician">
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-6">
          {report.doctorQuestions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </Card>
      <div className="no-print flex flex-col gap-3">
        <PrintButton />
        <Link href="/api/export" className={buttonClass("secondary")}>
          Download CSV
        </Link>
      </div>
    </article>
  );
}
