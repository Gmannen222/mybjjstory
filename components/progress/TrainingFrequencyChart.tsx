'use client'

import { useTranslations } from 'next-intl'

interface MonthData {
  label: string
  count: number
  byType: Record<string, number>
  isCurrent: boolean
}

interface TrainingFrequencyChartProps {
  sessions: { date: string; type: string }[]
}

const TYPE_COLORS: Record<string, string> = {
  gi: '#c9a84c',
  nogi: '#6366f1',
  open_mat: '#22c55e',
  private: '#f59e0b',
  competition: '#ef4444',
  seminar: '#8b5cf6',
  competition_prep: '#ec4899',
}

export default function TrainingFrequencyChart({ sessions }: TrainingFrequencyChartProps) {
  const t = useTranslations('progress')

  const now = new Date()
  const months: MonthData[] = []

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()
    const key = `${year}-${String(month + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('no-NO', { month: 'short' }).replace('.', '')

    const monthSessions = sessions.filter((s) => s.date.startsWith(key))
    const byType: Record<string, number> = {}
    for (const s of monthSessions) {
      byType[s.type] = (byType[s.type] || 0) + 1
    }

    months.push({
      label: i === 0 ? label : label,
      count: monthSessions.length,
      byType,
      isCurrent: i === 0,
    })
  }

  const maxVal = Math.max(...months.map((m) => m.count), 1)

  return (
    <div className="bg-surface rounded-xl p-4 border border-white/5">
      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
        {t('frequency')}
      </h3>

      <div className="flex items-end gap-1.5 h-36">
        {months.map((m, i) => {
          const height = maxVal > 0 ? (m.count / maxVal) * 100 : 0
          const types = Object.entries(m.byType)

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
              <span
                className={`text-[10px] font-medium ${
                  m.count > 0 ? 'text-foreground' : 'text-transparent'
                }`}
              >
                {m.count}
              </span>
              <div className="w-full flex items-end" style={{ height: '110px' }}>
                <div
                  className="w-full rounded-t overflow-hidden transition-all duration-500"
                  style={{ height: `${Math.max(height, 4)}%` }}
                >
                  {m.count > 0 ? (
                    <div className="flex flex-col-reverse h-full">
                      {types.map(([type, count]) => (
                        <div
                          key={type}
                          style={{
                            backgroundColor: TYPE_COLORS[type] || '#c9a84c',
                            height: `${(count / m.count) * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white/5" />
                  )}
                </div>
              </div>
              <span
                className={`text-[9px] ${
                  m.isCurrent ? 'text-primary font-semibold' : 'text-muted'
                }`}
              >
                {m.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-white/5">
        {Object.entries(TYPE_COLORS).map(([type, color]) => {
          const total = sessions.filter((s) => s.type === type).length
          if (total === 0) return null
          return (
            <div key={type} className="flex items-center gap-1.5 text-[10px] text-muted">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{t(`types.${type}`)}</span>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="flex justify-between mt-2 text-xs text-muted">
        <span>
          {t('average')}: {(sessions.length / 12).toFixed(1)} {t('perMonth')}
        </span>
        <span>
          {t('total')}: {sessions.length} {t('sessions')}
        </span>
      </div>
    </div>
  )
}
