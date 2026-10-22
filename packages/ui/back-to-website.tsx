import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function BackToWebsite({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline ${className}`}
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Back to website
    </Link>
  );
}
