"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { buttonClass } from "./button";

type NavLink = {
  href: string;
  label: string;
};

type SiteHeaderProps = {
  brand: string;
  wordmark?: string;
  signedIn: boolean;
  links: readonly NavLink[];
};

export function SiteHeader({ brand, wordmark, signedIn, links }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <header className="border-b border-border bg-background/90 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="min-w-0">
          <span className="font-serif block text-lg leading-tight font-semibold text-foreground">
            {brand}
          </span>
          {wordmark ? <span className="block text-xs text-muted">{wordmark}</span> : null}
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <NavItem
              key={link.href}
              link={link}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          ))}
          <AuthActions signedIn={signedIn} />
        </nav>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-border bg-card lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>
      {open ? (
        <nav id={menuId} aria-label="Mobile" className="border-t border-border px-5 py-4 lg:hidden">
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <NavItem
                  link={link}
                  pathname={pathname}
                  className="flex min-h-11 items-center"
                  onNavigate={() => setOpen(false)}
                />
              </li>
            ))}
            <li className="pt-2">
              <AuthActions signedIn={signedIn} stacked />
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function NavItem({
  link,
  pathname,
  className = "",
  onNavigate,
}: {
  link: NavLink;
  pathname: string;
  className?: string;
  onNavigate?: () => void;
}) {
  const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={`text-sm font-medium ${active ? "text-primary" : "text-foreground hover:text-primary"} ${className}`}
      onClick={onNavigate}
    >
      {link.label}
    </Link>
  );
}

function AuthActions({ signedIn, stacked = false }: { signedIn: boolean; stacked?: boolean }) {
  if (signedIn) {
    return (
      <Link href="/dashboard" className={buttonClass("primary", "", stacked)}>
        Open the tool
      </Link>
    );
  }

  return (
    <div className={stacked ? "flex flex-col gap-2" : "flex items-center gap-2"}>
      <Link href="/login" className={buttonClass("ghost", "", stacked)}>
        Sign in
      </Link>
      <Link href="/signup" className={buttonClass("primary", "", stacked)}>
        Create account
      </Link>
    </div>
  );
}
