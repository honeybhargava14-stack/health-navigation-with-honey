import Link from "next/link";
import { DisclaimerNotice } from "./disclaimer-notice";

type FooterLink = {
  href: string;
  label: string;
};

type SiteFooterProps = {
  brand: string;
  wordmark?: string;
  links: readonly FooterLink[];
};

export function SiteFooter({ brand, wordmark, links }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-accent/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-xl font-semibold">{brand}</p>
            {wordmark ? <p className="mt-1 text-sm text-muted">{wordmark}</p> : null}
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
              You deserve to be heard, understood, and supported in your healthcare journey.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm font-medium text-foreground hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <DisclaimerNotice />
      </div>
    </footer>
  );
}
