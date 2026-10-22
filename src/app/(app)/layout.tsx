import { SITE_NAME, SITE_WORDMARK } from "@/lib/site";
import { AppNav } from "@/components/app-nav";
import { BackToWebsite } from "@health/ui";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col pb-28">
      <header className="no-print flex items-start justify-between gap-4 px-5 pt-6">
        <div>
          <p className="font-serif text-lg leading-tight font-semibold text-foreground">{SITE_NAME}</p>
          <p className="text-xs text-muted">{SITE_WORDMARK}</p>
        </div>
        <BackToWebsite />
      </header>
      <div className="flex-1 px-5 py-5">{children}</div>
      <AppNav />
    </div>
  );
}
