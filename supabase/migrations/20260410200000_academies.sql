-- ============================================================
-- ACADEMIES
-- Public reference table — Norwegian BJJ academies
-- ============================================================

create table public.academies (
  id           text primary key,                        -- slugified, e.g. "gracie-barra-oslo"
  name         text not null,
  city         text,
  region       text,
  country      text not null default 'Norway',
  country_code text not null default 'NO',
  website_url  text,
  address      text,
  affiliation  text,                                    -- e.g. "Gracie Barra", "Alliance", "Checkmat"
  is_active    boolean not null default true,
  lat          numeric(9, 6),
  lng          numeric(9, 6),
  logo_url     text,                                    -- external URL; migrate to storage later if needed
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.academies enable row level security;

-- Anyone can read academies (no auth required)
create policy "Academies are publicly readable"
  on public.academies for select
  using (true);

-- Only admins can insert/update/delete
-- Uses profiles.role = 'admin' — set this via service role or a future admin panel
create policy "Admins can insert academies"
  on public.academies for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update academies"
  on public.academies for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete academies"
  on public.academies for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_academies_region      on public.academies (region);
create index idx_academies_country_code on public.academies (country_code);
create index idx_academies_affiliation on public.academies (affiliation);
-- Partial index — nearly all queries filter on active academies
create index idx_academies_active      on public.academies (id) where is_active = true;

-- ============================================================
-- PROFILES — link to academies
-- ============================================================
-- academy_name (free text) remains as a fallback for unregistered/foreign gyms.
-- academy_id is nullable; set when user selects a known academy from the list.

alter table public.profiles
  add column if not exists academy_id text references public.academies(id) on delete set null;

create index idx_profiles_academy_id on public.profiles (academy_id);

-- ============================================================
-- UPDATED_AT trigger for academies
-- ============================================================

create or replace function public.handle_academies_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger academies_updated_at
  before update on public.academies
  for each row execute function public.handle_academies_updated_at();
