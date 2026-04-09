-- MyBJJStory: Initial schema
-- All tables use RLS for row-level security

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  belt_rank text check (belt_rank in ('white', 'blue', 'purple', 'brown', 'black')),
  belt_degrees int default 0,
  academy_name text,
  role text default 'athlete' check (role in ('athlete', 'competitor', 'instructor', 'academy')),
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Offentlige profiler er synlige for alle"
  on public.profiles for select
  using (is_public = true);

create policy "Brukere kan se sin egen profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Brukere kan oppdatere sin egen profil"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- TRAINING SESSIONS
-- ============================================================
create table public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date not null default current_date,
  duration_min int,
  type text not null default 'gi' check (type in ('gi', 'nogi', 'open_mat', 'private', 'competition')),
  notes text,
  is_public boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.training_sessions enable row level security;

create policy "Brukere kan se egne treninger"
  on public.training_sessions for select
  using (auth.uid() = user_id);

create policy "Offentlige treninger er synlige"
  on public.training_sessions for select
  using (is_public = true);

create policy "Brukere kan opprette egne treninger"
  on public.training_sessions for insert
  with check (auth.uid() = user_id);

create policy "Brukere kan oppdatere egne treninger"
  on public.training_sessions for update
  using (auth.uid() = user_id);

create policy "Brukere kan slette egne treninger"
  on public.training_sessions for delete
  using (auth.uid() = user_id);

-- ============================================================
-- SESSION TECHNIQUES
-- ============================================================
create table public.session_techniques (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  name text not null,
  category text check (category in ('guard', 'pass', 'sweep', 'submission', 'takedown', 'escape', 'other')),
  notes text
);

alter table public.session_techniques enable row level security;

create policy "Teknikker følger treningens tilgang"
  on public.session_techniques for select
  using (
    exists (
      select 1 from public.training_sessions ts
      where ts.id = session_id
      and (ts.user_id = auth.uid() or ts.is_public = true)
    )
  );

create policy "Brukere kan legge til teknikker på egne treninger"
  on public.session_techniques for insert
  with check (
    exists (
      select 1 from public.training_sessions ts
      where ts.id = session_id and ts.user_id = auth.uid()
    )
  );

create policy "Brukere kan oppdatere teknikker på egne treninger"
  on public.session_techniques for update
  using (
    exists (
      select 1 from public.training_sessions ts
      where ts.id = session_id and ts.user_id = auth.uid()
    )
  );

create policy "Brukere kan slette teknikker på egne treninger"
  on public.session_techniques for delete
  using (
    exists (
      select 1 from public.training_sessions ts
      where ts.id = session_id and ts.user_id = auth.uid()
    )
  );

-- ============================================================
-- GRADINGS
-- ============================================================
create table public.gradings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  belt_rank text not null check (belt_rank in ('white', 'blue', 'purple', 'brown', 'black')),
  belt_degrees int default 0,
  date date not null default current_date,
  instructor_name text,
  academy_name text,
  notes text,
  is_public boolean default true,
  created_at timestamptz default now()
);

alter table public.gradings enable row level security;

create policy "Brukere kan se egne graderinger"
  on public.gradings for select
  using (auth.uid() = user_id);

create policy "Offentlige graderinger er synlige"
  on public.gradings for select
  using (is_public = true);

create policy "Brukere kan opprette egne graderinger"
  on public.gradings for insert
  with check (auth.uid() = user_id);

create policy "Brukere kan oppdatere egne graderinger"
  on public.gradings for update
  using (auth.uid() = user_id);

create policy "Brukere kan slette egne graderinger"
  on public.gradings for delete
  using (auth.uid() = user_id);

-- ============================================================
-- MEDIA
-- ============================================================
create table public.media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  thumbnail_path text,
  media_type text not null check (media_type in ('image', 'video')),
  caption text,
  session_id uuid references public.training_sessions(id) on delete set null,
  grading_id uuid references public.gradings(id) on delete set null,
  is_public boolean default false,
  created_at timestamptz default now()
);

alter table public.media enable row level security;

create policy "Brukere kan se egne media"
  on public.media for select
  using (auth.uid() = user_id);

create policy "Offentlige media er synlige"
  on public.media for select
  using (is_public = true);

create policy "Brukere kan laste opp egne media"
  on public.media for insert
  with check (auth.uid() = user_id);

create policy "Brukere kan oppdatere egne media"
  on public.media for update
  using (auth.uid() = user_id);

create policy "Brukere kan slette egne media"
  on public.media for delete
  using (auth.uid() = user_id);

-- ============================================================
-- POSTS (social feed)
-- ============================================================
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text,
  post_type text not null default 'text' check (post_type in ('training', 'grading', 'media', 'text')),
  session_id uuid references public.training_sessions(id) on delete set null,
  grading_id uuid references public.gradings(id) on delete set null,
  media_id uuid references public.media(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;

create policy "Alle kan se innlegg"
  on public.posts for select
  using (true);

create policy "Brukere kan opprette egne innlegg"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Brukere kan oppdatere egne innlegg"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Brukere kan slette egne innlegg"
  on public.posts for delete
  using (auth.uid() = user_id);

-- ============================================================
-- COMMENTS
-- ============================================================
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

create policy "Alle kan se kommentarer"
  on public.comments for select
  using (true);

create policy "Innloggede kan kommentere"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Brukere kan oppdatere egne kommentarer"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "Brukere kan slette egne kommentarer"
  on public.comments for delete
  using (auth.uid() = user_id);

-- ============================================================
-- REACTIONS
-- ============================================================
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'oss' check (type in ('oss', 'high_five', 'fire')),
  created_at timestamptz default now(),
  unique (post_id, user_id)
);

alter table public.reactions enable row level security;

create policy "Alle kan se reaksjoner"
  on public.reactions for select
  using (true);

create policy "Innloggede kan reagere"
  on public.reactions for insert
  with check (auth.uid() = user_id);

create policy "Brukere kan fjerne egne reaksjoner"
  on public.reactions for delete
  using (auth.uid() = user_id);

-- ============================================================
-- FOLLOWS
-- ============================================================
create table public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

alter table public.follows enable row level security;

create policy "Alle kan se følgerelasjoner"
  on public.follows for select
  using (true);

create policy "Innloggede kan følge"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Brukere kan avfølge"
  on public.follows for delete
  using (auth.uid() = follower_id);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_training_sessions_user_date on public.training_sessions(user_id, date desc);
create index idx_session_techniques_session on public.session_techniques(session_id);
create index idx_gradings_user on public.gradings(user_id, date desc);
create index idx_media_user on public.media(user_id, created_at desc);
create index idx_media_session on public.media(session_id) where session_id is not null;
create index idx_media_grading on public.media(grading_id) where grading_id is not null;
create index idx_posts_created on public.posts(created_at desc);
create index idx_posts_user on public.posts(user_id, created_at desc);
create index idx_comments_post on public.comments(post_id, created_at);
create index idx_reactions_post on public.reactions(post_id);
create index idx_follows_following on public.follows(following_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_training_sessions_updated_at
  before update on public.training_sessions
  for each row execute function public.set_updated_at();
