'use client'

import { useTranslations } from 'next-intl'

interface MonthComparisonProps {
  sessions: {
    date: string
    duration_min: number | null
    effort_rpe: number | null
  }[]
  techniqueCount: {
    thisMonth: number
    lastMonth: number
  }
}

function getMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function MonthComparison({ sessions, techniqueCount }: MonthComparisonProps) {
  const t = useTranslations('progress')

  const now = new Date()
  const thisMonthKey = getMonthKey(now)
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthKey = getMonthKey(lastMonth)

  const thisMonthSessions = sessions.filter((s) => s.date.startsWith(thisMonthKey))
  const lastMonthSessions = sessions.filter((s) => s.date.startsWith(lastMonthKey))

  const thisMonthName = now.toLocaleDateString('no-NO', { month: 'long' })
  const lastMonthName = lastMonth.toLocaleDateString('no-NO', { month: 'long' })

  const metrics = [
    {
      label: t('sessions'),
      current: thisMonthSessions.length,
      previous: lastMonthSessions.length,
    },
    {
      label: t('hours'),
      current: Math.round(
        thisMonthSessions.reduce((sum, s) => sum + (s.duration_min ?? 0), 0) / 60
      ),
      previous: Math.round(
        lastMonthSessions.reduce((sum, s) => sum + (s.duration_min ?? 0), 0) / 60
      ),
    },
    {
      label: t('avgRpe'),
      current: thisMonthSessions.filter((s) => s.effort_rpe).length > 0
        ? +(
            thisMonthSessions
              .filter((s) => s.effort_rpe)
              .reduce((sum, s) => sum + (s.effort_rpe ?? 0), 0) /
            thisMonthSessions.filter((s) => s.effort_rpe).length
          ).toFixed(1)
        : 0,
      previous: lastMonthSessions.filter((s) => s.effort_rpe).length > 0
        ? +(
            lastMonthSessions
              .filter((s) => s.effort_rpe)
              .reduce((sum, s) => sum + (s.effort_rpe ?? 0), 0) /
            lastMonthSessions.filter((s) => s.effort_rpe).length
          ).toFixed(1)
        : 0,
    },
    {
      label: t('techniquesCount'),
      current: techniqueCount.thisMonth,
      previous: techniqueCount.lastMonth,
    },
  ]

  return (
    <div className="bg-surface rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
        {t('comparison')}
      </h3>

      {/* Column headers */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-muted">
        <div />
        <div className="text-center font-medium text-primary capitalize">{thisMonthName}</div>
        <div className="text-center font-medium capitalize">{lastMonthName}</div>
      </div>

      <div className="space-y-3">
        {metrics.map(({ label, current, previous }) => {
          const diff = current - previous
          const showArrow = previous > 0 || current > 0

          return (
            <div key={label} className="grid grid-cols-3 gap-2 items-center">
              <div className="text-xs text-muted">{label}</div>
              <div className="text-center">
                <span className="text-lg font-bold text-foreground tabular-nums">
                  {current}
                </span>
                {showArrow && diff !== 0 && (
                  <span
                    className={`text-[10px] ml-1 ${
                      diff > 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {diff > 0 ? '+' : ''}{diff}
                  </span>
                )}
              </div>
              <div className="text-center">
                <span className="text-lg font-bold text-muted tabular-nums">
                  {previous}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
