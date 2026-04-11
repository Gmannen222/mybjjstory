'use client'

import type { Feedback } from '@/lib/types/database'

const TYPE_ICONS: Record<string, string> = {
  suggestion: '💡',
  wish: '🌟',
  bug: '🐛',
  other: '💬',
}

const TYPE_LABELS: Record<string, string> = {
  suggestion: 'Forslag',
  wish: 'Ønske',
  bug: 'Feilrapport',
  other: 'Annet',
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Sendt',
  read: 'Lest',
  resolved: 'Løst',
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-400/20 text-blue-400',
  read: 'bg-yellow-400/20 text-yellow-400',
  resolved: 'bg-green-400/20 text-green-400',
}

export default function MyFeedbackList({ feedback }: { feedback: Feedback[] }) {
  if (feedback.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-8 text-center">
        <p className="text-muted text-sm">Du har ikke sendt noen tilbakemeldinger ennå</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {feedback.map((fb) => (
        <div key={fb.id} className="bg-surface rounded-xl p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm">
              <span>{TYPE_ICONS[fb.type] || '💬'}</span>
              <span className="font-medium">{TYPE_LABELS[fb.type] || 'Annet'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[fb.status] || ''}`}
              >
                {STATUS_LABELS[fb.status] || fb.status}
              </span>
              <span className="text-xs text-muted">
                {new Date(fb.created_at).toLocaleDateString('nb-NO', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm whitespace-pre-wrap">{fb.message}</p>

          {/* Admin reply */}
          {fb.admin_reply && (
            <div className="mt-3 border border-primary/20 bg-primary/5 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs font-medium text-primary">Svar fra MyBJJStory</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{fb.admin_reply}</p>
              {fb.replied_at && (
                <p className="text-xs text-muted mt-2">
                  {new Date(fb.replied_at).toLocaleDateString('nb-NO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
