"use client";

type MicButtonProps = {
  listening: boolean;
  supported: boolean;
  onToggle: () => void;
};

export function MicButton({ listening, supported, onToggle }: MicButtonProps) {
  if (!supported) {
    return (
      <p className="text-sm leading-6 text-muted">
        Speech is not available in this browser. You can still type anything you want to share.
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`min-h-12 rounded-2xl px-4 text-sm font-medium ${
        listening
          ? "bg-rose text-primary-foreground"
          : "border border-border bg-card text-foreground"
      }`}
      aria-pressed={listening}
    >
      {listening ? "Listening… tap to stop" : "Speak how you feel"}
    </button>
  );
}
