-- Add weight_class to profiles
alter table public.profiles add column if not exists weight_class text;

-- Training checklist (personal packing list per user)
create table if not exists public.training_checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.training_checklists enable row level security;

create policy "Users manage own checklist items"
  on public.training_checklists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Achievements / badges
create table if not exists public.achievements (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  category text not null check (category in ('training', 'streak', 'belt', 'social', 'competition')),
  threshold int not null default 1,
  sort_order int default 0
);

-- No RLS on achievements — they are public definitions
alter table public.achievements enable row level security;
create policy "Achievements are readable by all" on public.achievements for select using (true);

-- User achievements (earned badges)
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "Users can see own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "System can insert achievements"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

-- Seed default achievements
insert into public.achievements (id, name, description, icon, category, threshold, sort_order) values
  ('first_training', 'Første trening', 'Loggfør din første trening', 'trophy', 'training', 1, 1),
  ('training_10', '10 treninger', 'Loggfør 10 treninger', 'fire', 'training', 10, 2),
  ('training_50', '50 treninger', 'Loggfør 50 treninger', 'star', 'training', 50, 3),
  ('training_100', 'Hundre-klubben', 'Loggfør 100 treninger', 'crown', 'training', 100, 4),
  ('training_250', '250 treninger', 'Loggfør 250 treninger', 'gem', 'training', 250, 5),
  ('training_500', 'Halvtusen', 'Loggfør 500 treninger', 'medal', 'training', 500, 6),
  ('training_1000', 'Tusen-klubben', 'Loggfør 1000 treninger', 'rocket', 'training', 1000, 7),
  ('streak_7', 'Uke-streak', 'Tren minst 1 gang i uken i 7 uker', 'flame', 'streak', 7, 10),
  ('streak_30', 'Måned-streak', 'Tren minst 1 gang i uken i 30 uker', 'lightning', 'streak', 30, 11),
  ('streak_52', 'Års-streak', 'Tren minst 1 gang i uken i 52 uker', 'diamond', 'streak', 52, 12),
  ('hours_50', '50 timer på matta', 'Loggfør 50 timer trening', 'clock', 'training', 50, 20),
  ('hours_100', '100 timer på matta', 'Loggfør 100 timer trening', 'clock', 'training', 100, 21),
  ('hours_500', '500 timer på matta', 'Loggfør 500 timer trening', 'clock', 'training', 500, 22),
  ('hours_1000', '1000 timer på matta', 'Loggfør 1000 timer trening', 'clock', 'training', 1000, 23),
  ('week_3', '3 treninger denne uken', 'Tren 3 ganger på en uke', 'calendar', 'training', 3, 30),
  ('week_5', '5 treninger denne uken', 'Tren 5 ganger på en uke', 'calendar', 'training', 5, 31),
  ('week_7', 'Hver dag!', 'Tren 7 ganger på en uke', 'calendar', 'training', 7, 32),
  ('blue_belt', 'Blåbelte', 'Oppnå blått belte', 'belt', 'belt', 1, 40),
  ('purple_belt', 'Lilabelte', 'Oppnå lilla belte', 'belt', 'belt', 1, 41),
  ('brown_belt', 'Brunt belte', 'Oppnå brunt belte', 'belt', 'belt', 1, 42),
  ('black_belt', 'Svart belte', 'Oppnå svart belte', 'belt', 'belt', 1, 43),
  ('first_comp', 'Første konkurranse', 'Delta i din første konkurranse', 'trophy', 'competition', 1, 50),
  ('comp_gold', 'Gullmedalje', 'Vinn gull i en konkurranse', 'gold_medal', 'competition', 1, 51)
on conflict (id) do nothing;
