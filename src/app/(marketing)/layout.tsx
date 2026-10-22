import { FOOTER_LINKS, NAV_LINKS, SITE_NAME, SITE_WORDMARK } from "@/lib/site";
import { getOptionalUser } from "@/lib/optional-user";
import { SiteFooter, SiteHeader } from "@health/ui";

export const instant = false;

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getOptionalUser();

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader
        brand={SITE_NAME}
        wordmark={SITE_WORDMARK}
        signedIn={Boolean(user)}
        links={NAV_LINKS}
      />
      <div id="main-content" className="flex-1">
        {children}
      </div>
      <SiteFooter brand={SITE_NAME} wordmark={SITE_WORDMARK} links={FOOTER_LINKS} />
    </div>
  );
}
