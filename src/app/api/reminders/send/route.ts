import { todayLocal } from "@/lib/dates";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { connection } from "next/server";
import { NextResponse } from "next/server";
import * as webpush from "web-push";

export async function GET(request: Request) {
  await connection();
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (!url || !serviceKey || !vapidPublic || !vapidPrivate) {
    return NextResponse.json({ sent: 0, skipped: "missing env" });
  }

  webpush.setVapidDetails("mailto:honey@health-navigator.local", vapidPublic, vapidPrivate);

  const admin = createServiceClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const today = todayLocal();
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, last_check_in_on, push_enabled")
    .eq("push_enabled", true)
    .eq("onboarding_complete", true);

  const due = (profiles ?? []).filter((profile) => profile.last_check_in_on !== today);
  let sent = 0;

  for (const profile of due) {
    const { data: subs } = await admin
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", profile.id);

    for (const sub of subs ?? []) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify({
            title: "Honey is thinking of you",
            body: "A soft check-in is ready whenever you have a moment.",
          }),
        );
        sent += 1;
      } catch {
        // drop invalid subscriptions quietly
        await admin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      }
    }
  }

  return NextResponse.json({ sent, due: due.length });
}
