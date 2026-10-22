import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "border border-border bg-card text-foreground hover:bg-accent",
  ghost: "bg-transparent text-foreground hover:bg-accent",
  danger: "bg-danger text-white hover:bg-danger/90",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  className = "",
  fullWidth = true,
) {
  return `inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-base font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${fullWidth ? "w-full" : ""} ${variants[variant]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  className = "",
  fullWidth = true,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, className, fullWidth)} {...props} />
  );
}
