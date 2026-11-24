import { buildPainConversationReply } from "@/lib/pain-guidance";

const URGENT =
  /\b(chest pain|can'?t breathe|cannot breathe|suicidal|kill myself|overdose|stroke|unconscious|severe bleeding|emergency)\b/i;

type HistoryMessage = { role: "user" | "assistant"; content: string };

export function buildHoneyFallbackReply(
  message: string,
  history: HistoryMessage[] = [],
): string {
  const text = message.trim();

  if (URGENT.test(text)) {
    return [
      "I hear how serious this sounds, and I want you safe.",
      "Please contact emergency services or a nearby healthcare provider right away.",
      "I can still help you jot down what happened after you are somewhere safe, but I cannot replace urgent care.",
    ].join(" ");
  }

  const painReply = buildPainConversationReply(text, history);
  if (painReply) return painReply;

  if (/\b(tired|fatigue|exhausted|no energy)\b/i.test(text)) {
    return [
      "Feeling tired like that is real, and it deserves space.",
      "I can help you record energy, sleep, and anything else you noticed today so the picture is clearer later.",
      "I won't guess a medical cause. What would feel most useful right now: logging today, or preparing questions for a visit?",
    ].join(" ");
  }

  if (/\b(appointment|doctor|specialist|visit|consult)\b/i.test(text)) {
    return [
      "I can help you prepare for that conversation.",
      "We can gather your top symptoms, questions you want answered, and anything you hope the clinician understands.",
      "What visit are you getting ready for?",
    ].join(" ");
  }

  return [
    "I'm here with you. Tell me a little more about what you're feeling, what you want to log, or what visit you're preparing for.",
    "I don't diagnose or prescribe. I help you organize your experience so you can talk with a clinician with more clarity.",
    "What would help most right now?",
  ].join(" ");
}

export function isGatewayBillingError(error: unknown): boolean {
  const raw =
    error instanceof Error
      ? `${error.message} ${error.cause instanceof Error ? error.cause.message : ""}`
      : String(error);
  return /credit card|customer_verification|unlock your free credits/i.test(raw);
}
