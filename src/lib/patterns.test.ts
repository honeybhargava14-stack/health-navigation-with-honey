import { average, nextStreak, rangeStart } from "@/lib/summaries";
import assert from "node:assert/strict";
import { test } from "node:test";

test("average returns null for empty lists", () => {
  assert.equal(average([]), null);
});

test("average rounds to one decimal", () => {
  assert.equal(average([1, 2, 3]), 2);
  assert.equal(average([1, 2]), 1.5);
});

test("rangeStart for week is 6 days before today", () => {
  assert.equal(rangeStart("week", "2026-11-24"), "2026-11-18");
});

test("nextStreak continues consecutive days", () => {
  assert.deepEqual(nextStreak("2026-11-23", 2, "2026-11-24", "2026-11-24"), {
    streak: 3,
    lastCheckInOn: "2026-11-24",
  });
});

test("nextStreak resets after a gap", () => {
  assert.deepEqual(nextStreak("2026-11-20", 5, "2026-11-24", "2026-11-24"), {
    streak: 1,
    lastCheckInOn: "2026-11-24",
  });
});
