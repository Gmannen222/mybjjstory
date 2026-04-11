'use client'

import { useState, useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { createInjury, updateInjury, deleteInjury, markInjuryRecovered } from '@/lib/actions/injuries'
import SubmitButton from '@/components/ui/SubmitButton'
import type { Injury, InjuryType, Severity, TrainingImpact } from '@/lib/types/database'

const BODY_PARTS = [
  'Kne', 'Skulder', 'Nakke', 'Rygg', 'Fingre', 'Ribben',
  'Ankel', 'Håndledd', 'Albue', 'Hofte', 'Tær', 'Øre',
  'Nese', 'Kjeve', 'Annet',
]

const INJURY_TYPES: { value: InjuryType; label: string }[] = [
  { value: 'sprain', label: 'Forstuing' },
  { value: 'tear', label: 'Ruptur / avrivning' },
  { value: 'fracture', label: 'Brudd' },
  { value: 'bruise', label: 'Blåmerke / klemskade' },
  { value: 'dislocation', label: 'Luksasjon' },
  { value: 'other', label: 'Annet' },
]

const SEVERITIES: { value: Severity; label: string; color: string }[] = [
  { value: 'mild', label: 'Mild', color: 'text-yellow-400' },
  { value: 'moderate', label: 'Moderat', color: 'text-orange-400' },
  { value: 'severe', label: 'Alvorlig', color: 'text-red-400' },
]

const IMPACTS: { value: TrainingImpact; label: string }[] = [
  { value: 'none', label: 'Ingen påvirkning' },
  { value: 'modified', label: 'Tilpasset trening' },
  { value: 'rest', label: 'Full hvile' },
]

export default function InjuryForm({
  locale,
  injury,
}: {
  locale: string
  injury?: Injury
}) {
  const isEdit = !!injury
  const router = useRouter()

  // Hidden field state for button-selected values
  const [bodyPart, setBodyPart] = useState(injury?.body_part ?? '')
  const [severity, setSeverity] = useState<Severity>(injury?.severity ?? 'mild')
  const [trainingImpact, setTrainingImpact] = useState<TrainingImpact>(injury?.training_impact ?? 'none')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [recovering, setRecovering] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [createState, createAction] = useActionState(createInjury, { success: false, error: '' })
  const [updateState, updateAction] = useActionState(updateInjury, { success: false, error: '' })
  const state = isEdit ? updateState : createState
  const formAction = isEdit ? updateAction : createAction

  // Redirect on success
  useEffect(() => {
    if (state.success) {
      router.push(`/${locale}/injuries?saved=true`)
      router.refresh()
    }
  }, [state.success, locale, router])

  const handleMarkRecovered = async () => {
    if (!injury) return
    setRecovering(true)

    const result = await markInjuryRecovered(injury.id)
    if (!result.success) {
      setDeleteError(result.error)
      setRecovering(false)
      return
    }

    router.push(`/${locale}/injuries`)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!injury) return
    setDeleting(true)
    setDeleteError(null)

    const result = await deleteInjury(injury.id)
    if (!result.success) {
      setDeleteError(result.error)
      setDeleting(false)
      return
    }

    router.push(`/${locale}/injuries`)
    router.refresh()
  }

  return (
    <form action={formAction} className="space-y-6">
      {isEdit && <input type="hidden" name="injury_id" value={injury.id} />}
      <input type="hidden" name="body_part" value={bodyPart} />
      <input type="hidden" name="severity" value={severity} />
      <input type="hidden" name="training_impact" value={trainingImpact} />

      {/* Mark as recovered quick action */}
      {isEdit && !injury.date_recovered && (
        <button type="button" onClick={handleMarkRecovered} disabled={recovering}
          className="w-full py-3 bg-green-500/10 text-green-400 font-semibold rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50">
          {recovering ? 'Oppdaterer...' : '✓ Marker som frisk'}
        </button>
      )}

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Kroppsdel *</label>
        <div className="flex flex-wrap gap-2">
          {BODY_PARTS.map((part) => (
            <button key={part} type="button" onClick={() => setBodyPart(part)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                bodyPart === part ? 'bg-primary text-background' : 'bg-surface text-muted hover:text-foreground'
              }`}>
              {part}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Type skade</label>
        <select name="injury_type" defaultValue={injury?.injury_type ?? ''}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground [&>option]:text-black [&>option]:bg-white focus:outline-none focus:border-primary">
          <option value="">Velg...</option>
          {INJURY_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Alvorlighetsgrad</label>
        <div className="flex gap-2">
          {SEVERITIES.map(({ value, label, color }) => (
            <button key={value} type="button" onClick={() => setSeverity(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                severity === value ? `bg-surface ring-2 ring-primary ${color}` : 'bg-surface text-muted'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Påvirkning på trening</label>
        <div className="flex flex-wrap gap-2">
          {IMPACTS.map(({ value, label }) => (
            <button key={value} type="button" onClick={() => setTrainingImpact(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                trainingImpact === value ? 'bg-primary text-background' : 'bg-surface text-muted hover:text-foreground'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Beskrivelse</label>
        <input type="text" name="description" defaultValue={injury?.description ?? ''}
          placeholder="Kort beskrivelse av skaden"
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Dato skadet</label>
          <input type="date" name="date_occurred" defaultValue={injury?.date_occurred ?? new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Dato frisk (valgfritt)</label>
          <input type="date" name="date_recovered" defaultValue={injury?.date_recovered ?? ''}
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Notater</label>
        <textarea name="notes" defaultValue={injury?.notes ?? ''} rows={3}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none" />
      </div>

      {!state.success && state.error && <p className="text-red-500 text-sm">{state.error}</p>}
      {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}

      <SubmitButton
        pendingText="Lagrer..."
        className="w-full py-3"
      >
        {isEdit ? 'Oppdater skade' : 'Lagre skade'}
      </SubmitButton>

      {isEdit && (
        <div className="flex justify-center">
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 text-sm text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              Slett skade
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
        </div>
      )}
    </form>
  )
}
