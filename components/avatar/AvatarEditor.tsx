'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import AvatarSVG, {
  DEFAULT_AVATAR,
  SKIN_TONES,
  HAIR_COLORS,
  EYE_COLORS,
  HAIR_STYLES,
  EYE_SHAPES,
  FACIAL_HAIR_STYLES,
  GLASSES_OPTIONS,
  NOSE_SHAPES,
  FACE_SHAPES,
  BODY_TYPES,
  EAR_TYPES,
  EYEBROW_STYLES,
  MOUTH_STYLES,
  SCAR_OPTIONS,
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
  const [activeTab, setActiveTab] = useState<'basics' | 'face' | 'body' | 'outfit'>('basics')
  const supabase = createClient()

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

  const tabs = [
    { id: 'basics' as const, label: 'Grunnlag', icon: '👤' },
    { id: 'face' as const, label: 'Ansikt', icon: '😊' },
    { id: 'body' as const, label: 'Kropp', icon: '💪' },
    { id: 'outfit' as const, label: 'Antrekk', icon: '🥋' },
  ]

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:gap-8">
        {/* Preview - sticky */}
        <div className="sm:sticky sm:top-6 sm:self-start flex justify-center mb-6 sm:mb-0">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl scale-75" />
            <div className="relative bg-surface rounded-2xl p-4 border border-white/10">
              <AvatarSVG config={previewConfig} size={160} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 space-y-5">
          {/* Tab navigation */}
          <div className="flex gap-1 bg-surface rounded-xl p-1 border border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-background shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                <span className="mr-1">{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* === BASICS TAB === */}
          {activeTab === 'basics' && (
            <div className="space-y-5">
              <Section title="Kjønn">
                <div className="flex gap-2">
                  {(['male', 'female'] as const).map((g) => (
                    <button key={g} type="button" onClick={() => update({ gender: g })}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        config.gender === g ? 'bg-primary text-background' : 'bg-surface border border-white/5 text-muted hover:text-foreground hover:bg-surface-hover'
                      }`}
                    >{g === 'male' ? 'Mann' : 'Kvinne'}</button>
                  ))}
                </div>
              </Section>

              <Section title="Hudfarge">
                <ColorCircles options={SKIN_TONES} selected={config.skinTone} onSelect={(v) => update({ skinTone: v })} size="lg" />
              </Section>

              <Section title="Frisyre">
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {HAIR_STYLES.map((hs) => (
                    <OptionButton key={hs.value} label={hs.name} active={config.hairStyle === hs.value} onClick={() => update({ hairStyle: hs.value })} />
                  ))}
                </div>
              </Section>

              {config.hairStyle !== 'bald' && (
                <Section title="Hårfarge">
                  <ColorCircles options={HAIR_COLORS} selected={config.hairColor} onSelect={(v) => update({ hairColor: v })} />
                </Section>
              )}

              <Section title="Øyefarge">
                <ColorCircles options={EYE_COLORS} selected={config.eyeColor ?? '#4A3728'} onSelect={(v) => update({ eyeColor: v })} />
              </Section>
            </div>
          )}

          {/* === FACE TAB === */}
          {activeTab === 'face' && (
            <div className="space-y-5">
              <Section title="Ansiktsform">
                <div className="grid grid-cols-2 gap-2">
                  {FACE_SHAPES.map((fs) => (
                    <OptionButton key={fs.value} label={fs.name} active={(config.faceShape ?? 'oval') === fs.value} onClick={() => update({ faceShape: fs.value })} />
                  ))}
                </div>
              </Section>

              <Section title="Neseform">
                <div className="grid grid-cols-2 gap-2">
                  {NOSE_SHAPES.map((ns) => (
                    <OptionButton key={ns.value} label={ns.name} active={(config.noseShape ?? 'default') === ns.value} onClick={() => update({ noseShape: ns.value })} />
                  ))}
                </div>
              </Section>

              <Section title="Øyeform">
                <div className="grid grid-cols-2 gap-2">
                  {EYE_SHAPES.map((es) => (
                    <OptionButton key={es.value} label={es.name} active={(config.eyeShape ?? 'default') === es.value} onClick={() => update({ eyeShape: es.value })} />
                  ))}
                </div>
              </Section>

              <Section title="Øyenbryn">
                <div className="grid grid-cols-2 gap-2">
                  {EYEBROW_STYLES.map((eb) => (
                    <OptionButton key={eb.value} label={eb.name} active={(config.eyebrowStyle ?? 'normal') === eb.value} onClick={() => update({ eyebrowStyle: eb.value })} />
                  ))}
                </div>
              </Section>

              <Section title="Munn">
                <div className="grid grid-cols-2 gap-2">
                  {MOUTH_STYLES.map((ms) => (
                    <OptionButton key={ms.value} label={ms.name} active={(config.mouthStyle ?? 'smile') === ms.value} onClick={() => update({ mouthStyle: ms.value })} />
                  ))}
                </div>
              </Section>

              <Section title="Skjegg / bart">
                <div className="grid grid-cols-3 gap-2">
                  {FACIAL_HAIR_STYLES.map((fh) => (
                    <OptionButton key={fh.value} label={fh.name} active={(config.facialHair ?? 'none') === fh.value} onClick={() => update({ facialHair: fh.value })} />
                  ))}
                </div>
              </Section>

              <Section title="Briller">
                <div className="grid grid-cols-2 gap-2">
                  {GLASSES_OPTIONS.map((gl) => (
                    <OptionButton key={gl.value} label={gl.name} active={(config.glasses ?? 'none') === gl.value} onClick={() => update({ glasses: gl.value })} />
                  ))}
                </div>
              </Section>

              <Section title="Huddetaljer">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-surface rounded-lg border border-white/5 hover:bg-surface-hover transition-colors">
                    <input type="checkbox" checked={config.freckles ?? false} onChange={(e) => update({ freckles: e.target.checked })}
                      className="w-5 h-5 rounded accent-primary" />
                    <span className="text-sm">Fregner</span>
                  </label>
                </div>
              </Section>

              <Section title="Arr">
                <div className="grid grid-cols-2 gap-2">
                  {SCAR_OPTIONS.map((sc) => (
                    <OptionButton key={sc.value} label={sc.name} active={(config.scar ?? 'none') === sc.value} onClick={() => update({ scar: sc.value })} />
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* === BODY TAB === */}
          {activeTab === 'body' && (
            <div className="space-y-5">
              <Section title="Kroppstype">
                <div className="grid grid-cols-2 gap-2">
                  {BODY_TYPES.map((bt) => (
                    <OptionButton key={bt.value} label={bt.name} active={(config.bodyType ?? 'average') === bt.value} onClick={() => update({ bodyType: bt.value })} />
                  ))}
                </div>
              </Section>

              <Section title="Ører">
                <div className="grid grid-cols-2 gap-2">
                  {EAR_TYPES.map((et) => (
                    <OptionButton key={et.value} label={et.name} active={(config.earType ?? 'normal') === et.value} onClick={() => update({ earType: et.value })} />
                  ))}
                </div>
              </Section>

              {activeInjuries && activeInjuries.length > 0 && (
                <Section title="Skader på avatar">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-surface rounded-lg border border-white/5 hover:bg-surface-hover transition-colors">
                    <input type="checkbox" checked={showInjuriesOnAvatar} onChange={(e) => setShowInjuriesOnAvatar(e.target.checked)}
                      className="w-5 h-5 rounded accent-primary" />
                    <span className="text-sm">
                      Vis {activeInjuries.length} aktiv{activeInjuries.length > 1 ? 'e' : ''} skade{activeInjuries.length > 1 ? 'r' : ''}
                    </span>
                  </label>
                  {showInjuriesOnAvatar && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activeInjuries.map((part) => (
                        <span key={part} className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-lg">{part}</span>
                      ))}
                    </div>
                  )}
                </Section>
              )}
            </div>
          )}

          {/* === OUTFIT TAB === */}
          {activeTab === 'outfit' && (
            <div className="space-y-5">
              <Section title="Antrekk">
                <div className="grid grid-cols-2 gap-2">
                  {OUTFIT_OPTIONS.map((opt) => (
                    <OptionButton key={opt.value} label={opt.name} active={config.outfit === opt.value} onClick={() => update({ outfit: opt.value })} />
                  ))}
                </div>
              </Section>

              <Section title="Akademi-merke">
                <ColorCircles
                  options={ACADEMY_COLORS}
                  selected={config.academyColor ?? ''}
                  onSelect={(v) => update({ academyColor: v || null })}
                  showNone
                />
              </Section>

              <Section title="BJJ-utstyr">
                <div className="space-y-2">
                  {([
                    { key: 'fingerTape' as const, label: 'Finger-tape', desc: 'Tape på fingrene' },
                    { key: 'headband' as const, label: 'Pannebånd', desc: 'Sport-pannebånd' },
                    { key: 'mouthguard' as const, label: 'Tannbeskytter', desc: 'Synlig tannbeskytter' },
                    { key: 'kneePads' as const, label: 'Knebeskyttere', desc: 'Volleyball-knebeskyttere' },
                  ] as const).map(({ key, label, desc }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer p-3 bg-surface rounded-lg border border-white/5 hover:bg-surface-hover transition-colors">
                      <input type="checkbox" checked={config[key] ?? false} onChange={(e) => update({ [key]: e.target.checked })}
                        className="w-5 h-5 rounded accent-primary" />
                      <div>
                        <span className="text-sm font-medium">{label}</span>
                        <span className="text-xs text-muted ml-2">{desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </Section>
            </div>
          )}

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-3.5 font-semibold rounded-xl transition-all duration-200 ${
              saved ? 'bg-green-500 text-white' : 'bg-primary text-background hover:bg-primary-hover hover:shadow-[0_0_20px_-3px_rgba(201,168,76,0.4)]'
            } disabled:opacity-50`}
          >
            {saving ? 'Lagrer...' : saved ? '✓ Lagret!' : 'Lagre avatar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// === REUSABLE SUB-COMPONENTS ===

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2.5">{title}</label>
      {children}
    </div>
  )
}

function OptionButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2 rounded-lg text-xs font-medium transition-all ${
        active ? 'bg-primary text-background' : 'bg-surface border border-white/5 text-muted hover:text-foreground hover:bg-surface-hover'
      }`}
    >
      {label}
    </button>
  )
}

function ColorCircles({
  options,
  selected,
  onSelect,
  size = 'md',
  showNone = false,
}: {
  options: { name: string; value: string }[]
  selected: string
  onSelect: (value: string) => void
  size?: 'md' | 'lg'
  showNone?: boolean
}) {
  const sizeClass = size === 'lg' ? 'w-11 h-11' : 'w-9 h-9'

  return (
    <div className="flex gap-2.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value || 'none'}
          type="button"
          onClick={() => onSelect(opt.value)}
          className={`${sizeClass} rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
            selected === opt.value
              ? 'border-primary scale-110 shadow-[0_0_12px_-2px_rgba(201,168,76,0.4)]'
              : opt.value ? 'border-transparent hover:scale-105' : 'border-white/10 hover:scale-105'
          }`}
          style={{ backgroundColor: opt.value || 'transparent' }}
          title={opt.name}
        >
          {showNone && !opt.value && <span className="text-xs text-muted">✕</span>}
        </button>
      ))}
    </div>
  )
}
