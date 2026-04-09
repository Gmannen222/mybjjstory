'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  const [bodyPart, setBodyPart] = useState(injury?.body_part ?? '')
  const [injuryType, setInjuryType] = useState<InjuryType | ''>(injury?.injury_type ?? '')
  const [description, setDescription] = useState(injury?.description ?? '')
  const [dateOccurred, setDateOccurred] = useState(injury?.date_occurred ?? new Date().toISOString().split('T')[0])
  const [dateRecovered, setDateRecovered] = useState(injury?.date_recovered ?? '')
  const [severity, setSeverity] = useState<Severity>(injury?.severity ?? 'mild')
  const [trainingImpact, setTrainingImpact] = useState<TrainingImpact>(injury?.training_impact ?? 'none')
  const [notes, setNotes] = useState(injury?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bodyPart) return
    setSaving(true)
    setError(null)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) { setSaving(false); return }

    const payload = {
      body_part: bodyPart,
      injury_type: injuryType || null,
      description: description || null,
      date_occurred: dateOccurred,
      date_recovered: dateRecovered || null,
      severity,
      training_impact: trainingImpact,
      notes: notes || null,
    }

    const { error: dbError } = isEdit
      ? await supabase.from('injuries').update(payload).eq('id', injury.id)
      : await supabase.from('injuries').insert({ ...payload, user_id: sessionData.session.user.id })

    if (dbError) {
      setError('Noe gikk galt')
      setSaving(false)
      return
    }

    router.push(`/${locale}/injuries`)
    router.refresh()
  }

  const handleMarkRecovered = async () => {
    if (!injury) return
    setSaving(true)
    const today = new Date().toISOString().split('T')[0]

    const { error: dbError } = await supabase
      .from('injuries')
      .update({ date_recovered: today })
      .eq('id', injury.id)

    if (dbError) {
      setError('Kunne ikke oppdatere')
      setSaving(false)
      return
    }

    router.push(`/${locale}/injuries`)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!injury || !confirm('Er du sikker på at du vil slette denne skaden?')) return
    setDeleting(true)

    const { error: dbError } = await supabase.from('injuries').delete().eq('id', injury.id)

    if (dbError) {
      setError('Kunne ikke slette')
      setDeleting(false)
      return
    }

    router.push(`/${locale}/injuries`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mark as recovered quick action */}
      {isEdit && !injury.date_recovered && (
        <button type="button" onClick={handleMarkRecovered} disabled={saving}
          className="w-full py-3 bg-green-500/10 text-green-400 font-semibold rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50">
          ✓ Marker som frisk
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
        <select value={injuryType} onChange={(e) => setInjuryType(e.target.value as InjuryType)}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary">
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
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Kort beskrivelse av skaden"
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Dato skadet</label>
          <input type="date" value={dateOccurred} onChange={(e) => setDateOccurred(e.target.value)}
            required
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Dato frisk (valgfritt)</label>
          <input type="date" value={dateRecovered} onChange={(e) => setDateRecovered(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Notater</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={saving}
        className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
        {saving ? 'Lagrer...' : isEdit ? 'Oppdater skade' : 'Lagre skade'}
      </button>

      {isEdit && (
        <button type="button" onClick={handleDelete} disabled={deleting}
          className="w-full py-3 bg-red-500/10 text-red-400 font-semibold rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50">
          {deleting ? 'Sletter...' : 'Slett skade'}
        </button>
      )}
    </form>
  )
}
