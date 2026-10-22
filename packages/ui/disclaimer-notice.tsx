export function DisclaimerNotice({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-2xl border border-border bg-sage-soft px-4 py-3 text-sm leading-6 text-foreground ${className}`}
    >
      This site is not for health emergencies. If you think you need urgent care, contact a
      nearby healthcare provider or emergency services. I do not make medical claims, and I do
      not provide diagnoses or treatment. The tool only organizes what you record so you can
      talk with a clinician. A pattern in your log is a correlation. It does not show that one
      thing caused another.
    </aside>
  );
}
