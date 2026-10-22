import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const APP_PREFIXES = ["/dashboard", "/check-in", "/report", "/settings", "/api/export"];

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isOnboarding = path.startsWith("/onboarding");
  const isApp = APP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  const isAuthPage = path === "/login" || path === "/signup";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (isApp || isOnboarding) return redirectTo(request, "/login", NextResponse.next());
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && (isApp || isOnboarding)) {
    return redirectTo(request, "/login", supabaseResponse);
  }

  if (!user) return supabaseResponse;

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_complete")
    .eq("id", user.id)
    .maybeSingle();

  const onboarded = profile?.onboarding_complete === true;

  if (!onboarded && isApp) {
    return redirectTo(request, "/onboarding", supabaseResponse);
  }

  if (onboarded && (isOnboarding || isAuthPage)) {
    return redirectTo(request, "/dashboard", supabaseResponse);
  }

  return supabaseResponse;
}

function redirectTo(request: NextRequest, pathname: string, sessionResponse: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  const redirectResponse = NextResponse.redirect(url);
  sessionResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value);
  });
  return redirectResponse;
}
