'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { BeltRank } from '@/lib/types/database'
import { BELT_COLORS } from '@/components/ui/BeltBadge'

const BELT_RANKS: BeltRank[] = ['white', 'blue', 'purple', 'brown', 'black']
const BELT_LABELS: Record<BeltRank, string> = {
  white: 'Hvitt belte',
  blue: 'Blått belte',
  purple: 'Lilla belte',
  brown: 'Brunt belte',
  black: 'Svart belte',
}

type Step = 'welcome' | 'belt' | 'info' | 'done'

export default function OnboardingFlow({ locale }: { locale: string }) {
  const [step, setStep] = useState<Step>('welcome')
  const [beltRank, setBeltRank] = useState<BeltRank>('white')
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [academyName, setAcademyName] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

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
      })
      .eq('id', sessionData.session.user.id)

    setStep('done')
    setSaving(false)
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="text-6xl">🥋</div>
          <h1 className="text-3xl font-bold">Velkommen til MyBJJStory!</h1>
          <p className="text-muted text-lg">
            La oss sette opp profilen din. Det tar bare 30 sekunder.
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
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <p className="text-sm text-muted mb-2">Steg 1 av 2</p>
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
                  <span className="font-medium">{BELT_LABELS[rank]}</span>
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
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <p className="text-sm text-muted mb-2">Steg 2 av 2</p>
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

          <div className="flex gap-3">
            <button
              onClick={() => setStep('belt')}
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
