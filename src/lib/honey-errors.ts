export function formatHoneyError(error: unknown): string {
  const raw =
    error instanceof Error
      ? `${error.message} ${error.cause instanceof Error ? error.cause.message : ""}`
      : String(error);

  if (/credit card|customer_verification|unlock your free credits/i.test(raw)) {
    return "Honey's AI helper needs a payment method on Vercel AI Gateway before it can reply. Add a card in your Vercel AI Gateway settings, then try again.";
  }

  if (/API key|unauthorized|401|403/i.test(raw)) {
    return "Honey's AI helper is not configured correctly right now.";
  }

  return "Honey could not reply just now. Please try again in a moment.";
}
