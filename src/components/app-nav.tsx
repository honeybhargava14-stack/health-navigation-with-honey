"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/today", label: "Today" },
  { href: "/progress", label: "Progress" },
  { href: "/care", label: "Care" },
  { href: "/honey", label: "Honey" },
  { href: "/settings", label: "Settings" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-2 py-2 backdrop-blur">
      <ul className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 items-center justify-center rounded-2xl px-1 text-center text-sm font-medium ${
                  active ? "bg-accent text-primary" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
