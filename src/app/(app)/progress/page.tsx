import { LIMITATIONS, PROGRESS_RANGES, type ProgressRange } from "@/lib/constants";
import { formatDate, todayLocal } from "@/lib/dates";
import { getDailyLogsInRange, getProfile, requireUser } from "@/lib/data";
import { average, buildProgressSeries } from "@/lib/summaries";
import { Card, RangeTabs, SafetyNotice, Sparkline, StreakBadge } from "@health/ui";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Progress" };

const RANGE_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
] as const;

export default function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-muted">Loading your progress...</p>}>
      <ProgressContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProgressContent({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const [{ range: rangeParam }, { supabase, user }] = await Promise.all([
    searchParams,
    requireUser(),
  ]);
  const range = (
    PROGRESS_RANGES.includes(rangeParam as ProgressRange) ? rangeParam : "week"
  ) as ProgressRange;
  const today = todayLocal();
  const [profile, logs] = await Promise.all([
    getProfile(supabase, user.id),
    getDailyLogsInRange(supabase, user.id, range, today),
  ]);
  const series = buildProgressSeries(logs, range, today);
  const loggedToday = logs.some((log) => log.loggedOn === today);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Your progress</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Soft summaries of what you have shared. No judgments, just patterns.
        </p>
      </div>
      {!loggedToday ? (
        <p className="rounded-2xl border border-rose/30 bg-card px-4 py-3 text-sm leading-6">
          Honey would love a tiny check-in today when you have a moment.
        </p>
      ) : null}
      <StreakBadge count={profile?.streak_count ?? 0} />
      <RangeTabs value={range} options={RANGE_OPTIONS} basePath="/progress" />
      <SafetyNotice />
      <Sparkline label="Symptom severity" values={series.map((d) => d.avgSymptomSeverity)} />
      <Sparkline label="Mood" values={series.map((d) => d.mood)} />
      <Sparkline label="Energy" values={series.map((d) => d.energy)} />
      <Sparkline label="Stress" values={series.map((d) => d.stress)} />
      <Sparkline label="Sleep (hours)" values={series.map((d) => d.sleepHours)} max={12} />
      <Card title="Share with a clinician">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Days logged" value={String(logs.length)} />
          <Stat label="Avg mood" value={formatAvg(average(logs.map((l) => l.mood)))} />
          <Stat label="Avg stress" value={formatAvg(average(logs.map((l) => l.stress)))} />
          <Stat
            label="Avg symptom"
            value={formatAvg(
              average(
                logs
                  .map((l) => l.avgSymptomSeverity)
                  .filter((value): value is number => value != null),
              ),
            )}
          />
        </dl>
        <p className="mt-3 text-xs leading-5 text-muted">
          Window ending {formatDate(today)}. Print this page if you want a paper copy.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-xs leading-5 text-muted">
          {LIMITATIONS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-accent/60 px-3 py-3 text-center">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 font-serif text-xl font-semibold">{value}</dd>
    </div>
  );
}

function formatAvg(value: number | null) {
  return value == null ? "—" : String(value);
}
