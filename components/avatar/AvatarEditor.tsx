'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AvatarSVG, {
  DEFAULT_AVATAR,
  SKIN_TONES,
  HAIR_COLORS,
  HAIR_STYLES,
  OUTFIT_OPTIONS,
  type AvatarConfig,
} from './AvatarSVG'

const ACADEMY_COLORS = [
  { name: 'Ingen', value: '' },
  { name: 'Rød', value: '#ef4444' },
  { name: 'Blå', value: '#3b82f6' },
  { name: 'Grønn', value: '#22c55e' },
  { name: 'Gul', value: '#eab308' },
  { name: 'Lilla', value: '#a855f7' },
  { name: 'Oransje', value: '#f97316' },
  { name: 'Hvit', value: '#e5e7eb' },
  { name: 'Svart', value: '#1f2937' },
]

export default function AvatarEditor({
  initialConfig,
  beltRank,
  activeInjuries,
  onSave,
}: {
  initialConfig?: AvatarConfig | null
  beltRank?: string | null
  activeInjuries?: string[]
  onSave?: (config: AvatarConfig) => void
}) {
  const [config, setConfig] = useState<AvatarConfig>(() => ({
    ...DEFAULT_AVATAR,
    ...initialConfig,
    beltRank: beltRank ?? initialConfig?.beltRank ?? null,
  }))
  const [showInjuriesOnAvatar, setShowInjuriesOnAvatar] = useState(
    (initialConfig?.showInjuries?.length ?? 0) > 0
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  // Keep belt in sync
  useEffect(() => {
    if (beltRank) {
      setConfig((prev) => ({ ...prev, beltRank }))
    }
  }, [beltRank])

  const update = (partial: Partial<AvatarConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { data: session } = await supabase.auth.getSession()
    if (!session.session) { setSaving(false); return }

    const configToSave = {
      ...config,
      showInjuries: showInjuriesOnAvatar ? activeInjuries ?? [] : [],
    }

    await supabase
      .from('profiles')
      .update({ avatar_config: configToSave })
      .eq('id', session.session.user.id)

    setSaving(false)
    setSaved(true)
    onSave?.(configToSave)
    setTimeout(() => setSaved(false), 2000)
  }

  const previewConfig = {
    ...config,
    showInjuries: showInjuriesOnAvatar ? activeInjuries ?? [] : [],
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="flex justify-center">
        <div className="bg-surface rounded-2xl p-6 border border-white/5">
          <AvatarSVG config={previewConfig} size={120} />
        </div>
      </div>

      {/* Gender */}
      <Section title="Kjønn">
        <div className="flex gap-2">
          {(['male', 'female'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => update({ gender: g })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                config.gender === g ? 'bg-primary text-background' : 'bg-surface-hover text-muted hover:text-foreground'
              }`}
            >
              {g === 'male' ? 'Mann' : 'Kvinne'}
            </button>
          ))}
        </div>
      </Section>

      {/* Skin tone */}
      <Section title="Hudfarge">
        <div className="flex gap-2 flex-wrap">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone.value}
              type="button"
              onClick={() => update({ skinTone: tone.value })}
              className={`w-10 h-10 rounded-full border-2 transition-transform ${
                config.skinTone === tone.value ? 'border-primary scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: tone.value }}
              title={tone.name}
            />
          ))}
        </div>
      </Section>

      {/* Hair style */}
      <Section title="Frisyre">
        <div className="flex gap-2 flex-wrap">
          {HAIR_STYLES.map((hs) => (
            <button
              key={hs.value}
              type="button"
              onClick={() => update({ hairStyle: hs.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                config.hairStyle === hs.value ? 'bg-primary text-background' : 'bg-surface-hover text-muted hover:text-foreground'
              }`}
            >
              {hs.name}
            </button>
          ))}
        </div>
      </Section>

      {/* Hair color */}
      {config.hairStyle !== 'bald' && (
        <Section title="Hårfarge">
          <div className="flex gap-2 flex-wrap">
            {HAIR_COLORS.map((hc) => (
              <button
                key={hc.value}
                type="button"
                onClick={() => update({ hairColor: hc.value })}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  config.hairColor === hc.value ? 'border-primary scale-110' : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: hc.value }}
                title={hc.name}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Outfit */}
      <Section title="Antrekk">
        <div className="flex gap-2 flex-wrap">
          {OUTFIT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ outfit: opt.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                config.outfit === opt.value ? 'bg-primary text-background' : 'bg-surface-hover text-muted hover:text-foreground'
              }`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </Section>

      {/* Academy patch color */}
      <Section title="Akademi-merke (farge)">
        <div className="flex gap-2 flex-wrap">
          {ACADEMY_COLORS.map((ac) => (
            <button
              key={ac.value || 'none'}
              type="button"
              onClick={() => update({ academyColor: ac.value || null })}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${
                (config.academyColor ?? '') === ac.value ? 'border-primary scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: ac.value || 'transparent' }}
              title={ac.name}
            >
              {!ac.value && <span className="text-xs text-muted">✕</span>}
            </button>
          ))}
        </div>
      </Section>

      {/* Injuries toggle */}
      {activeInjuries && activeInjuries.length > 0 && (
        <Section title="Vis skader på avatar">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showInjuriesOnAvatar}
              onChange={(e) => setShowInjuriesOnAvatar(e.target.checked)}
              className="w-5 h-5 rounded accent-primary"
            />
            <span className="text-sm text-muted">
              Vis {activeInjuries.length} aktiv{activeInjuries.length > 1 ? 'e' : ''} skade{activeInjuries.length > 1 ? 'r' : ''} på avataren
            </span>
          </label>
          {showInjuriesOnAvatar && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {activeInjuries.map((part) => (
                <span key={part} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-lg">
                  {part}
                </span>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {saving ? 'Lagrer...' : saved ? 'Lagret!' : 'Lagre avatar'}
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-2">{title}</label>
      {children}
    </div>
  )
}
