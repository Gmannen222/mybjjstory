'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import type { Profile, BeltRank } from '@/lib/types/database'
import { BELT_COLORS } from '@/components/ui/BeltBadge'

const BELT_RANKS: BeltRank[] = ['white', 'blue', 'purple', 'brown', 'black']

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
  const [beltRank, setBeltRank] = useState<BeltRank | ''>(
    profile?.belt_rank || ''
  )
  const [beltDegrees, setBeltDegrees] = useState(
    String(profile?.belt_degrees || 0)
  )
  const [academyName, setAcademyName] = useState(profile?.academy_name || '')
  const [isPublic, setIsPublic] = useState(profile?.is_public || false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

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
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(path)
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
        is_public: isPublic,
      })
      .eq('id', userId)

    if (updateError) {
      setError(
        updateError.code === '23505'
          ? 'Brukernavnet er allerede tatt'
          : tCommon('error')
      )
      setSaving(false)
      return
    }

    router.push(`/${locale}/profile`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Profilbilde
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-background file:font-semibold file:cursor-pointer hover:file:bg-primary-hover"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Visningsnavn
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
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
              setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))
            }
            className="flex-1 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
            placeholder="dittbrukernavn"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Belte
        </label>
        <div className="flex flex-wrap gap-2">
          {BELT_RANKS.map((rank) => {
            const colors = BELT_COLORS[rank]
            return (
              <button
                key={rank}
                type="button"
                onClick={() => setBeltRank(rank)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  beltRank === rank
                    ? 'ring-2 ring-primary scale-105'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {tBelts(rank)}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Grader (striper)
        </label>
        <input
          type="number"
          value={beltDegrees}
          onChange={(e) => setBeltDegrees(e.target.value)}
          min="0"
          max="6"
          className="w-24 px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Akademi
        </label>
        <input
          type="text"
          value={academyName}
          onChange={(e) => setAcademyName(e.target.value)}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted mb-2">
          Om meg
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary resize-none"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="w-5 h-5 rounded accent-primary"
        />
        <span className="text-sm">Gjør profilen min synlig for andre</span>
      </label>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
      >
        {saving ? tCommon('loading') : tCommon('save')}
      </button>
    </form>
  )
}
