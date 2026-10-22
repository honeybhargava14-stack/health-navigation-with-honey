# Health Navigation with Honey

A personal website and web app for logging one recurring symptom, noticing correlations in that log, and preparing a 14-day summary for a clinician.

This site is not for health emergencies. If you need urgent care, contact a nearby healthcare provider or emergency services. It does not diagnose conditions or prescribe treatment. Patterns are correlations in what you recorded. They do not show cause.

## What you need

- Node.js 22 or newer
- A [Supabase](https://supabase.com) project (hosted for Vercel, or local Docker for development)
- A [Vercel](https://vercel.com) account for production

## Hosted setup (Vercel)

1. Create a Supabase project.
2. In the SQL Editor, run [`supabase/migrations/20261019120000_health_intelligence.sql`](supabase/migrations/20261019120000_health_intelligence.sql).
3. In Authentication → URL Configuration, set the Site URL to your Vercel origin (`https://your-app.vercel.app`) and add that origin to Redirect URLs. Keep Confirm email off so Create account signs in immediately.
4. Copy the Project URL, anon key, and service role key from Project Settings → API.

Set these on the Vercel project (Production and Preview):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The service role key is used only on the server when a person deletes their account. Never prefix it with `NEXT_PUBLIC_`.

Deploy from this folder:

```bash
npx vercel login
npx vercel
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
npx vercel --prod
```

After the first production URL exists, put that origin into the Supabase Auth Site URL and Redirect URLs.

## Local setup

Docker (or Colima) must be running. Studio, storage, realtime, and analytics are turned off in `supabase/config.toml` so the local stack stays smaller. Auth, the database, and the API stay on.

```bash
npm install
npx supabase start
npx supabase status -o env
```

Copy the local API URL, anon key, and service role key into `.env.local`. `.env.example` lists the same names. `.env.local` stays on this machine.

The first `supabase start` applies the database migration, including row level security. To reapply it from scratch:

```bash
npx supabase db reset
```

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

Create an account, answer the one health question, then save a daily check-in. The dashboard and 14-day report compare higher stress (7 or above), shorter sleep (under 6 hours), and logged treatments only after 7 days in the current window, and only when both sides of a comparison have at least two days. The report page can be printed to PDF. Settings can download the full log as CSV or delete the account.

Local email confirmation is off in `supabase/config.toml`, so sign-up opens a session immediately.

## Stop local stack

```bash
npx supabase stop
```

If you used Colima: `colima stop`.
