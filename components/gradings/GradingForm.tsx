'use client'

import { useActionState, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createGrading, updateGrading, deleteGrading } from '@/lib/actions/gradings'
import type { ActionResult } from '@/lib/actions/posts'
import type { BeltRank, Grading, GradingType } from '@/lib/types/database'
import { BELT_COLORS, BELT_LABELS, ADULT_BELTS, KIDS_BELTS, BeltDisplay } from '@/components/ui/BeltBadge'
import SubmitButton from '@/components/ui/SubmitButton'

export default function GradingForm({
  locale,
  grading,
  showKidsBeltsDefault = false,
}: {
  locale: string
  grading?: Grading
  showKidsBeltsDefault?: boolean
}) {
  const isEdit = !!grading
  const [gradingType, setGradingType] = useState<GradingType>(grading?.grading_type ?? 'belt')
  const [beltRank, setBeltRank] = useState<BeltRank>(grading?.belt_rank ?? 'white')
  const [degrees, setDegrees] = useState(String(grading?.belt_degrees ?? 0))
  const [showKidsBelts, setShowKidsBelts] = useState(showKidsBeltsDefault)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const router = useRouter()
  const t = useTranslations('gradings')
  const tCommon = useTranslations('common')

  const initialState: ActionResult<{ id: string }> = { success: false, error: '' }
  const initialUpdateState: ActionResult = { success: false, error: '' }

  const [createState, createAction] = useActionState(createGrading, initialState)
  const [updateState, updateAction] = useActionState(updateGrading, initialUpdateState)

  const formAction = isEdit ? updateAction : createAction
  const formState = isEdit ? updateState : createState

  // Redirect on success
  useEffect(() => {
    if (formState.success) {
      router.push(`/${locale}/gradings?saved=true`)
      router.refresh()
    }
  }, [formState, locale, router])

  const availableBelts = showKidsBelts ? [...KIDS_BELTS, ...ADULT_BELTS.filter((b) => b !== 'white')] : ADULT_BELTS

  const handleDelete = async () => {
    if (!grading) return
    setDeleting(true)
    setDeleteError(null)

    const result = await deleteGrading(grading.id)

    if (!result.success) {
      setDeleteError(result.error)
      setDeleting(false)
      return
    }

    router.push(`/${locale}/gradings`)
    router.refresh()
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields for server action */}
      {isEdit && <input type="hidden" name="grading_id" value={grading.id} />}
      <input type="hidden" name="grading_type" value={gradingType} />
      <input type="hidden" name="belt_rank" value={beltRank} />
      <input type="hidden" name="belt_degrees" value={degrees} />
      <input type="hidden" name="show_kids_belts" value={String(showKidsBelts)} />

      {/* Grading type toggle */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Type gradering
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGradingType('belt')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              gradingType === 'belt'
                ? 'bg-primary text-background'
                : 'bg-surface text-muted hover:text-foreground'
            }`}
          >
            Beltegradering
          </button>
          <button
            type="button"
            onClick={() => setGradingType('stripe')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              gradingType === 'stripe'
                ? 'bg-primary text-background'
                : 'bg-surface text-muted hover:text-foreground'
            }`}
          >
            Stripe
          </button>
        </div>
      </div>

      {/* Kids belts toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={showKidsBelts}
          onChange={(e) => setShowKidsBelts(e.target.checked)}
          className="w-5 h-5 rounded accent-primary"
        />
        <span className="text-sm">Vis barnebelter</span>
        <span className="text-xs text-muted">(grå, gul, oransje, grønn)</span>
      </label>

      {/* Belt selection */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('belt')}
        </label>
        <div className="flex flex-wrap gap-2">
          {availableBelts.map((rank) => {
            const colors = BELT_COLORS[rank]
            const label = BELT_LABELS[rank] ?? rank
            return (
              <button
                key={rank}
                type="button"
                onClick={() => setBeltRank(rank)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  beltRank === rank
                    ? 'ring-2 ring-primary scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Belt preview */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">Forhåndsvisning</label>
        <div className="w-48">
          <BeltDisplay rank={beltRank} degrees={parseInt(degrees) || 0} size="lg" />
        </div>
        <p className="text-xs text-muted mt-1">
          {BELT_LABELS[beltRank]} {parseInt(degrees) > 0 ? `· ${degrees} stripe${parseInt(degrees) > 1 ? 'r' : ''}` : ''}
        </p>
      </div>

      {/* Degrees / stripes */}
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {gradingType === 'stripe' ? 'Stripe nummer' : 'Grader (striper)'}
        </label>
        <input
          type="number"
          value={degrees}
          onChange={(e) => setDegrees(e.target.value)}
          min="0"
          max={beltRank === 'black' ? '6' : '4'}
          className="w-24 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('date')}
        </label>
        <input
          type="date"
          name="date"
          defaultValue={grading?.date ?? new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('instructor')}
        </label>
        <input
          type="text"
          name="instructor_name"
          defaultValue={grading?.instructor_name ?? ''}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('academy')}
        </label>
        <input
          type="text"
          name="academy_name"
          defaultValue={grading?.academy_name ?? ''}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          {t('notes')}
        </label>
        <textarea
          name="notes"
          defaultValue={grading?.notes ?? ''}
          rows={3}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
        />
      </div>

      {!formState.success && formState.error && (
        <p className="text-red-500 text-sm">{formState.error}</p>
      )}

      {deleteError && <p className="text-red-500 text-sm">{deleteError}</p>}

      <SubmitButton
        pendingText={tCommon('saving')}
        className="w-full"
      >
        {isEdit ? 'Oppdater gradering' : tCommon('save')}
      </SubmitButton>

      {isEdit && (
        <div className="flex justify-center">
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2.5 text-sm text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              Slett gradering
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
