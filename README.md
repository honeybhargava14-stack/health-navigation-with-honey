# Health Navigation with Honey

A warm multi-symptom tracker: daily check-ins (typed or spoken), day/week/month/year progress, doctor appointments with a calendar and reports, curated specialty ideas, visit-prep questions, and Honey chat. Soft listening, not diagnosis.

This site is not for health emergencies. If you need urgent care, contact a nearby healthcare provider or emergency services. It does not diagnose conditions or prescribe treatment. Patterns are correlations in what you recorded. They do not show cause.

## What you need

- Node.js 22 or newer
- A [Supabase](https://supabase.com) project (hosted for Vercel, or local Docker for development)
- A [Vercel](https://vercel.com) account for production
- An [AI Gateway](https://vercel.com/docs/ai-gateway) API key for Honey features

## Hosted setup (Vercel)

1. Create a Supabase project.
2. In the SQL Editor, run the migrations in [`supabase/migrations/`](supabase/migrations/) in order (including `20261124120000_multi_symptom_tracker.sql`). That migration is a **clean rebuild** of app tables; auth users stay, previous check-in/investigation rows are removed.
3. In Authentication → URL Configuration, set the Site URL to your Vercel origin and add that origin to Redirect URLs. Keep Confirm email off so Create account signs in immediately.
4. Copy the Project URL, anon key, and service role key from Project Settings → API.
5. Create a Vercel AI Gateway key and optional VAPID keys for browser push (`npx web-push generate-vapid-keys`).

Set these on the Vercel project (Production and Preview):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AI_GATEWAY_API_KEY=your-gateway-key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
CRON_SECRET=a-long-random-string
```

The service role key is used on the server for account deletion and reminder delivery. Never prefix it with `NEXT_PUBLIC_`.

Deploy from this folder:

```bash
npx vercel login
npx vercel
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
npx vercel env add AI_GATEWAY_API_KEY
npx vercel env add NEXT_PUBLIC_VAPID_PUBLIC_KEY
npx vercel env add VAPID_PRIVATE_KEY
npx vercel env add CRON_SECRET
npx vercel --prod
```

After the first production URL exists, put that origin into the Supabase Auth Site URL and Redirect URLs.

Daily push reminders run via Vercel Cron at `0 14 * * *` against `/api/reminders/send`.

## Local setup

Docker (or Colima) must be running for local Supabase. Or point `.env.local` at the hosted project.

```bash
npm install
npx supabase start
npx supabase status -o env
```

Copy keys into `.env.local` using `.env.example` as a guide. Add `AI_GATEWAY_API_KEY` for Honey. Generate VAPID keys if you want to test browser push.

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

Create an account, complete warm onboarding (goal, diagnosis stage if any, symptoms), then use **Today**, **Progress**, **Care**, **Honey**, and **Settings**.

## App map

- **Today** – How are you, streak, multi-symptom check-in, speech-to-text
- **Progress** – Day / week / month / year charts and clinician-friendly summary
- **Care** – Appointments, month calendar, PDF/image/text/link reports, visit prep
- **Honey** – Full-page chat that can fill check-ins, symptoms, and appointments; also a bottom-right invite + floating dock when Today notes mention pain
- **Settings** – Symptoms, treatments, push opt-in, export, delete account

## Stop local stack

```bash
npx supabase stop
```

If you used Colima: `colima stop`.
