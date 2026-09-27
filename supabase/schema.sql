-- ==============================================================================
-- SUPABASE SCHEMA: Pan-India Local & Experiences Platform
-- ==============================================================================

-- 1. Cities table
create table if not exists cities (
  id text primary key,              -- e.g. 'delhi', 'mumbai', 'jaipur', 'kochi', 'kolkata', 'varanasi', 'bengaluru', 'chennai', 'hyderabad', 'goa'
  name text not null,
  state text not null,
  center_lat float8 not null,
  center_lng float8 not null,
  created_at timestamptz default now()
);

-- 2. Vendors table
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  city_id text references cities(id),
  established_year int,
  verified boolean default false,
  auth_user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- 3. Experiences table
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  experience_title text not null,
  category text not null,                 -- 'food' | 'culture' | 'workshops' | 'nightlife' | 'hidden-gems' | 'markets' | 'nature'
  duration_minutes int not null,
  price_per_head numeric not null,
  maximum_capacity int not null,
  lat float8 not null,
  lng float8 not null,
  city_id text references cities(id) not null,
  neighborhood text,
  tags text[] not null default '{}',
  specialty_tier text not null,           -- 'hidden-gem' | 'signature' | 'seasonal'
  vendor_id uuid references vendors(id),
  one_line_teaser text,
  full_description text,
  indoor boolean default false,
  wheelchair boolean default false,
  step_free boolean default false,
  senior_paced boolean default false,
  low_sensory boolean default false,
  hours text,
  structured_hours jsonb,
  open_now boolean default true,
  images text[] default '{}',
  rating_score float4,
  rating_review_count int default 0,
  editorial_note text,
  data_source text default 'vendor_submitted',     -- 'vendor_submitted' | 'osm_llm_estimated' | 'curated_seed'
  attribution text,
  eligible_for_nearby_promotions boolean default true,
  external_source_id text unique,
  created_at timestamptz default now()
);

-- 4. Offerings table
create table if not exists offerings (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid references experiences(id) on delete cascade,
  title text not null,
  price numeric not null,
  description text,
  duration_minutes int not null,
  created_at timestamptz default now()
);

-- 5. Availability slots table
create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid references experiences(id) on delete cascade,
  date date not null,
  time time not null,
  capacity_remaining int not null,
  total_capacity int not null,
  created_at timestamptz default now()
);

-- 6. Search demand signals table
create table if not exists search_demand_signals (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id),
  city_id text references cities(id),
  query_tags text[],
  category text,
  searches_count int,
  trend_percentage float4,
  avg_budget_indicated numeric,
  accessibility_demand text,
  neighborhood_focus text,
  created_at timestamptz default now()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table cities enable row level security;
alter table vendors enable row level security;
alter table experiences enable row level security;
alter table offerings enable row level security;
alter table availability_slots enable row level security;
alter table search_demand_signals enable row level security;

-- Cities: Public read
create policy "Cities are publicly readable"
  on cities for select
  using (true);

-- Vendors: Public can view verified vendors, owner can full access
create policy "Public can view basic vendor info"
  on vendors for select
  using (true);

create policy "Vendors can insert their own row"
  on vendors for insert
  with check (auth.uid() = auth_user_id);

create policy "Vendors can update their own row"
  on vendors for update
  using (auth.uid() = auth_user_id);

-- Experiences: Public read, vendor write
create policy "Experiences are publicly readable"
  on experiences for select
  using (true);

create policy "Vendors can insert their own experiences"
  on experiences for insert
  with check (
    vendor_id in (select id from vendors where auth_user_id = auth.uid())
    or vendor_id is null
  );

create policy "Vendors can update their own experiences"
  on experiences for update
  using (
    vendor_id in (select id from vendors where auth_user_id = auth.uid())
  );

create policy "Vendors can delete their own experiences"
  on experiences for delete
  using (
    vendor_id in (select id from vendors where auth_user_id = auth.uid())
  );

-- Offerings: Public read, vendor write
create policy "Offerings are publicly readable"
  on offerings for select
  using (true);

create policy "Vendors can modify offerings for their experiences"
  on offerings for all
  using (
    experience_id in (
      select e.id from experiences e
      join vendors v on v.id = e.vendor_id
      where v.auth_user_id = auth.uid()
    )
  );

-- Availability slots: Public read, vendor write
create policy "Availability slots are publicly readable"
  on availability_slots for select
  using (true);

create policy "Vendors can modify availability for their experiences"
  on availability_slots for all
  using (
    experience_id in (
      select e.id from experiences e
      join vendors v on v.id = e.vendor_id
      where v.auth_user_id = auth.uid()
    )
  );

-- Search demand signals: Only owning vendor can select
create policy "Vendors can view their own demand signals"
  on search_demand_signals for select
  using (
    vendor_id in (select id from vendors where auth_user_id = auth.uid())
    or vendor_id is null
  );
