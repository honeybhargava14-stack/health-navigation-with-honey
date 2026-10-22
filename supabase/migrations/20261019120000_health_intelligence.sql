create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.investigations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  health_question text not null,
  symptom_label text not null,
  duration text not null,
  goal text not null,
  started_on date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  logged_on date not null default current_date,
  severity integer not null check (severity between 0 and 10),
  sleep_hours numeric(4, 1) not null check (sleep_hours >= 0 and sleep_hours <= 24),
  stress integer not null check (stress between 0 and 10),
  lifestyle_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, logged_on)
);

create table public.treatments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.check_in_treatments (
  check_in_id uuid not null references public.check_ins (id) on delete cascade,
  treatment_id uuid not null references public.treatments (id) on delete cascade,
  primary key (check_in_id, treatment_id)
);

alter table public.profiles enable row level security;
alter table public.investigations enable row level security;
alter table public.check_ins enable row level security;
alter table public.treatments enable row level security;
alter table public.check_in_treatments enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "profiles_delete_own" on public.profiles
  for delete using (id = auth.uid());

create policy "investigations_select_own" on public.investigations
  for select using (user_id = auth.uid());

create policy "investigations_insert_own" on public.investigations
  for insert with check (user_id = auth.uid());

create policy "investigations_update_own" on public.investigations
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "investigations_delete_own" on public.investigations
  for delete using (user_id = auth.uid());

create policy "check_ins_select_own" on public.check_ins
  for select using (user_id = auth.uid());

create policy "check_ins_insert_own" on public.check_ins
  for insert with check (user_id = auth.uid());

create policy "check_ins_update_own" on public.check_ins
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "check_ins_delete_own" on public.check_ins
  for delete using (user_id = auth.uid());

create policy "treatments_select_own" on public.treatments
  for select using (user_id = auth.uid());

create policy "treatments_insert_own" on public.treatments
  for insert with check (user_id = auth.uid());

create policy "treatments_update_own" on public.treatments
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "treatments_delete_own" on public.treatments
  for delete using (user_id = auth.uid());

create policy "check_in_treatments_select_own" on public.check_in_treatments
  for select using (
    exists (
      select 1 from public.check_ins
      where check_ins.id = check_in_treatments.check_in_id
        and check_ins.user_id = auth.uid()
    )
  );

create policy "check_in_treatments_insert_own" on public.check_in_treatments
  for insert with check (
    exists (
      select 1 from public.check_ins
      where check_ins.id = check_in_treatments.check_in_id
        and check_ins.user_id = auth.uid()
    )
    and exists (
      select 1 from public.treatments
      where treatments.id = check_in_treatments.treatment_id
        and treatments.user_id = auth.uid()
    )
  );

create policy "check_in_treatments_delete_own" on public.check_in_treatments
  for delete using (
    exists (
      select 1 from public.check_ins
      where check_ins.id = check_in_treatments.check_in_id
        and check_ins.user_id = auth.uid()
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke all on function public.handle_new_user() from public, anon, authenticated;

create or replace function public.require_investigation_when_onboarded()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.onboarding_complete and not exists (
    select 1 from public.investigations
    where investigations.user_id = new.id
  ) then
    raise exception 'An investigation is required before onboarding is complete';
  end if;
  return new;
end;
$$;

create trigger profiles_require_investigation
  before update on public.profiles
  for each row execute function public.require_investigation_when_onboarded();

grant usage on schema public to authenticated;
grant select, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.investigations to authenticated;
grant select, insert, update, delete on public.check_ins to authenticated;
grant select, insert, update, delete on public.treatments to authenticated;
grant select, insert, delete on public.check_in_treatments to authenticated;
