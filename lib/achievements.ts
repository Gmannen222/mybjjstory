import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Check and award any new achievements for a user.
 * Call this after logging a training session, grading, or competition.
 */
export async function checkAchievements(supabase: SupabaseClient, userId: string) {
  const [trainingsRes, compRes, goldRes, earnedRes, profileRes] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('date, duration_min')
      .eq('user_id', userId)
      .order('date'),
    supabase
      .from('competitions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('competitions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('result', 'gold'),
    supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId),
    supabase
      .from('profiles')
      .select('belt_rank')
      .eq('id', userId)
      .single(),
  ])

  if (trainingsRes.error || earnedRes.error || profileRes.error) {
    console.error('Achievement check failed:', {
      trainings: trainingsRes.error?.message,
      earned: earnedRes.error?.message,
      profile: profileRes.error?.message,
    })
    return []
  }

  const trainings = trainingsRes.data || []
  const totalCount = trainings.length
  const totalMinutes = trainings.reduce((sum, t) => sum + (t.duration_min ?? 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const earnedSet = new Set((earnedRes.data || []).map((e: { achievement_id: string }) => e.achievement_id))

  const toAward: string[] = []

  function award(id: string) {
    if (!earnedSet.has(id)) toAward.push(id)
  }

  // Training count achievements
  if (totalCount >= 1) award('first_training')
  if (totalCount >= 10) award('training_10')
  if (totalCount >= 50) award('training_50')
  if (totalCount >= 100) award('training_100')
  if (totalCount >= 250) award('training_250')
  if (totalCount >= 500) award('training_500')
  if (totalCount >= 1000) award('training_1000')

  // Hours achievements
  if (totalHours >= 50) award('hours_50')
  if (totalHours >= 100) award('hours_100')
  if (totalHours >= 500) award('hours_500')
  if (totalHours >= 1000) award('hours_1000')

  // Weekly count — check current week
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
  weekStart.setHours(0, 0, 0, 0)
  const thisWeekCount = trainings.filter((t) => new Date(t.date + 'T00:00:00') >= weekStart).length
  if (thisWeekCount >= 3) award('week_3')
  if (thisWeekCount >= 5) award('week_5')
  if (thisWeekCount >= 7) award('week_7')

  // Streak — weeks with at least 1 training
  const weekSet = new Set<string>()
  for (const t of trainings) {
    const d = new Date(t.date + 'T00:00:00')
    const weekKey = getISOWeek(d)
    weekSet.add(weekKey)
  }

  // Count consecutive weeks from current week backwards
  let streakWeeks = 0
  const checkDate = new Date(now)
  for (let i = 0; i < 60; i++) {
    const key = getISOWeek(checkDate)
    if (weekSet.has(key)) {
      streakWeeks++
      checkDate.setDate(checkDate.getDate() - 7)
    } else if (i === 0) {
      // Current week might not have training yet, skip
      checkDate.setDate(checkDate.getDate() - 7)
      continue
    } else {
      break
    }
  }

  if (streakWeeks >= 7) award('streak_7')
  if (streakWeeks >= 30) award('streak_30')
  if (streakWeeks >= 52) award('streak_52')

  // Belt achievements
  const belt = profileRes.data?.belt_rank
  if (belt === 'blue') award('blue_belt')
  if (belt === 'purple') award('purple_belt')
  if (belt === 'brown') award('brown_belt')
  if (belt === 'black') award('black_belt')

  // Competition achievements
  if ((compRes.count ?? 0) >= 1) award('first_comp')
  if ((goldRes.count ?? 0) >= 1) award('comp_gold')

  // Insert new achievements
  if (toAward.length > 0) {
    await supabase.from('user_achievements').insert(
      toAward.map((id) => ({ user_id: userId, achievement_id: id }))
    )
  }

  return toAward
}

function getISOWeek(date: Date): string {
  const d = new Date(date.getTime())
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}
