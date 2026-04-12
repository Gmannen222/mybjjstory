-- RPC: Get the top trainer of the week for an academy
-- Returns: top trainer this week + whether requesting user was ever top in past 12 weeks
create or replace function public.get_academy_top_trainer(p_academy_id text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_week_start date;
  v_top_user_id uuid;
  v_top_display_name text;
  v_top_belt_rank text;
  v_top_count bigint;
  v_user_was_top boolean := false;
begin
  -- ISO week start (Monday)
  current_week_start := date_trunc('week', now())::date;

  -- This week's top trainer (most sessions, tiebreak by most recent session)
  select ts.user_id, p.display_name, p.belt_rank, count(*)
  into v_top_user_id, v_top_display_name, v_top_belt_rank, v_top_count
  from public.training_sessions ts
  join public.profiles p on p.id = ts.user_id
  where p.academy_id = p_academy_id
    and ts.date >= current_week_start
    and p.show_in_academy_list = true
  group by ts.user_id, p.display_name, p.belt_rank
  order by count(*) desc, max(ts.date) desc
  limit 1;

  -- Check if requesting user was top trainer in any of the past 12 weeks
  if auth.uid() is not null then
    with weekly_counts as (
      select
        ts.user_id,
        date_trunc('week', ts.date::timestamp)::date as week_start,
        count(*) as cnt
      from public.training_sessions ts
      join public.profiles p on p.id = ts.user_id
      where p.academy_id = p_academy_id
        and ts.date >= (current_week_start - interval '12 weeks')::date
        and ts.date < current_week_start
        and p.show_in_academy_list = true
      group by ts.user_id, date_trunc('week', ts.date::timestamp)::date
    ),
    weekly_tops as (
      select distinct on (week_start) user_id
      from weekly_counts
      order by week_start, cnt desc
    )
    select exists(select 1 from weekly_tops where user_id = auth.uid())
    into v_user_was_top;
  end if;

  return json_build_object(
    'top_user_id', v_top_user_id,
    'top_display_name', v_top_display_name,
    'top_belt_rank', v_top_belt_rank,
    'top_count', coalesce(v_top_count, 0),
    'is_current_user', (v_top_user_id is not null and v_top_user_id = auth.uid()),
    'user_was_top_before', coalesce(v_user_was_top, false)
  );
end;
$$;
