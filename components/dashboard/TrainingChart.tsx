'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface WeekData {
  label: string
  count: number
  minutes: number
}

export default function TrainingChart({ userId, weekGoal = 3 }: { userId: string; weekGoal?: number }) {
  const [weeks, setWeeks] = useState<WeekData[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'count' | 'minutes'>('count')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const now = new Date()
      const twelveWeeksAgo = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000)

      const { data } = await supabase
        .from('training_sessions')
        .select('date, duration_min')
        .eq('user_id', userId)
        .gte('date', twelveWeeksAgo.toISOString().split('T')[0])
        .order('date')

      if (!data) {
        setLoading(false)
        return
      }

      // Group by ISO week
      const weekMap = new Map<string, { count: number; minutes: number }>()

      // Pre-fill 12 weeks
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
        const key = getWeekKey(d)
        weekMap.set(key, { count: 0, minutes: 0 })
      }

      for (const session of data) {
        const d = new Date(session.date + 'T00:00:00')
        const key = getWeekKey(d)
        const existing = weekMap.get(key)
        if (existing) {
          existing.count++
          existing.minutes += session.duration_min ?? 0
        }
      }

      const result: WeekData[] = []
      const currentYear = now.getFullYear().toString()
      weekMap.forEach((value, key) => {
        const [year, w] = key.split('-W')
        const label = year !== currentYear ? `U${w}'${year.slice(2)}` : `U${w}`
        result.push({ label, ...value })
      })

      setWeeks(result)
      setLoading(false)
    }
    load()
  }, [userId])

  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-4 border border-white/5">
        <div className="h-40 animate-pulse bg-surface-hover rounded" />
      </div>
    )
  }

  if (weeks.length === 0) return null

  const values = weeks.map((w) => mode === 'count' ? w.count : w.minutes)
  const maxVal = Math.max(...values, 1)

  return (
    <div className="bg-surface rounded-xl p-4 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Siste 12 uker</h3>
        <div className="flex gap-1 bg-background rounded-lg p-0.5">
          <button
            onClick={() => setMode('count')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === 'count' ? 'bg-primary text-background' : 'text-muted hover:text-foreground'
            }`}
          >
            Treninger
          </button>
          <button
            onClick={() => setMode('minutes')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === 'minutes' ? 'bg-primary text-background' : 'text-muted hover:text-foreground'
            }`}
          >
            Minutter
          </button>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1 h-32 relative">
        {/* Goal line (only in count mode) */}
        {mode === 'count' && weekGoal <= maxVal && (
          <div
            className="absolute left-0 right-0 border-t border-dashed border-primary/40 pointer-events-none z-10"
            style={{ bottom: `${(weekGoal / maxVal) * 100 + 16}px` }}
          >
            <span className="absolute -top-3 right-0 text-[9px] text-primary/60 font-medium">
              Mål: {weekGoal}
            </span>
          </div>
        )}
        {weeks.map((w, i) => {
          const val = mode === 'count' ? w.count : w.minutes
          const height = maxVal > 0 ? (val / maxVal) * 100 : 0
          const meetsGoal = mode === 'count' && val >= weekGoal
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className={`text-[10px] font-medium ${val > 0 ? 'text-foreground' : 'text-transparent'}`}>
                {val}
              </span>
              <div className="w-full flex items-end" style={{ height: '100px' }}>
                <div
                  className={`w-full rounded-t transition-all duration-500 ${
                    meetsGoal ? 'bg-green-500' : val > 0 ? 'bg-primary' : 'bg-white/5'
                  }`}
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
              </div>
              <span className="text-[9px] text-muted">{w.label}</span>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="flex justify-between mt-3 pt-3 border-t border-white/5 text-xs text-muted">
        <span>Snitt: {(values.reduce((a, b) => a + b, 0) / weeks.length).toFixed(1)} {mode === 'count' ? 'per uke' : 'min/uke'}</span>
        <span>Totalt: {values.reduce((a, b) => a + b, 0)} {mode === 'count' ? 'treninger' : 'min'}</span>
      </div>
    </div>
  )
}

function getWeekKey(date: Date): string {
  const d = new Date(date.getTime())
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}
