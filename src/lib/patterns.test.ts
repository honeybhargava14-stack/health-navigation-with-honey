import assert from "node:assert/strict";
import { buildReport, type CheckInRecord } from "./patterns";

function entry(partial: Partial<CheckInRecord> & Pick<CheckInRecord, "loggedOn" | "severity">): CheckInRecord {
  return {
    sleepHours: 7,
    stress: 3,
    lifestyleNote: "",
    treatments: [],
    ...partial,
  };
}

const today = "2026-10-19";

const shortLog = ["2026-10-17", "2026-10-18", "2026-10-19"].map((loggedOn, index) =>
  entry({ loggedOn, severity: index + 2 }),
);

const shortReport = buildReport(shortLog, today);
assert.equal(shortReport.enoughData, false);
assert.equal(shortReport.days.length, 14);
assert.equal(shortReport.comparisons.length, 0);
assert.equal(shortReport.daysLogged, 3);
assert.equal(shortReport.doctorQuestions.length, 2);

const patternLog: CheckInRecord[] = [
  entry({ loggedOn: "2026-10-12", severity: 8, stress: 8, sleepHours: 5, treatments: ["Magnesium"], lifestyleNote: "Short night" }),
  entry({ loggedOn: "2026-10-13", severity: 7, stress: 9, sleepHours: 4.5, treatments: ["Magnesium"] }),
  entry({ loggedOn: "2026-10-14", severity: 3, stress: 2, sleepHours: 8 }),
  entry({ loggedOn: "2026-10-15", severity: 2, stress: 1, sleepHours: 7.5 }),
  entry({ loggedOn: "2026-10-16", severity: 4, stress: 3, sleepHours: 8, treatments: ["Walk"] }),
  entry({ loggedOn: "2026-10-17", severity: 6, stress: 7, sleepHours: 5.5, treatments: ["Magnesium"] }),
  entry({ loggedOn: "2026-10-18", severity: 3, stress: 2, sleepHours: 7 }),
  entry({ loggedOn: "2026-10-19", severity: 2, stress: 1, sleepHours: 8, treatments: ["Walk"] }),
  entry({ loggedOn: "2026-09-01", severity: 10, stress: 10, sleepHours: 2 }),
];

const report = buildReport(patternLog, today);
assert.equal(report.enoughData, true);
assert.equal(report.daysLogged, 8);
assert.equal(report.comparisons.some((item) => item.title === "Stress"), true);
assert.equal(report.comparisons.some((item) => item.title === "Sleep"), true);
assert.equal(report.comparisons.some((item) => item.title === "Magnesium"), true);
assert.equal(report.comparisons.some((item) => item.sentence.includes("does not show")), true);
assert.equal(report.notesOnHigherDays[0]?.note, "Short night");
assert.equal(report.days[0]?.date, "2026-10-06");
assert.equal(report.days.at(-1)?.severity, 2);

console.log("pattern checks passed");
