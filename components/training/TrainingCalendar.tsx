'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { TrainingType } from '@/lib/types/database'

interface CalendarSession {
  id: string
  date: string
  type: TrainingType
  duration_min: number | null
}

const TYPE_COLORS: Record<TrainingType, string> = {
  gi: 'bg-blue-400',
  nogi: 'bg-purple-400',
  open_mat: 'bg-green-400',
  private: 'bg-amber-400',
  competition: 'bg-red-400',
  seminar: 'bg-cyan-400',
  competition_prep: 'bg-orange-400',
}

const TYPE_ICONS: Record<TrainingType, string> = {
  gi: '🥋',
  nogi: '💪',
  open_mat: '🤸',
  private: '🎓',
  competition: '🏆',
  seminar: '📚',
  competition_prep: '🎯',
}

const WEEKDAYS = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

const MONTH_NAMES = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember',
]

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  // Monday = 0, Sunday = 6
  let startWeekday = firstDay.getDay() - 1
  if (startWeekday < 0) startWeekday = 6
  return { daysInMonth: lastDay.getDate(), startWeekday }
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function TrainingCalendar({
  sessions,
  locale,
}: {
  sessions: CalendarSession[]
  locale: string
}) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const { daysInMonth, startWeekday } = getMonthData(viewYear, viewMonth)

  // Group sessions by date
  const sessionsByDate = new Map<string, CalendarSession[]>()
  for (const s of sessions) {
    const existing = sessionsByDate.get(s.date) || []
    existing.push(s)
    sessionsByDate.set(s.date, existing)
  }

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1)
      setViewMonth(11)
    } else {
      setViewMonth(viewMonth - 1)
    }
    setSelectedDay(null)
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1)
      setViewMonth(0)
    } else {
      setViewMonth(viewMonth + 1)
    }
    setSelectedDay(null)
  }

  const goToday = () => {
    setViewYear(today.getFullYear())
    setViewMonth(today.getMonth())
    setSelectedDay(null)
  }

  // Build calendar grid cells
  const cells: (number | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  const selectedSessions = selectedDay ? sessionsByDate.get(selectedDay) || [] : []

  // Count sessions this month
  const monthTotal = sessions.filter((s) => {
    const [y, m] = s.date.split('-').map(Number)
    return y === viewYear && m === viewMonth + 1
  }).length

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
          aria-label="Forrige måned"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <button type="button" onClick={goToday} className="hover:text-primary transition-colors">
            <h2 className="text-lg font-bold">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
          </button>
          {monthTotal > 0 && (
            <p className="text-xs text-muted">{monthTotal} treninger</p>
          )}
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
          aria-label="Neste måned"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />
          }

          const dateKey = formatDateKey(viewYear, viewMonth, day)
          const daySessions = sessionsByDate.get(dateKey) || []
          const isToday = dateKey === todayKey
          const isSelected = dateKey === selectedDay
          const count = daySessions.length

          // Heatmap intensity
          let heatBg = ''
          if (count === 1) heatBg = 'bg-primary/10'
          else if (count === 2) heatBg = 'bg-primary/20'
          else if (count >= 3) heatBg = 'bg-primary/30'

          const fullDateLabel = new Date(dateKey + 'T00:00:00').toLocaleDateString('no-NO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => setSelectedDay(isSelected ? null : dateKey)}
              aria-label={count > 0 ? `${fullDateLabel}, ${count} trening${count !== 1 ? 'er' : ''}` : fullDateLabel}
              aria-pressed={isSelected}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5
                text-sm transition-all duration-150 relative
                ${heatBg || 'hover:bg-surface-hover'}
                ${isToday ? 'ring-1 ring-primary' : ''}
                ${isSelected ? 'ring-2 ring-primary bg-primary/15' : ''}
                ${count > 0 ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <span className={`text-xs sm:text-sm ${isToday ? 'font-bold text-primary' : count > 0 ? 'font-medium' : 'text-muted'}`}>
                {day}
              </span>
              {count > 0 && (
                <div className="flex gap-0.5">
                  {daySessions.slice(0, 3).map((s, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${TYPE_COLORS[s.type]}`}
                    />
                  ))}
                  {count > 3 && (
                    <span className="text-[8px] text-muted leading-none">+{count - 3}</span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {(Object.entries(TYPE_COLORS) as [TrainingType, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs text-muted">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            {type === 'gi' ? 'Gi' : type === 'nogi' ? 'No-Gi' : type === 'open_mat' ? 'Open Mat' : type === 'private' ? 'Privat' : type === 'competition' ? 'Konkurranse' : type === 'seminar' ? 'Seminar' : type === 'competition_prep' ? 'Konkurranseprep' : type}
          </div>
        ))}
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="mt-4 bg-surface rounded-xl border border-white/5 overflow-hidden animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <h3 className="font-semibold text-sm">
              {new Date(selectedDay + 'T00:00:00').toLocaleDateString('no-NO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h3>
            <Link
              href={`/${locale}/training/new`}
              className="text-xs text-primary hover:text-primary-hover font-medium"
            >
              + Ny trening
            </Link>
          </div>

          {selectedSessions.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted text-sm">
              Ingen treninger denne dagen
              <Link
                href={`/${locale}/training/new`}
                className="block mt-2 text-primary hover:text-primary-hover text-xs font-medium"
              >
                Legg til trening
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {selectedSessions.map((s) => (
                <Link
                  key={s.id}
                  href={`/${locale}/training/${s.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span>{TYPE_ICONS[s.type]}</span>
                    <span className="text-sm font-medium">
                      {s.type === 'gi' ? 'Gi' : s.type === 'nogi' ? 'No-Gi' : s.type === 'open_mat' ? 'Open Mat' : s.type === 'private' ? 'Privattimer' : 'Konkurranse'}
                    </span>
                  </div>
                  {s.duration_min && (
                    <span className="text-xs text-muted">{s.duration_min} min</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
