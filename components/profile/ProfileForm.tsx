'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import type { Profile, BeltRank, ProfileVisibility } from '@/lib/types/database'
import { BELT_COLORS, BELT_LABELS, ADULT_BELTS, KIDS_BELTS, BeltDisplay } from '@/components/ui/BeltBadge'

const VISIBILITY_OPTIONS: { value: ProfileVisibility; label: string; desc: string }[] = [
  { value: 'private', label: 'Privat', desc: 'Kun synlig for deg' },
  { value: 'followers', label: 'Følgere', desc: 'Kun de som følger deg' },
  { value: 'academy', label: 'Akademi', desc: 'Kun ditt akademi' },
  { value: 'public', label: 'Alle', desc: 'Synlig for alle' },
]

const GUARDS = [
  'Closed Guard', 'Half Guard', 'De La Riva', 'Butterfly', 'X-Guard',
  'Spider Guard', 'Lasso Guard', '50/50', 'Rubber Guard', 'Z-Guard',
  'Deep Half', 'Reverse De La Riva', 'Worm Guard', 'Annet',
]

const SUBMISSIONS = [
  'Armbar', 'Triangle', 'Guillotine', 'RNC', 'Kimura', 'Americana',
  'Omoplata', 'Leg Lock', 'Heel Hook', 'Knee Bar', 'Ezekiel',
  'D\'Arce', 'Anaconda', 'Loop Choke', 'Bow & Arrow', 'Cross Choke', 'Annet',
]

export default function ProfileForm({
  profile,
  locale,
}: {
  profile: Profile | null
  locale: string
}) {
  const [displayName, setDisplayName] = useState(profile?.display_name || '')
  const [username, setUsername] = useState(profile?.username || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [beltRank, setBeltRank] = useState<BeltRank | ''>(profile?.belt_rank || '')
  const [beltDegrees, setBeltDegrees] = useState(String(profile?.belt_degrees || 0))
  const [academyName, setAcademyName] = useState(profile?.academy_name || '')
  const [favoriteGuard, setFavoriteGuard] = useState(profile?.favorite_guard || '')
  const [favoriteSubmission, setFavoriteSubmission] = useState(profile?.favorite_submission || '')
  const [trainingSinceYear, setTrainingSinceYear] = useState(String(profile?.training_since_year || ''))
  const [isPublic, setIsPublic] = useState(profile?.is_public || false)
  const [showKidsBelts, setShowKidsBelts] = useState(profile?.show_kids_belts || false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Visibility toggles
  const [showBelt, setShowBelt] = useState(profile?.show_belt ?? true)
  const [showAcademy, setShowAcademy] = useState(profile?.show_academy ?? true)
  const [showTrainingSince, setShowTrainingSince] = useState(profile?.show_training_since ?? true)
  const [showFavoriteGuard, setShowFavoriteGuard] = useState(profile?.show_favorite_guard ?? false)
  const [showFavoriteSubmission, setShowFavoriteSubmission] = useState(profile?.show_favorite_submission ?? false)
  const [showInjuries, setShowInjuries] = useState(profile?.show_injuries ?? false)
  const [showCompetitions, setShowCompetitions] = useState(profile?.show_competitions ?? true)
  const [showStats, setShowStats] = useState(profile?.show_stats ?? false)
  const [showFeed, setShowFeed] = useState(profile?.show_feed ?? true)
  const [profileVisibility, setProfileVisibility] = useState<ProfileVisibility>(profile?.profile_visibility ?? 'private')
  const [publicDisplayName, setPublicDisplayName] = useState(profile?.public_display_name ?? '')

  const router = useRouter()
  const supabase = createClient()
  const tBelts = useTranslations('belts')
  const tCommon = useTranslations('common')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) return

    const userId = sessionData.session.user.id
    let avatarUrl = profile?.avatar_url

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${userId}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
        avatarUrl = urlData.publicUrl
      }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        display_name: displayName || null,
        username: username || null,
        bio: bio || null,
        belt_rank: beltRank || null,
        belt_degrees: parseInt(beltDegrees),
        academy_name: academyName || null,
        avatar_url: avatarUrl,
        favorite_guard: favoriteGuard || null,
        favorite_submission: favoriteSubmission || null,
        training_since_year: trainingSinceYear ? parseInt(trainingSinceYear) : null,
        is_public: isPublic,
        show_belt: showBelt,
        show_academy: showAcademy,
        show_training_since: showTrainingSince,
        show_favorite_guard: showFavoriteGuard,
        show_favorite_submission: showFavoriteSubmission,
        show_injuries: showInjuries,
        show_competitions: showCompetitions,
        show_stats: showStats,
        show_feed: showFeed,
        show_kids_belts: showKidsBelts,
        profile_visibility: profileVisibility,
        public_display_name: publicDisplayName || null,
      })
      .eq('id', userId)

    if (updateError) {
      setError(updateError.code === '23505' ? 'Brukernavnet er allerede tatt' : tCommon('error'))
      setSaving(false)
      return
    }

    router.push(`/${locale}/profile`)
    router.refresh()
  }

  const currentYear = new Date().getFullYear()
  const yearsTrained = trainingSinceYear ? currentYear - parseInt(trainingSinceYear) : null

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <section>
        <h2 className="text-lg font-bold mb-4">Grunnleggende</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Profilbilde</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-background file:font-semibold file:cursor-pointer hover:file:bg-primary-hover"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Visningsnavn</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Brukernavn</label>
            <div className="flex items-center">
              <span className="text-muted mr-1">@</span>
              <input type="text" value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="brukernavn"
                className="flex-1 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Om meg</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none" />
          </div>
        </div>
      </section>

      {/* BJJ info */}
      <section>
        <h2 className="text-lg font-bold mb-4">BJJ-info</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Belte</label>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input type="checkbox" checked={showKidsBelts} onChange={(e) => setShowKidsBelts(e.target.checked)}
                className="w-4 h-4 rounded accent-primary" />
              <span className="text-xs text-muted">Vis barnebelter (grå, gul, oransje, grønn)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(showKidsBelts ? [...KIDS_BELTS, ...ADULT_BELTS.filter((b) => b !== 'white')] : ADULT_BELTS).map((rank) => {
                const colors = BELT_COLORS[rank]
                const label = BELT_LABELS[rank] ?? rank
                return (
                  <button key={rank} type="button" onClick={() => setBeltRank(rank)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      beltRank === rank ? 'ring-2 ring-primary scale-105' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {label}
                  </button>
                )
              })}
            </div>
            {beltRank && (
              <div className="mt-3 w-40">
                <BeltDisplay rank={beltRank} degrees={parseInt(beltDegrees) || 0} size="md" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Grader (striper)</label>
            <input type="number" value={beltDegrees} onChange={(e) => setBeltDegrees(e.target.value)}
              min="0" max="6"
              className="w-24 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Akademi / klubb</label>
            <input type="text" value={academyName} onChange={(e) => setAcademyName(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Trent BJJ siden (år)
              {yearsTrained !== null && yearsTrained >= 0 && (
                <span className="text-primary ml-2">— {yearsTrained} år</span>
              )}
            </label>
            <input type="number" value={trainingSinceYear}
              onChange={(e) => setTrainingSinceYear(e.target.value)}
              placeholder="2020" min="1990" max={currentYear}
              className="w-32 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Favorittguard</label>
            <select value={favoriteGuard} onChange={(e) => setFavoriteGuard(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary">
              <option value="">Velg...</option>
              {GUARDS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Favorittsubmission</label>
            <select value={favoriteSubmission} onChange={(e) => setFavoriteSubmission(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary">
              <option value="">Velg...</option>
              {SUBMISSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Sharing & Visibility */}
      <section>
        <h2 className="text-lg font-bold mb-4">Deling og synlighet</h2>
        <p className="text-sm text-muted mb-4">Velg hvem som kan se profilen din, og hva de ser.</p>

        {/* Profile visibility */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-muted mb-2">Hvem kan se profilen din?</label>
          <div className="grid grid-cols-2 gap-2">
            {VISIBILITY_OPTIONS.map((opt) => (
              <button key={opt.value} type="button"
                onClick={() => {
                  setProfileVisibility(opt.value)
                  setIsPublic(opt.value === 'public')
                }}
                className={`p-3 rounded-lg text-left transition-colors border ${
                  profileVisibility === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-white/5 bg-surface hover:bg-surface-hover'
                }`}
              >
                <div className="text-sm font-medium">{opt.label}</div>
                <div className="text-xs text-muted">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Public display name */}
        {profileVisibility !== 'private' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-muted mb-2">
              Visningsnavn for andre
              <span className="text-xs text-muted ml-1">(valgfritt — bruker visningsnavnet ditt hvis tomt)</span>
            </label>
            <input type="text" value={publicDisplayName}
              onChange={(e) => setPublicDisplayName(e.target.value)}
              placeholder={displayName || 'Ditt visningsnavn'}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
        )}

        {/* What to share */}
        {profileVisibility !== 'private' && (
          <div>
            <label className="block text-sm font-medium text-muted mb-3">Hva kan andre se?</label>
            <div className="space-y-2 border-l-2 border-primary/20 pl-4">
              {[
                { label: 'Belte', checked: showBelt, set: setShowBelt },
                { label: 'Akademi', checked: showAcademy, set: setShowAcademy },
                { label: 'År trent', checked: showTrainingSince, set: setShowTrainingSince },
                { label: 'Favorittguard', checked: showFavoriteGuard, set: setShowFavoriteGuard },
                { label: 'Favorittsubmission', checked: showFavoriteSubmission, set: setShowFavoriteSubmission },
                { label: 'Skader', checked: showInjuries, set: setShowInjuries },
                { label: 'Konkurranser', checked: showCompetitions, set: setShowCompetitions },
                { label: 'Treningsstatistikk', checked: showStats, set: setShowStats },
                { label: 'Innlegg i feed', checked: showFeed, set: setShowFeed },
              ].map(({ label, checked, set }) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)}
                    className="w-4 h-4 rounded accent-primary" />
                  <span className="text-sm text-muted">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={saving}
        className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
        {saving ? tCommon('loading') : tCommon('save')}
      </button>
    </form>
  )
}
