'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CompetitionResult, CompetitionSource } from '@/lib/types/database'

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

export default function CompetitionForm({ locale }: { locale: string }) {
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0])
  const [organization, setOrganization] = useState('')
  const [weightClass, setWeightClass] = useState('')
  const [beltDivision, setBeltDivision] = useState('')
  const [giNogi, setGiNogi] = useState<'gi' | 'nogi'>('gi')
  const [result, setResult] = useState<CompetitionResult | ''>('')
  const [wins, setWins] = useState('0')
  const [losses, setLosses] = useState('0')
  const [source, setSource] = useState<CompetitionSource>('manual')
  const [sourceUrl, setSourceUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventName.trim()) return
    setSaving(true)
    setError(null)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) { setSaving(false); return }

    const { error: insertError } = await supabase.from('competitions').insert({
      user_id: sessionData.session.user.id,
      event_name: eventName.trim(),
      event_date: eventDate || null,
      organization: organization || null,
      weight_class: weightClass || null,
      belt_division: beltDivision || null,
      gi_nogi: giNogi,
      result: result || null,
      wins: parseInt(wins),
      losses: parseInt(losses),
      source,
      source_url: sourceUrl || null,
      verified: source !== 'manual',
      notes: notes || null,
    })

    if (insertError) {
      setError('Noe gikk galt')
      setSaving(false)
      return
    }

    router.push(`/${locale}/competitions`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted mb-2">Arrangement *</label>
        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)}
          placeholder="Oslo Open 2026" required
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Dato</label>
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Organisasjon</label>
          <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)}
            placeholder="IBJJF, SJJIF..."
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Vektklasse</label>
          <input type="text" value={weightClass} onChange={(e) => setWeightClass(e.target.value)}
            placeholder="-76kg"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Beltedivisjon</label>
          <input type="text" value={beltDivision} onChange={(e) => setBeltDivision(e.target.value)}
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
          <input type="number" value={wins} onChange={(e) => setWins(e.target.value)} min="0"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-2">Tap</label>
          <input type="number" value={losses} onChange={(e) => setLosses(e.target.value)} min="0"
            className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
        </div>
      </div>

      {/* Source */}
      <section className="bg-surface rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-bold">Kilde</h3>
        <div>
          <select value={source} onChange={(e) => setSource(e.target.value as CompetitionSource)}
            className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary">
            {SOURCES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        {source !== 'manual' && (
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Lenke til resultat</label>
            <input type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://smoothcomp.com/..."
              className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
        )}
      </section>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">Notater</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={saving}
        className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
        {saving ? 'Lagrer...' : 'Lagre konkurranse'}
      </button>
    </form>
  )
}
