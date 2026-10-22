import { SeverityTimeline } from "@/components/severity-timeline";
import { MIN_PATTERN_DAYS } from "@/lib/constants";
import { formatDate, todayLocal } from "@/lib/dates";
import { getCheckIns, getInvestigation, requireUser, windowStart } from "@/lib/data";
import { buildReport } from "@/lib/patterns";
import { buttonClass, Card, SafetyNotice } from "@health/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading your log...</p>}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ saved }, { supabase, user }] = await Promise.all([searchParams, requireUser()]);
  const today = todayLocal();
  const [investigation, checkIns] = await Promise.all([
    getInvestigation(supabase, user.id),
    getCheckIns(supabase, user.id, windowStart(today)),
  ]);
  const report = buildReport(checkIns, today);
  const loggedToday = report.days.at(-1)?.severity != null;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          {formatDate(report.rangeStart)} to {formatDate(report.rangeEnd)}
        </p>
      </div>
      {saved === "1" ? (
        <p className="rounded-2xl bg-accent px-4 py-3 text-sm text-foreground" role="status">
          Today&apos;s check-in is saved.
        </p>
      ) : null}
      <SafetyNotice />
      <Card title={investigation?.symptomLabel ?? "Your symptom"}>
        <p className="text-sm leading-6 text-muted">{investigation?.healthQuestion}</p>
      </Card>
      <Card title="Severity">
        <SeverityTimeline days={report.days} />
        <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
          <Stat label="Severity" value={report.averageSeverity} />
          <Stat label="Sleep" value={report.averageSleep} />
          <Stat label="Stress" value={report.averageStress} />
        </dl>
        <p className="mt-3 text-xs leading-5 text-muted">Averages use only the days you logged.</p>
      </Card>
      <Card title="Patterns">
        {report.daysLogged < MIN_PATTERN_DAYS ? (
          <p className="text-sm leading-6 text-muted">
            Log at least {MIN_PATTERN_DAYS} days in this 14-day window before pattern comparisons
            appear. You have logged {report.daysLogged} {report.daysLogged === 1 ? "day" : "days"}.
          </p>
        ) : report.comparisons.length === 0 ? (
          <p className="text-sm leading-6 text-muted">
            You have {report.daysLogged} logged days. There is not enough variation yet to compare
            higher stress, shorter sleep, or a treatment with other days. Higher stress means a
            rating of 7 or more. Shorter sleep means under 6 hours. Each comparison needs at least
            two days in both groups.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {report.comparisons.map((comparison) => (
              <article key={comparison.title}>
                <h3 className="font-medium">{comparison.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{comparison.sentence}</p>
              </article>
            ))}
          </div>
        )}
      </Card>
      <Link href="/check-in" className={buttonClass()}>
        {loggedToday ? "Update today's check-in" : "Log today"}
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-xl font-semibold">{value ?? "None"}</dd>
    </div>
  );
}
