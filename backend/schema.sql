create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  lat double precision not null,
  lng double precision not null,
  address text,
  has_ramp boolean default false,
  has_elevator boolean default false,
  accessible_parking boolean default false,
  wheelchair_friendly boolean default false,
  quiet boolean default false,
  rating numeric(2,1),
  created_at timestamptz default now()
);

create table if not exists washrooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lat double precision not null,
  lng double precision not null,
  address text,
  cleanliness_rating numeric(2,1),
  verified boolean default false,
  last_verified date,
  created_at timestamptz default now()
);

create table if not exists schemes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  eligibility text,
  benefits text,
  disability_type text,
  state text,
  apply_url text,
  name_hi text,
  name_te text,
  name_ta text
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  issue_type text not null,
  description text,
  lat double precision,
  lng double precision,
  photo_url text,
  status text default 'open',
  upvotes int default 0,
  created_at timestamptz default now()
);

create table if not exists passports (
  user_id uuid primary key references auth.users(id),
  mobility_needs text,
  vision_needs text,
  hearing_needs text,
  preferred_language text default 'en',
  font_size text default 'medium',
  sensory_mode boolean default false,
  updated_at timestamptz default now()
);

create table if not exists emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  phone text not null
);

create table if not exists sos_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  lat double precision,
  lng double precision,
  created_at timestamptz default now()
);

create table if not exists report_upvotes (
  report_id uuid references reports(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (report_id, user_id)
);

alter table reports enable row level security;
alter table report_upvotes enable row level security;
alter table passports enable row level security;
alter table emergency_contacts enable row level security;
alter table sos_events enable row level security;

create policy "Reports are publicly readable"
  on reports for select using (true);

create policy "Users insert own reports"
  on reports for insert with check (auth.uid() = user_id);

create policy "Users update own reports"
  on reports for update using (auth.uid() = user_id);

create policy "Report upvotes are publicly readable"
  on report_upvotes for select using (true);

create policy "Users insert own report upvotes"
  on report_upvotes for insert with check (auth.uid() = user_id);

create policy "Users manage own passport"
  on passports for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own emergency contacts"
  on emergency_contacts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own sos events"
  on sos_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

