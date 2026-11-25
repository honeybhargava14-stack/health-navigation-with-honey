/** Shared pain keyword detection for Honey v1 fallback and v2 invite. */
export const PAIN_INTENT_PATTERN =
  /\b(pain|pains|painful|aching|aches|ache|sore|soreness|hurts|hurting|hurt|migraine|headache)\b/i;

export function detectPainIntent(text: string): boolean {
  return PAIN_INTENT_PATTERN.test(text.trim());
}
