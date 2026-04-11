'use client'

import { useState, useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { createCompetition, updateCompetition, deleteCompetition } from '@/lib/actions/competitions'
import SubmitButton from '@/components/ui/SubmitButton'
import type { Competition, CompetitionResult, CompetitionSource } from '@/lib/types/database'

const RESULTS: { value: CompetitionResult; label: string; icon: string }[] = [
  { value: 'gold', label: 'Gull', icon: '🥇' },
  { value: 'silver', label: 'Sølv', icon: '🥈' },
  { value: 'bronze', label: 'Bronse', icon: '🥉' },
  { value: 'participant', label: 'Deltaker', icon: '🏆' },
]

const SOURCES: { value: CompetitionSource; label: string }[] = [
  { value: 'manual', label: 'Manuell registrering' },
  { value: 'smoothcomp', label: 'Smoothcomp' },
  { value: 'ibjjf', label: 'IBJJF' },
  { value: 'adcc', label: 'ADCC' },
  { value: 'other', label: 'Annen kilde' },
]

export default function CompetitionForm({
  locale,
  competition,
}: {
  locale: string
  competition?: Competition
}) {
  const isEdit = !!competition
  const router = useRouter()

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
        <label className="block text-sm font-medium text-muted mb-2">Arrangement *</label>
        <input type="text" name="event_name" defaultValue={competition?.event_name ?? ''}
          placeholder="Oslo Open 2026" required
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Dato</label>
          <input type="date" name="event_date" defaultValue={competition?.event_date ?? new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Organisasjon</label>
          <input type="text" name="organization" defaultValue={competition?.organization ?? ''}
            placeholder="IBJJF, SJJIF..."
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Vektklasse</label>
          <input type="text" name="weight_class" defaultValue={competition?.weight_class ?? ''}
            placeholder="-76kg"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Beltedivisjon</label>
          <input type="text" name="belt_division" defaultValue={competition?.belt_division ?? ''}
            placeholder="Blue belt adult"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Gi / No-Gi</label>
        <div className="flex gap-2">
          {(['gi', 'nogi'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setGiNogi(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                giNogi === t ? 'bg-primary text-background' : 'bg-surface text-muted hover:text-foreground'
              }`}>
              {t === 'gi' ? 'Gi' : 'No-Gi'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Resultat</label>
        <div className="flex flex-wrap gap-2">
          {RESULTS.map(({ value, label, icon }) => (
            <button key={value} type="button" onClick={() => setResult(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                result === value ? 'bg-primary text-background scale-105' : 'bg-surface text-muted hover:text-foreground'
              }`}>
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Seire</label>
          <input type="number" name="wins" defaultValue={competition?.wins ?? 0} min="0"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Tap</label>
          <input type="number" name="losses" defaultValue={competition?.losses ?? 0} min="0"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      {/* Source */}
      <section className="bg-surface rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-bold">Kilde</h3>
        <div>
          <select value={source} onChange={(e) => setSource(e.target.value as CompetitionSource)}
            className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-foreground [&>option]:text-black [&>option]:bg-white focus:outline-none focus:border-primary">
            {SOURCES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        {source !== 'manual' && (
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Lenke til resultat</label>
            <input type="url" name="source_url" defaultValue={competition?.source_url ?? ''}
              placeholder="https://smoothcomp.com/..."
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
        )}
      </section>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Notater</label>
        <textarea name="notes" defaultValue={competition?.notes ?? ''} rows={3}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none" />
      </div>

      {!state.success && state.error && <p className="text-red-500 text-sm">{state.error}</p>}

      <SubmitButton
        pendingText="Lagrer..."
        className="w-full py-3"
      >
        {isEdit ? 'Oppdater konkurranse' : 'Lagre konkurranse'}
      </SubmitButton>

      {isEdit && (
        <div className="flex justify-center">
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 text-sm text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              Slett konkurranse
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2.5 text-sm text-muted border border-white/10 rounded-xl hover:bg-surface-hover transition-colors"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2.5 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Sletter...' : 'Ja, slett'}
              </button>
            </div>
          )}
          {deleteError && <p className="text-red-500 text-sm mt-2">{deleteError}</p>}
        </div>
      )}
    </form>
  )
}
