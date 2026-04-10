'use client'

import { useState } from 'react'

export default function TrainingViewToggle({
  listView,
  calendarView,
}: {
  listView: React.ReactNode
  calendarView: React.ReactNode
}) {
  const [view, setView] = useState<'list' | 'calendar'>('list')

  return (
    <>
      {/* Toggle buttons */}
      <div className="flex gap-1 bg-surface rounded-lg p-1 mb-6">
        <button
          type="button"
          onClick={() => setView('list')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            view === 'list' ? 'bg-primary text-background' : 'text-muted hover:text-foreground'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Liste
        </button>
        <button
          type="button"
          onClick={() => setView('calendar')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            view === 'calendar' ? 'bg-primary text-background' : 'text-muted hover:text-foreground'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          Kalender
        </button>
      </div>

      {/* Content */}
      {view === 'list' ? listView : calendarView}
    </>
  )
}
