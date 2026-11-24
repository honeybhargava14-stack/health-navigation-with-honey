-- Clean rebuild: keep auth.users and profiles rows; replace app data model.

drop trigger if exists profiles_require_investigation on public.profiles;
drop function if exists public.require_investigation_when_onboarded();

drop table if exists public.check_in_treatments cascade;
drop table if exists public.check_ins cascade;
drop table if exists public.investigations cascade;
drop table if exists public.treatments cascade;

alter table public.profiles
  add column if not exists app_goal text not null default '',
  add column if not exists app_goal_note text not null default '',
  add column if not exists diagnosed_status text not null default 'unsure'
    check (diagnosed_status in ('yes', 'no', 'unsure')),
  add column if not exists diagnosis_stage text not null default '',
  add column if not exists streak_count integer not null default 0,
  add column if not exists last_check_in_on date,
  add column if not exists push_enabled boolean not null default false;

update public.profiles set onboarding_complete = false;

create table public.symptoms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  category text not null,
  duration text not null default '',
  body_area text not null default '',
  notes text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index symptoms_user_id_idx on public.symptoms (user_id);

create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_on date not null default current_date,
  sleep_hours numeric(4, 1) not null default 0 check (sleep_hours >= 0 and sleep_hours <= 24),
  stress integer not null default 0 check (stress between 0 and 10),
  mood integer not null default 5 check (mood between 0 and 10),
  energy integer not null default 5 check (energy between 0 and 10),
  overall_note text not null default '',
  raw_speech_transcript text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, logged_on)
);

create table public.symptom_entries (
  id uuid primary key default gen_random_uuid(),
  daily_log_id uuid not null references public.daily_logs (id) on delete cascade,
  symptom_id uuid not null references public.symptoms (id) on delete cascade,
  severity integer not null check (severity between 0 and 10),
  note text not null default '',
  unique (daily_log_id, symptom_id)
);

create table public.treatments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.daily_log_treatments (
  daily_log_id uuid not null references public.daily_logs (id) on delete cascade,
  treatment_id uuid not null references public.treatments (id) on delete cascade,
  primary key (daily_log_id, treatment_id)
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  doctor_name text not null,
  specialty text not null default '',
  clinic text not null default '',
  starts_at timestamptz not null,
  reason text not null default '',
  notes text not null default '',
  next_visit_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index appointments_user_starts_idx on public.appointments (user_id, starts_at);

create table public.appointment_attachments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('pdf', 'image', 'text', 'link')),
  title text not null default '',
  storage_path text not null default '',
  url text not null default '',
  body_text text not null default '',
  created_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index chat_messages_user_created_idx on public.chat_messages (user_id, created_at);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

alter table public.symptoms enable row level security;
alter table public.daily_logs enable row level security;
alter table public.symptom_entries enable row level security;
alter table public.treatments enable row level security;
alter table public.daily_log_treatments enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_attachments enable row level security;
alter table public.chat_messages enable row level security;
alter table public.push_subscriptions enable row level security;

create policy "symptoms_select_own" on public.symptoms for select using (user_id = auth.uid());
create policy "symptoms_insert_own" on public.symptoms for insert with check (user_id = auth.uid());
create policy "symptoms_update_own" on public.symptoms for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "symptoms_delete_own" on public.symptoms for delete using (user_id = auth.uid());

create policy "daily_logs_select_own" on public.daily_logs for select using (user_id = auth.uid());
create policy "daily_logs_insert_own" on public.daily_logs for insert with check (user_id = auth.uid());
create policy "daily_logs_update_own" on public.daily_logs for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "daily_logs_delete_own" on public.daily_logs for delete using (user_id = auth.uid());

create policy "symptom_entries_select_own" on public.symptom_entries for select using (
  exists (
    select 1 from public.daily_logs
    where daily_logs.id = symptom_entries.daily_log_id and daily_logs.user_id = auth.uid()
  )
);
create policy "symptom_entries_insert_own" on public.symptom_entries for insert with check (
  exists (
    select 1 from public.daily_logs
    where daily_logs.id = symptom_entries.daily_log_id and daily_logs.user_id = auth.uid()
  )
  and exists (
    select 1 from public.symptoms
    where symptoms.id = symptom_entries.symptom_id and symptoms.user_id = auth.uid()
  )
);
create policy "symptom_entries_update_own" on public.symptom_entries for update using (
  exists (
    select 1 from public.daily_logs
    where daily_logs.id = symptom_entries.daily_log_id and daily_logs.user_id = auth.uid()
  )
);
create policy "symptom_entries_delete_own" on public.symptom_entries for delete using (
  exists (
    select 1 from public.daily_logs
    where daily_logs.id = symptom_entries.daily_log_id and daily_logs.user_id = auth.uid()
  )
);

create policy "treatments_select_own" on public.treatments for select using (user_id = auth.uid());
create policy "treatments_insert_own" on public.treatments for insert with check (user_id = auth.uid());
create policy "treatments_update_own" on public.treatments for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "treatments_delete_own" on public.treatments for delete using (user_id = auth.uid());

create policy "daily_log_treatments_select_own" on public.daily_log_treatments for select using (
  exists (
    select 1 from public.daily_logs
    where daily_logs.id = daily_log_treatments.daily_log_id and daily_logs.user_id = auth.uid()
  )
);
create policy "daily_log_treatments_insert_own" on public.daily_log_treatments for insert with check (
  exists (
    select 1 from public.daily_logs
    where daily_logs.id = daily_log_treatments.daily_log_id and daily_logs.user_id = auth.uid()
  )
  and exists (
    select 1 from public.treatments
    where treatments.id = daily_log_treatments.treatment_id and treatments.user_id = auth.uid()
  )
);
create policy "daily_log_treatments_delete_own" on public.daily_log_treatments for delete using (
  exists (
    select 1 from public.daily_logs
    where daily_logs.id = daily_log_treatments.daily_log_id and daily_logs.user_id = auth.uid()
  )
);

create policy "appointments_select_own" on public.appointments for select using (user_id = auth.uid());
create policy "appointments_insert_own" on public.appointments for insert with check (user_id = auth.uid());
create policy "appointments_update_own" on public.appointments for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "appointments_delete_own" on public.appointments for delete using (user_id = auth.uid());

create policy "appointment_attachments_select_own" on public.appointment_attachments for select using (user_id = auth.uid());
create policy "appointment_attachments_insert_own" on public.appointment_attachments for insert with check (user_id = auth.uid());
create policy "appointment_attachments_update_own" on public.appointment_attachments for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "appointment_attachments_delete_own" on public.appointment_attachments for delete using (user_id = auth.uid());

create policy "chat_messages_select_own" on public.chat_messages for select using (user_id = auth.uid());
create policy "chat_messages_insert_own" on public.chat_messages for insert with check (user_id = auth.uid());
create policy "chat_messages_delete_own" on public.chat_messages for delete using (user_id = auth.uid());

create policy "push_subscriptions_select_own" on public.push_subscriptions for select using (user_id = auth.uid());
create policy "push_subscriptions_insert_own" on public.push_subscriptions for insert with check (user_id = auth.uid());
create policy "push_subscriptions_update_own" on public.push_subscriptions for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "push_subscriptions_delete_own" on public.push_subscriptions for delete using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('care-reports', 'care-reports', false)
on conflict (id) do nothing;

drop policy if exists "care_reports_select_own" on storage.objects;
drop policy if exists "care_reports_insert_own" on storage.objects;
drop policy if exists "care_reports_update_own" on storage.objects;
drop policy if exists "care_reports_delete_own" on storage.objects;

create policy "care_reports_select_own"
  on storage.objects for select
  using (bucket_id = 'care-reports' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "care_reports_insert_own"
  on storage.objects for insert
  with check (bucket_id = 'care-reports' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "care_reports_update_own"
  on storage.objects for update
  using (bucket_id = 'care-reports' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "care_reports_delete_own"
  on storage.objects for delete
  using (bucket_id = 'care-reports' and (storage.foldername(name))[1] = auth.uid()::text);

grant select, insert, update, delete on public.symptoms to authenticated;
grant select, insert, update, delete on public.daily_logs to authenticated;
grant select, insert, update, delete on public.symptom_entries to authenticated;
grant select, insert, update, delete on public.treatments to authenticated;
grant select, insert, delete on public.daily_log_treatments to authenticated;
grant select, insert, update, delete on public.appointments to authenticated;
grant select, insert, update, delete on public.appointment_attachments to authenticated;
grant select, insert, delete on public.chat_messages to authenticated;
grant select, insert, update, delete on public.push_subscriptions to authenticated;
