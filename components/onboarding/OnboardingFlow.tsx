'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { BeltRank } from '@/lib/types/database'
import { BELT_COLORS, BELT_LABELS as ALL_BELT_LABELS, ADULT_BELTS } from '@/components/ui/BeltBadge'

const BELT_RANKS = ADULT_BELTS

const HEARD_FROM_OPTIONS = [
  'Venner / treningspartner',
  'Sosiale medier',
  'Google-søk',
  'Instruktøren min',
  'TheBjjStory.no',
  'Annet',
]

type Step = 'welcome' | 'belt' | 'info' | 'bjj' | 'done'

export default function OnboardingFlow({ locale }: { locale: string }) {
  const [step, setStep] = useState<Step>('welcome')
  const [beltRank, setBeltRank] = useState<BeltRank>('white')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [academyName, setAcademyName] = useState('')
  const [trainingSinceYear, setTrainingSinceYear] = useState('')
  const [currentlyTraining, setCurrentlyTraining] = useState(true)
  const [trainingPreference, setTrainingPreference] = useState<'gi' | 'nogi' | 'both'>('both')
  const [passionLevel, setPassionLevel] = useState(7)
  const [heardFrom, setHeardFrom] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const totalSteps = 3
  const currentStep = step === 'belt' ? 1 : step === 'info' ? 2 : step === 'bjj' ? 3 : 0

  const handleComplete = async () => {
    setSaving(true)
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) return

    await supabase
      .from('profiles')
      .update({
        display_name: displayName || sessionData.session.user.user_metadata?.full_name || null,
        username: username || null,
        belt_rank: beltRank,
        academy_name: academyName || null,
        training_since_year: trainingSinceYear ? parseInt(trainingSinceYear) : null,
        currently_training: currentlyTraining,
        training_preference: trainingPreference,
        passion_level: passionLevel,
        heard_about_from: heardFrom || null,
      })
      .eq('id', sessionData.session.user.id)

    setStep('done')
    setSaving(false)
  }

  // Progress bar
  const ProgressBar = () => (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between text-xs text-muted mb-2">
        <span>Steg {currentStep} av {totalSteps}</span>
      </div>
      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )

  if (step === 'welcome') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-6xl">🥋</div>
          <h1 className="text-3xl font-bold">Velkommen til MyBJJStory!</h1>
          <p className="text-muted text-lg">
            La oss sette opp profilen din slik at du får mest mulig ut av appen. Det tar under ett minutt.
          </p>
          <button
            onClick={() => setStep('belt')}
            className="px-8 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-colors text-lg"
          >
            La oss begynne
          </button>
        </div>
      </div>
    )
  }

  if (step === 'belt') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          <ProgressBar />
          <div className="text-center">
            <h2 className="text-2xl font-bold">Hvilket belte har du?</h2>
          </div>

          <div className="space-y-3">
            {BELT_RANKS.map((rank) => {
              const colors = BELT_COLORS[rank]
              const isSelected = beltRank === rank
              return (
                <button
                  key={rank}
                  onClick={() => setBeltRank(rank)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isSelected
                      ? 'ring-2 ring-primary bg-surface'
                      : 'bg-surface/50 hover:bg-surface'
                  }`}
                >
                  <div
                    className="w-10 h-5 rounded-full"
                    style={{ backgroundColor: colors.bg }}
                  />
                  <span className="font-medium">{ALL_BELT_LABELS[rank]}</span>
                  {isSelected && (
                    <span className="ml-auto text-primary font-bold">✓</span>
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setStep('info')}
            className="w-full py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-colors"
          >
            Neste
          </button>
        </div>
      </div>
    )
  }

  if (step === 'info') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          <ProgressBar />
          <div className="text-center">
            <h2 className="text-2xl font-bold">Litt om deg</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Visningsnavn
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ditt navn"
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Brukernavn
              </label>
              <div className="flex items-center">
                <span className="text-muted mr-1">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                    )
                  }
                  placeholder="brukernavn"
                  className="flex-1 px-4 py-3 bg-surface border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Akademi / klubb (valgfritt)
              </label>
              <input
                type="text"
                value={academyName}
                onChange={(e) => setAcademyName(e.target.value)}
                placeholder="F.eks. Frontline Academy"
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {displayName && !username.trim() && (
            <p className="text-sm text-red-400">Brukernavn er obligatorisk</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('belt')}
              className="px-6 py-4 border border-white/20 rounded-xl hover:bg-surface transition-colors"
            >
              Tilbake
            </button>
            <button
              onClick={() => setStep('bjj')}
              disabled={!username.trim()}
              className="flex-1 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Neste
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'bjj') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6">
          <ProgressBar />
          <div className="text-center">
            <h2 className="text-2xl font-bold">Din BJJ-reise</h2>
            <p className="text-muted text-sm mt-1">Hjelper oss tilpasse opplevelsen for deg</p>
          </div>

          <div className="space-y-5">
            {/* Currently training */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Trener du BJJ i dag?
              </label>
              <div className="flex gap-2">
                {[
                  { value: true, label: 'Ja, aktivt' },
                  { value: false, label: 'Nei, pause' },
                ].map(({ value, label }) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setCurrentlyTraining(value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      currentlyTraining === value
                        ? 'bg-primary text-background'
                        : 'bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Training since */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Hvor lenge har du trent? (startår)
              </label>
              <input
                type="number"
                value={trainingSinceYear}
                onChange={(e) => setTrainingSinceYear(e.target.value)}
                placeholder={`f.eks. ${new Date().getFullYear() - 3}`}
                min="1990"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 bg-surface border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-primary"
              />
              {trainingSinceYear && (
                <p className="text-xs text-primary mt-1">
                  {new Date().getFullYear() - parseInt(trainingSinceYear)} år med BJJ
                </p>
              )}
            </div>

            {/* Gi / No-Gi preference */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Hva trener du?
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'gi' as const, label: 'Gi' },
                  { value: 'nogi' as const, label: 'No-Gi' },
                  { value: 'both' as const, label: 'Begge' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTrainingPreference(value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      trainingPreference === value
                        ? 'bg-primary text-background'
                        : 'bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Passion level */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Din pasjon for BJJ? <span className="text-primary font-bold">{passionLevel}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={passionLevel}
                onChange={(e) => setPassionLevel(parseInt(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>Hobby</span>
                <span>Besatt</span>
              </div>
            </div>

            {/* Heard about */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Hvordan hørte du om MyBJJStory?
              </label>
              <div className="flex flex-wrap gap-2">
                {HEARD_FROM_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setHeardFrom(option)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      heardFrom === option
                        ? 'bg-primary text-background'
                        : 'bg-surface text-muted hover:text-foreground'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('info')}
              className="px-6 py-4 border border-white/20 rounded-xl hover:bg-surface transition-colors"
            >
              Tilbake
            </button>
            <button
              onClick={handleComplete}
              disabled={saving}
              className="flex-1 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {saving ? 'Lagrer...' : 'Fullfør'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Done step
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-bold">Du er klar!</h2>
        <p className="text-muted text-lg">
          Profilen din er satt opp. Nå kan du begynne å logge treninger og dele med fellesskapet.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push(`/${locale}/training/new`)}
            className="px-8 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-colors text-lg"
          >
            Logg din første trening
          </button>
          <button
            onClick={() => router.push(`/${locale}`)}
            className="px-8 py-4 border border-white/20 rounded-xl hover:bg-surface transition-colors"
          >
            Gå til dashboardet
          </button>
        </div>
      </div>
    </div>
  )
}
