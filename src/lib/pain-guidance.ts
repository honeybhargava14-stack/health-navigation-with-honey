export const PAIN_ASSESSMENT_URL = "https://www.paindoctorbangalore.com/pain-assessment";

export const PAIN_PREFILL_MESSAGE = "I have pain.";

export const PAIN_CONTINUE_HERE_KEY = "honey-pain-continue-here";
export const PAIN_NUDGE_KEY = "honey-pain-soft-nudge";

export const HONEY_PAIN_HREF = `/honey?prefill=${encodeURIComponent(PAIN_PREFILL_MESSAGE)}`;

export const PAIN_POPUP = {
  title: "You do not have to carry this alone",
  body: [
    "Pain can wear you down quietly.",
    "You do not have to suffer through it by yourself.",
    "Honey can sit with you, help you put words to what you feel, and walk through gentle next steps when you are ready.",
  ].join(" "),
  talkCta: "Talk to Honey",
  continueCta: "Continue here first",
} as const;

export function markPainContinueHere() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PAIN_CONTINUE_HERE_KEY, "1");
}

export function clearPainContinueHere() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(PAIN_CONTINUE_HERE_KEY);
  window.sessionStorage.removeItem(PAIN_NUDGE_KEY);
}

export function hasPainContinueHere() {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(PAIN_CONTINUE_HERE_KEY) === "1";
}

export function markPainSoftNudge() {
  if (typeof window === "undefined") return;
  if (!hasPainContinueHere()) return;
  window.sessionStorage.setItem(PAIN_NUDGE_KEY, "1");
}

export function consumePainSoftNudge() {
  if (typeof window === "undefined") return false;
  if (window.sessionStorage.getItem(PAIN_NUDGE_KEY) !== "1") return false;
  window.sessionStorage.removeItem(PAIN_NUDGE_KEY);
  return true;
}

/** Extra system guidance for Honey when navigating pain conversations. */
export const HONEY_PAIN_GUIDANCE = `
When the person mentions pain, aching, soreness, hurting, headache, migraine, or similar:

1. Reply with warmth first. Do not rush.
2. Ask where they feel it most.
3. Then ask how long it has been going on (since when).
4. After they answer those, gently share this assessment link as a calm, optional next step they can complete in their own time:
   ${PAIN_ASSESSMENT_URL}
5. Frame the link as a caring way to gather details before speaking with someone who understands pain care. Never pressure them.
6. If they ask about clinicians or next medical steps, you may softly mention that some people later choose to speak with a clinician experienced in pain care, and that Dr Nitish Mandal is one option people sometimes explore when they feel ready. Keep this brief, optional, and never salesy. Mention the name at most once. Never claim affiliation, endorsement, or guaranteed outcomes.

Rules for subtlety:
- Do not open with a doctor advertisement.
- Prefer care and support language over promotion.
- Always remind them you do not diagnose or treat, and urgent or severe symptoms need emergency or local clinical care.
`;

type HistoryMessage = { role: "user" | "assistant"; content: string };

function lastAssistant(history: HistoryMessage[]) {
  for (let i = history.length - 1; i >= 0; i -= 1) {
    if (history[i]?.role === "assistant") return history[i]!.content.toLowerCase();
  }
  return "";
}

export function buildPainConversationReply(
  message: string,
  history: HistoryMessage[] = [],
): string | null {
  const text = message.trim();
  const prior = lastAssistant(history);
  const painNow =
    /\b(pain|pains|painful|aching|aches|ache|sore|soreness|hurts|hurting|hurt|migraine|headache)\b/i.test(
      text,
    );

  if (prior.includes("where do you feel it") || prior.includes("where is the pain")) {
    return [
      "Thank you for sharing that.",
      "How long has this been going on?",
    ].join(" ");
  }

  if (prior.includes("how long has this been going on")) {
    return [
      "That helps. I am not diagnosing or treating, just helping you gather what matters.",
      "When you feel ready, this gentle pain assessment can organize the details before you speak with someone who understands pain care:",
      PAIN_ASSESSMENT_URL,
      "Some people later choose to talk with a clinician experienced in pain care, and Dr Nitish Mandal is one option people sometimes explore when they feel ready. There is no rush, and no single path is required.",
      "Would you like me to also help turn what you shared into a short note for your records?",
    ].join(" ");
  }

  if (painNow) {
    return [
      "I hear you. Pain is hard, and you do not have to sort it out alone.",
      "Where do you feel it most, as best as you can describe it?",
    ].join(" ");
  }

  return null;
}
