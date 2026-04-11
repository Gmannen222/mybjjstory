'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

interface StreakCounterProps {
  sessionDates: string[]
}

function getISOWeek(date: Date): string {
  const d = new Date(date.getTime())
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
    )
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function addWeeks(weekKey: string, delta: number): string {
  const [yearStr, weekStr] = weekKey.split('-W')
  const year = parseInt(yearStr)
  const week = parseInt(weekStr)

  // Get the Monday of that ISO week
  const jan4 = new Date(year, 0, 4)
  const monday = new Date(jan4.getTime())
  monday.setDate(monday.getDate() - ((jan4.getDay() + 6) % 7) + (week - 1) * 7)

  // Add delta weeks
  monday.setDate(monday.getDate() + delta * 7)
  return getISOWeek(monday)
}

export default function StreakCounter({ sessionDates }: StreakCounterProps) {
  const t = useTranslations('progress')

  const { currentStreak, longestStreak } = useMemo(() => {
    if (sessionDates.length === 0) return { currentStreak: 0, longestStreak: 0 }

    // Get unique weeks with training
    const weeksSet = new Set<string>()
    for (const dateStr of sessionDates) {
      const d = new Date(dateStr + 'T00:00:00')
      weeksSet.add(getISOWeek(d))
    }

    const currentWeek = getISOWeek(new Date())
    const lastWeek = addWeeks(currentWeek, -1)

    // Calculate current streak (counting back from current or last week)
    let current = 0
    let checkWeek = weeksSet.has(currentWeek) ? currentWeek : lastWeek

    if (weeksSet.has(checkWeek)) {
      while (weeksSet.has(checkWeek)) {
        current++
        checkWeek = addWeeks(checkWeek, -1)
      }
    }

    // Calculate longest streak
    const sortedWeeks = Array.from(weeksSet).sort()
    let longest = 0
    let streak = 1

    for (let i = 1; i < sortedWeeks.length; i++) {
      const expected = addWeeks(sortedWeeks[i - 1], 1)
      if (sortedWeeks[i] === expected) {
        streak++
      } else {
        longest = Math.max(longest, streak)
        streak = 1
      }
    }
    longest = Math.max(longest, streak)

    return { currentStreak: current, longestStreak: longest }
  }, [sessionDates])

  return (
    <div className="bg-surface rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
        {t('streak')}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Current streak */}
        <div className="text-center">
          <div className="text-4xl font-bold text-primary tabular-nums">
            {currentStreak}
          </div>
          <div className="text-xs text-muted mt-1">{t('currentStreak')}</div>
          <div className="text-[10px] text-muted/60 mt-0.5">{t('weeksInRow')}</div>
        </div>

        {/* Longest streak */}
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground tabular-nums">
            {longestStreak}
          </div>
          <div className="text-xs text-muted mt-1">{t('longestStreak')}</div>
          <div className="text-[10px] text-muted/60 mt-0.5">{t('weeksInRow')}</div>
        </div>
      </div>

      {currentStreak > 0 && currentStreak >= longestStreak && (
        <div className="mt-3 pt-3 border-t border-white/5 text-center">
          <span className="text-xs text-primary font-medium">
            {t('personalBest')}
          </span>
        </div>
      )}
    </div>
  )
}
