'use client'

import { useState, useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import type { Profile, BeltRank, ProfileVisibility } from '@/lib/types/database'
import { BELT_COLORS, BELT_LABELS, ADULT_BELTS, KIDS_BELTS, BeltDisplay } from '@/components/ui/BeltBadge'
import AcademySelector from '@/components/profile/AcademySelector'
import SubmitButton from '@/components/ui/SubmitButton'
import { updateProfile } from '@/lib/actions/profile'

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

const WEIGHT_CLASSES = [
  'Rooster (57.5 kg)', 'Light Feather (64 kg)', 'Feather (70 kg)',
  'Light (76 kg)', 'Middle (82.3 kg)', 'Medium Heavy (88.3 kg)',
  'Heavy (94.3 kg)', 'Super Heavy (100.5 kg)', 'Ultra Heavy (100.5+ kg)',
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
  // --- Interactive state for fields that need JS-driven UI ---
  const [beltRank, setBeltRank] = useState<BeltRank | ''>(profile?.belt_rank || '')
  const [beltDegrees, setBeltDegrees] = useState(String(profile?.belt_degrees || 0))
  const [academyName, setAcademyName] = useState(profile?.academy_name || '')
  const [academyId, setAcademyId] = useState<string | null>(profile?.academy_id || null)
  const [showKidsBelts, setShowKidsBelts] = useState(profile?.show_kids_belts || false)
  const [profileVisibility, setProfileVisibility] = useState<ProfileVisibility>(profile?.profile_visibility ?? 'private')
  const [isPublic, setIsPublic] = useState(profile?.is_public || false)
  const [trainingSinceYear, setTrainingSinceYear] = useState(String(profile?.training_since_year || ''))

  // Visibility toggles — need state so hidden inputs track checkbox values
  const [showBelt, setShowBelt] = useState(profile?.show_belt ?? true)
  const [showAcademy, setShowAcademy] = useState(profile?.show_academy ?? true)
  const [showTrainingSince, setShowTrainingSince] = useState(profile?.show_training_since ?? true)
  const [showFavoriteGuard, setShowFavoriteGuard] = useState(profile?.show_favorite_guard ?? false)
  const [showFavoriteSubmission, setShowFavoriteSubmission] = useState(profile?.show_favorite_submission ?? false)
  const [showInjuries, setShowInjuries] = useState(profile?.show_injuries ?? false)
  const [showCompetitions, setShowCompetitions] = useState(profile?.show_competitions ?? true)
  const [showStats, setShowStats] = useState(profile?.show_stats ?? false)
  const [showFeed, setShowFeed] = useState(profile?.show_feed ?? true)
  const [showInAcademyList, setShowInAcademyList] = useState(profile?.show_in_academy_list ?? true)

  // Avatar upload stays client-side (Vercel 4.5 MB FormData limit)
  const [, setAvatarFile] = useState<File | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const supabase = createClient()
  const tCommon = useTranslations('common')
  const tProfile = useTranslations('profile')

  // Server action with useActionState
  const [state, formAction] = useActionState(updateProfile, { success: false, error: '' })

  // On successful save, redirect to profile page
  useEffect(() => {
    if (state.success) {
      router.push(`/${locale}/profile`)
      router.refresh()
    }
  }, [state, router, locale])

  /**
   * Avatar upload: client-side direct to Supabase Storage.
   * This runs before the form action submits. The uploaded URL is stored
   * in a hidden input so the server action can save it to the profile.
   */
  const handleAvatarUpload = async (file: File) => {
    setAvatarFile(file)
    setAvatarError(null)
    setAvatarUploading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setAvatarError('Du må være innlogget for å laste opp bilde.')
      setAvatarUploading(false)
      return
    }

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      console.error('Avatar upload failed:', uploadError)
      setAvatarError('Kunne ikke laste opp bildet. Prøv igjen.')
      setAvatarUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(urlData.publicUrl)
    setAvatarUploading(false)
  }

  const currentYear = new Date().getFullYear()
  const yearsTrained = trainingSinceYear ? currentYear - parseInt(trainingSinceYear) : null

  // Determine error to display — from server action state
  const error = !state.success && state.error ? state.error : null

  return (
    <form ref={formRef} action={formAction} className="space-y-8">
      {/* Hidden inputs for JS-driven fields that don't have native form elements */}
      <input type="hidden" name="belt_rank" value={beltRank} />
      <input type="hidden" name="academy_name" value={academyName} />
      <input type="hidden" name="academy_id" value={academyId || ''} />
      <input type="hidden" name="avatar_url" value={avatarUrl} />
      <input type="hidden" name="profile_visibility" value={profileVisibility} />
      {isPublic && <input type="hidden" name="is_public" value="on" />}
      {showKidsBelts && <input type="hidden" name="show_kids_belts" value="on" />}
      {showBelt && <input type="hidden" name="show_belt" value="on" />}
      {showAcademy && <input type="hidden" name="show_academy" value="on" />}
      {showTrainingSince && <input type="hidden" name="show_training_since" value="on" />}
      {showFavoriteGuard && <input type="hidden" name="show_favorite_guard" value="on" />}
      {showFavoriteSubmission && <input type="hidden" name="show_favorite_submission" value="on" />}
      {showInjuries && <input type="hidden" name="show_injuries" value="on" />}
      {showCompetitions && <input type="hidden" name="show_competitions" value="on" />}
      {showStats && <input type="hidden" name="show_stats" value="on" />}
      {showFeed && <input type="hidden" name="show_feed" value="on" />}
      {showInAcademyList && <input type="hidden" name="show_in_academy_list" value="on" />}

      {/* Basic info */}
      <section>
        <h2 className="text-lg font-bold mb-4">Grunnleggende</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Profilbilde</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleAvatarUpload(file)
              }}
              className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-background file:font-semibold file:cursor-pointer hover:file:bg-primary-hover"
            />
            {avatarUploading && <p className="text-xs text-muted mt-1">Laster opp...</p>}
            {avatarError && <p className="text-xs text-red-400 mt-1">{avatarError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Visningsnavn</label>
            <input type="text" name="display_name" defaultValue={profile?.display_name || ''}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Brukernavn</label>
            <div className="flex items-center">
              <span className="text-muted mr-1">@</span>
              <input type="text" name="username" defaultValue={profile?.username || ''}
                onChange={(e) => {
                  e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                }}
                placeholder="brukernavn"
                className="flex-1 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Om meg</label>
            <textarea name="bio" defaultValue={profile?.bio || ''} rows={3}
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
            <input type="number" name="belt_degrees" value={beltDegrees}
              onChange={(e) => setBeltDegrees(e.target.value)}
              min="0" max="4"
              className="w-24 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <AcademySelector
            value={academyName}
            academyId={academyId}
            onChange={(name, id) => {
              setAcademyName(name)
              setAcademyId(id)
            }}
          />
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Vektklasse</label>
            <select name="weight_class" defaultValue={profile?.weight_class || ''}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground [&>option]:text-black [&>option]:bg-white focus:outline-none focus:border-primary">
              <option value="">Velg...</option>
              {WEIGHT_CLASSES.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Trent BJJ siden (år)
              {yearsTrained !== null && yearsTrained >= 0 && (
                <span className="text-primary ml-2">— {yearsTrained} år</span>
              )}
            </label>
            <input type="number" name="training_since_year" value={trainingSinceYear}
              onChange={(e) => setTrainingSinceYear(e.target.value)}
              placeholder="2020" min="1990" max={currentYear}
              className="w-32 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Favorittguard</label>
            <select name="favorite_guard" defaultValue={profile?.favorite_guard || ''}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground [&>option]:text-black [&>option]:bg-white focus:outline-none focus:border-primary">
              <option value="">Velg...</option>
              {GUARDS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Favorittsubmission</label>
            <select name="favorite_submission" defaultValue={profile?.favorite_submission || ''}
              className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground [&>option]:text-black [&>option]:bg-white focus:outline-none focus:border-primary">
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
            <input type="text" name="public_display_name" defaultValue={profile?.public_display_name ?? ''}
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

        {/* Academy list visibility */}
        {profileVisibility !== 'private' && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={showInAcademyList} onChange={(e) => setShowInAcademyList(e.target.checked)}
                className="w-4 h-4 rounded accent-primary" />
              <div>
                <span className="text-sm font-medium text-muted">{tProfile('showInAcademyList')}</span>
                <p className="text-xs text-muted/70 mt-0.5">{tProfile('showInAcademyListHelp')}</p>
              </div>
            </label>
          </div>
        )}
      </section>

      <div className="sticky bottom-0 bg-background/95 backdrop-blur-md border-t border-white/10 p-4 -mx-6 -mb-6 mt-6 z-10">
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <SubmitButton
          disabled={avatarUploading}
          pendingText={tCommon('loading')}
          className="w-full py-3"
        >
          {tCommon('save')}
        </SubmitButton>
      </div>
    </form>
  )
}
