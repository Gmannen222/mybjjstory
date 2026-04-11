'use client'

import { useState, useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createCompetition, updateCompetition, deleteCompetition } from '@/lib/actions/competitions'
import SubmitButton from '@/components/ui/SubmitButton'
import type { Competition, CompetitionResult, CompetitionSource } from '@/lib/types/database'

const RESULT_OPTIONS: { value: CompetitionResult; icon: string }[] = [
  { value: 'gold', icon: '🥇' },
  { value: 'silver', icon: '🥈' },
  { value: 'bronze', icon: '🥉' },
  { value: 'participant', icon: '🏆' },
]

const SOURCE_OPTIONS: CompetitionSource[] = ['manual', 'smoothcomp', 'ibjjf', 'adcc', 'other']

export default function CompetitionForm({
  locale,
  competition,
}: {
  locale: string
  competition?: Competition
}) {
  const isEdit = !!competition
  const router = useRouter()
  const t = useTranslations('competitions')
  const tc = useTranslations('common')

  // Hidden field state for button-selected values
  const [giNogi, setGiNogi] = useState<'gi' | 'nogi'>(competition?.gi_nogi ?? 'gi')
  const [result, setResult] = useState<CompetitionResult | ''>(competition?.result ?? '')
  const [source, setSource] = useState<CompetitionSource>(competition?.source ?? 'manual')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [createState, createAction] = useActionState(createCompetition, { success: false, error: '' })
  const [updateState, updateAction] = useActionState(updateCompetition, { success: false, error: '' })
  const state = isEdit ? updateState : createState
  const formAction = isEdit ? updateAction : createAction

  // Redirect on success
  useEffect(() => {
    if (state.success) {
      router.push(`/${locale}/competitions?saved=true`)
      router.refresh()
    }
  }, [state.success, locale, router])

  const handleDelete = async () => {
    if (!competition) return
    setDeleting(true)
    setDeleteError(null)

    const result = await deleteCompetition(competition.id)
    if (!result.success) {
      setDeleteError(result.error)
      setDeleting(false)
      return
    }

    router.push(`/${locale}/competitions`)
    router.refresh()
  }

  return (
    <form action={formAction} className="space-y-6">
      {isEdit && <input type="hidden" name="competition_id" value={competition.id} />}
      <input type="hidden" name="gi_nogi" value={giNogi} />
      <input type="hidden" name="result" value={result} />
      <input type="hidden" name="source" value={source} />

      <div>
        <label className="block text-sm font-medium text-muted mb-2">{t('event')} *</label>
        <input type="text" name="event_name" defaultValue={competition?.event_name ?? ''}
          placeholder="Oslo Open 2026" required
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">{t('date')}</label>
          <input type="date" name="event_date" defaultValue={competition?.event_date ?? new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">{t('organization')}</label>
          <input type="text" name="organization" defaultValue={competition?.organization ?? ''}
            placeholder="IBJJF, SJJIF..."
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">{t('weightClass')}</label>
          <input type="text" name="weight_class" defaultValue={competition?.weight_class ?? ''}
            placeholder="-76kg"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">{t('beltDivision')}</label>
          <input type="text" name="belt_division" defaultValue={competition?.belt_division ?? ''}
            placeholder="Blue belt adult"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">{t('giNogi')}</label>
        <div className="flex gap-2">
          {(['gi', 'nogi'] as const).map((opt) => (
            <button key={opt} type="button" onClick={() => setGiNogi(opt)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                giNogi === opt ? 'bg-primary text-background' : 'bg-surface text-muted hover:text-foreground'
              }`}>
              {opt === 'gi' ? 'Gi' : 'No-Gi'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">{t('result')}</label>
        <div className="flex flex-wrap gap-2">
          {RESULT_OPTIONS.map(({ value, icon }) => (
            <button key={value} type="button" onClick={() => setResult(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                result === value ? 'bg-primary text-background scale-105' : 'bg-surface text-muted hover:text-foreground'
              }`}>
              {icon} {t(`results.${value}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">{t('wins')}</label>
          <input type="number" name="wins" defaultValue={competition?.wins ?? 0} min="0"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">{t('losses')}</label>
          <input type="number" name="losses" defaultValue={competition?.losses ?? 0} min="0"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      {/* Source */}
      <section className="bg-surface rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-bold">{t('source')}</h3>
        <div>
          <select value={source} onChange={(e) => setSource(e.target.value as CompetitionSource)}
            className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-foreground [&>option]:text-black [&>option]:bg-white focus:outline-none focus:border-primary">
            {SOURCE_OPTIONS.map((value) => (
              <option key={value} value={value}>{t(`sources.${value}`)}</option>
            ))}
          </select>
        </div>
        {source !== 'manual' && (
          <div>
            <label className="block text-sm font-medium text-muted mb-2">{t('sourceUrl')}</label>
            <input type="url" name="source_url" defaultValue={competition?.source_url ?? ''}
              placeholder="https://smoothcomp.com/..."
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
        )}
      </section>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">{t('notes')}</label>
        <textarea name="notes" defaultValue={competition?.notes ?? ''} rows={3}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none" />
      </div>

      {!state.success && state.error && <p className="text-red-500 text-sm">{state.error}</p>}

      <SubmitButton
        pendingText={tc('saving')}
        className="w-full py-3"
      >
        {isEdit ? t('update') : t('save')}
      </SubmitButton>

      {isEdit && (
        <div className="flex justify-center">
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 text-sm text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              {t('delete')}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2.5 text-sm text-muted border border-white/10 rounded-xl hover:bg-surface-hover transition-colors"
              >
                {tc('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2.5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {deleting ? tc('deleting') : 'Ja, slett'}
              </button>
            </div>
          )}
          {deleteError && <p className="text-red-500 text-sm mt-2">{deleteError}</p>}
        </div>
      )}
    </form>
  )
}
