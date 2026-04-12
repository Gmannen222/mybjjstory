'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { moderateContent, reviewReport } from '@/lib/actions/moderation'
import type { ContentType, ModerationStatus } from '@/lib/actions/moderation'

interface ReportItem {
  id: string
  content_type: ContentType
  content_id: string
  reason: string
  description: string | null
  status: string
  created_at: string
  reporter: { display_name: string | null } | null
  content_preview: string | null
  content_author: string | null
  content_moderation_status: ModerationStatus
  report_count: number
}

const REASON_LABELS: Record<string, string> = {
  inappropriate: 'Upassende innhold',
  spam: 'Spam',
  harassment: 'Trakassering',
  other: 'Annet',
}

const REASON_COLORS: Record<string, string> = {
  inappropriate: 'bg-red-400/20 text-red-400',
  spam: 'bg-yellow-400/20 text-yellow-400',
  harassment: 'bg-orange-400/20 text-orange-400',
  other: 'bg-blue-400/20 text-blue-400',
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  post: 'Innlegg',
  comment: 'Kommentar',
  media: 'Media',
}

export default function AdminModerationList({
  reports,
}: {
  reports: ReportItem[]
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (reports.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-8 text-center">
        <p className="text-muted">Ingen rapporter i denne kategorien.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          expanded={expandedId === report.id}
          onToggle={() => setExpandedId(expandedId === report.id ? null : report.id)}
        />
      ))}
    </div>
  )
}

function ReportCard({
  report,
  expanded,
  onToggle,
}: {
  report: ReportItem
  expanded: boolean
  onToggle: () => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleModerate(status: ModerationStatus) {
    setError(null)
    setLoading(status)
    const result = await moderateContent(report.content_type, report.content_id, status)
    setLoading(null)
    if (!result.success) {
      setError(result.error || 'Noe gikk galt')
      return
    }
    router.refresh()
  }

  async function handleDismiss() {
    setError(null)
    setLoading('dismiss')
    const result = await reviewReport(report.id, 'dismissed')
    setLoading(null)
    if (!result.success) {
      setError(result.error || 'Noe gikk galt')
      return
    }
    router.refresh()
  }

  const isModerated = report.content_moderation_status !== 'active'

  return (
    <div className={`bg-surface rounded-xl overflow-hidden ${isModerated ? 'opacity-60' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${REASON_COLORS[report.reason] || ''}`}>
              {REASON_LABELS[report.reason]}
            </span>
            <span className="text-xs text-muted">
              {CONTENT_TYPE_LABELS[report.content_type]}
            </span>
            {report.report_count > 1 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-400/20 text-red-400 font-medium">
                {report.report_count} rapporter
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isModerated && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/20 text-green-400 font-medium">
                {report.content_moderation_status === 'hidden' ? 'Skjult' : 'Fjernet'}
              </span>
            )}
            <span className="text-xs text-muted">
              {new Date(report.created_at).toLocaleDateString('nb-NO', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className="text-muted text-sm">{expanded ? '▲' : '▼'}</span>
          </div>
        </div>

        <div className="mt-2 text-sm">
          <span className="text-muted">Av: </span>
          <span>{report.content_author || 'Ukjent'}</span>
        </div>
        {report.content_preview && (
          <p className="text-sm text-muted mt-1 line-clamp-2">{report.content_preview}</p>
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</div>
          )}

          {/* Full content preview */}
          {report.content_preview && (
            <div className="bg-background/50 rounded-lg p-4">
              <p className="text-xs text-muted mb-1 font-medium">Innhold:</p>
              <p className="text-sm whitespace-pre-wrap">{report.content_preview}</p>
            </div>
          )}

          {/* Report details */}
          {report.description && (
            <div>
              <p className="text-xs text-muted mb-1 font-medium">Beskrivelse fra rapportør:</p>
              <p className="text-sm">{report.description}</p>
            </div>
          )}

          <div className="text-xs text-muted">
            Rapportert av: {report.reporter?.display_name || 'Anonym'}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            {report.content_moderation_status === 'active' ? (
              <>
                <button
                  onClick={() => handleModerate('hidden')}
                  disabled={loading !== null}
                  className="px-4 py-2 text-xs rounded-lg bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-colors font-medium disabled:opacity-50"
                >
                  {loading === 'hidden' ? '...' : 'Skjul innhold'}
                </button>
                <button
                  onClick={() => handleModerate('removed')}
                  disabled={loading !== null}
                  className="px-4 py-2 text-xs rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors font-medium disabled:opacity-50"
                >
                  {loading === 'removed' ? '...' : 'Fjern innhold'}
                </button>
                <button
                  onClick={handleDismiss}
                  disabled={loading !== null}
                  className="px-4 py-2 text-xs rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors font-medium disabled:opacity-50"
                >
                  {loading === 'dismiss' ? '...' : 'Avvis rapport (OK)'}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleModerate('active')}
                disabled={loading !== null}
                className="px-4 py-2 text-xs rounded-lg bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-colors font-medium disabled:opacity-50"
              >
                {loading === 'active' ? '...' : 'Gjenopprett innhold'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
