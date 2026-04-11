-- Enhanced training log: RPE, mood tracking, body weight, and new session types

-- 1. Add effort_rpe column (Rate of Perceived Exertion, 1-10)
alter table public.training_sessions
  add column effort_rpe integer check (effort_rpe >= 1 and effort_rpe <= 10);

-- 2. Add mood_before column
alter table public.training_sessions
  add column mood_before text check (mood_before in ('great', 'good', 'neutral', 'tired', 'bad'));

-- 3. Add mood_after column
alter table public.training_sessions
  add column mood_after text check (mood_after in ('great', 'good', 'neutral', 'tired', 'bad'));

-- 4. Add body_weight_kg column (up to 999.9 kg with 1 decimal)
alter table public.training_sessions
  add column body_weight_kg numeric(5,1) check (body_weight_kg > 0);

-- 5. Update the type CHECK constraint to include 'seminar' and 'competition_prep'
--    Drop the existing inline constraint and recreate it
alter table public.training_sessions
  drop constraint training_sessions_type_check;

alter table public.training_sessions
  add constraint training_sessions_type_check
  check (type in ('gi', 'nogi', 'open_mat', 'private', 'competition', 'seminar', 'competition_prep'));
