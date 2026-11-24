import { addDays, todayLocal } from "@/lib/dates";
import type { ProgressRange } from "@/lib/constants";

export type DailyLogSummary = {
  loggedOn: string;
  sleepHours: number;
  stress: number;
  mood: number;
  energy: number;
  overallNote: string;
  avgSymptomSeverity: number | null;
};

export function rangeStart(range: ProgressRange, today = todayLocal()) {
  if (range === "day") return today;
  if (range === "week") return addDays(today, -6);
  if (range === "month") return addDays(today, -29);
  return addDays(today, -364);
}

export function average(values: number[]) {
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

export function buildProgressSeries(logs: DailyLogSummary[], range: ProgressRange, today = todayLocal()) {
  const start = rangeStart(range, today);
  const days: string[] = [];
  let cursor = start;
  while (cursor <= today) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }

  const byDate = new Map(logs.map((log) => [log.loggedOn, log]));
  return days.map((day) => {
    const log = byDate.get(day);
    return {
      date: day,
      sleepHours: log?.sleepHours ?? null,
      stress: log?.stress ?? null,
      mood: log?.mood ?? null,
      energy: log?.energy ?? null,
      avgSymptomSeverity: log?.avgSymptomSeverity ?? null,
    };
  });
}

export function nextStreak(
  lastCheckInOn: string | null,
  currentStreak: number,
  loggedOn: string,
  today = todayLocal(),
) {
  if (loggedOn !== today && loggedOn !== addDays(today, -1)) {
    return { streak: currentStreak, lastCheckInOn };
  }
  if (!lastCheckInOn) return { streak: 1, lastCheckInOn: loggedOn };
  if (lastCheckInOn === loggedOn) return { streak: Math.max(currentStreak, 1), lastCheckInOn };
  if (lastCheckInOn === addDays(loggedOn, -1)) {
    return { streak: currentStreak + 1, lastCheckInOn: loggedOn };
  }
  return { streak: 1, lastCheckInOn: loggedOn };
}
