const PAIN_PATTERN =
  /\b(pain|pains|painful|aching|aches|ache|sore|soreness|hurts|hurting|hurt|migraine|headache|back.?ache|stomachache|tooth.?ache)\b/i;

const PAIN_CATEGORIES = new Set(["Pain", "Headache or migraine", "Joint or muscle"]);

export function mentionsPain(value: string): boolean {
  const text = value.trim();
  if (!text) return false;
  if (PAIN_CATEGORIES.has(text)) return true;
  return PAIN_PATTERN.test(text);
}

export const PAIN_MENTION_EVENT = "honey:pain-mention";

export function notifyPainMention(detail?: { source?: string }) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PAIN_MENTION_EVENT, { detail }));
}
