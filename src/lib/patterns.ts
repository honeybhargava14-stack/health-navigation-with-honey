import {
  HIGH_STRESS_THRESHOLD,
  LIMITATIONS,
  MIN_PATTERN_DAYS,
  SHORT_SLEEP_HOURS,
} from "@/lib/constants";
import { formatDate, last14Days } from "@/lib/dates";

export type CheckInRecord = {
  loggedOn: string;
  severity: number;
  sleepHours: number;
  stress: number;
  lifestyleNote: string;
  treatments: string[];
};

export type Comparison = {
  title: string;
  sentence: string;
  question: string;
};

export type PatternReport = {
  days: { date: string; severity: number | null }[];
  daysLogged: number;
  enoughData: boolean;
  averageSeverity: number | null;
  averageSleep: number | null;
  averageStress: number | null;
  peak: { date: string; severity: number } | null;
  low: { date: string; severity: number } | null;
  comparisons: Comparison[];
  notesOnHigherDays: { date: string; note: string; severity: number }[];
  doctorQuestions: string[];
  limitations: string[];
  rangeStart: string;
  rangeEnd: string;
};

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return round1(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function comparisonSentence(
  groupLabel: string,
  groupAverage: number,
  groupDays: number,
  otherAverage: number,
  otherDays: number,
) {
  return `On ${groupLabel}, average severity was ${groupAverage} across ${groupDays} days. On other days it was ${otherAverage} across ${otherDays} days. This is a correlation in your log. It does not show that this factor caused the symptom.`;
}

function buildComparison(
  title: string,
  groupLabel: string,
  group: CheckInRecord[],
  others: CheckInRecord[],
  question: string,
): Comparison | null {
  if (group.length < 2 || others.length < 2) return null;
  const groupAverage = average(group.map((entry) => entry.severity));
  const otherAverage = average(others.map((entry) => entry.severity));
  if (groupAverage == null || otherAverage == null) return null;

  return {
    title,
    sentence: comparisonSentence(
      groupLabel,
      groupAverage,
      group.length,
      otherAverage,
      others.length,
    ),
    question,
  };
}

export function buildReport(checkIns: CheckInRecord[], today: string): PatternReport {
  const days = last14Days(today);
  const range = new Set(days);
  const byDate = new Map<string, CheckInRecord>();

  for (const entry of checkIns) {
    if (range.has(entry.loggedOn)) byDate.set(entry.loggedOn, entry);
  }

  const logged = [...byDate.values()].sort((a, b) => a.loggedOn.localeCompare(b.loggedOn));
  const enoughData = logged.length >= MIN_PATTERN_DAYS;
  const peak = logged.reduce<CheckInRecord | null>(
    (best, entry) => (best == null || entry.severity > best.severity ? entry : best),
    null,
  );
  const low = logged.reduce<CheckInRecord | null>(
    (best, entry) => (best == null || entry.severity < best.severity ? entry : best),
    null,
  );

  const comparisons: Comparison[] = [];
  if (enoughData) {
    const highStress = logged.filter((entry) => entry.stress >= HIGH_STRESS_THRESHOLD);
    const calmer = logged.filter((entry) => entry.stress < HIGH_STRESS_THRESHOLD);
    const stressComparison = buildComparison(
      "Stress",
      `days you rated stress ${HIGH_STRESS_THRESHOLD} or higher`,
      highStress,
      calmer,
      `On days I rated stress ${HIGH_STRESS_THRESHOLD} or higher, my symptom rating averaged differently from calmer days. Is this worth discussing, or should I keep logging?`,
    );
    if (stressComparison) comparisons.push(stressComparison);

    const shortSleep = logged.filter((entry) => entry.sleepHours < SHORT_SLEEP_HOURS);
    const longerSleep = logged.filter((entry) => entry.sleepHours >= SHORT_SLEEP_HOURS);
    const sleepComparison = buildComparison(
      "Sleep",
      `days you slept under ${SHORT_SLEEP_HOURS} hours`,
      shortSleep,
      longerSleep,
      `On days I slept under ${SHORT_SLEEP_HOURS} hours, my symptom rating averaged differently from other days. Is sleep worth reviewing with this symptom?`,
    );
    if (sleepComparison) comparisons.push(sleepComparison);

    const treatmentNames = [...new Set(logged.flatMap((entry) => entry.treatments))];
    const treatmentComparisons = treatmentNames
      .map((name) => {
        const withTreatment = logged.filter((entry) => entry.treatments.includes(name));
        const withoutTreatment = logged.filter((entry) => !entry.treatments.includes(name));
        return buildComparison(
          name,
          `days you logged ${name}`,
          withTreatment,
          withoutTreatment,
          `I logged ${name} on some days. Average severity differed between those days and the others. What should I watch for, and what would you want me to record next?`,
        );
      })
      .filter((item): item is Comparison => item != null)
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 3);

    comparisons.push(...treatmentComparisons);
  }

  const notesOnHigherDays = [...logged]
    .filter((entry) => entry.lifestyleNote.trim().length > 0)
    .sort((a, b) => b.severity - a.severity || b.loggedOn.localeCompare(a.loggedOn))
    .slice(0, 3)
    .map((entry) => ({
      date: entry.loggedOn,
      note: entry.lifestyleNote.trim(),
      severity: entry.severity,
    }));

  const doctorQuestions = [
    ...comparisons.map((item) => item.question),
    "What other factors should I track for the next two weeks?",
    "Which part of this log would you want to review first?",
  ];

  return {
    days: days.map((date) => ({
      date,
      severity: byDate.get(date)?.severity ?? null,
    })),
    daysLogged: logged.length,
    enoughData,
    averageSeverity: average(logged.map((entry) => entry.severity)),
    averageSleep: average(logged.map((entry) => entry.sleepHours)),
    averageStress: average(logged.map((entry) => entry.stress)),
    peak: peak ? { date: peak.loggedOn, severity: peak.severity } : null,
    low: low ? { date: low.loggedOn, severity: low.severity } : null,
    comparisons,
    notesOnHigherDays,
    doctorQuestions,
    limitations: LIMITATIONS,
    rangeStart: days[0],
    rangeEnd: today,
  };
}

export function formatReportDate(isoDate: string) {
  return formatDate(isoDate);
}
