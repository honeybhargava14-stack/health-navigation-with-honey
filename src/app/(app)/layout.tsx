import { AppNav } from "@/components/app-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col pb-28">
      <header className="no-print px-5 pt-6">
        <p className="text-sm font-medium text-primary">Health Intelligence</p>
      </header>
      <div className="flex-1 px-5 py-5">{children}</div>
      <AppNav />
    </div>
  );
}
