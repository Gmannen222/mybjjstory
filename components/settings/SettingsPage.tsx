'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import FeedbackForm from './FeedbackForm'
import type { Feedback } from '@/lib/types/database'

const STATUS_LABELS: Record<string, string> = {
  new: 'Sendt',
  read: 'Lest',
  resolved: 'Løst',
}

const TYPE_LABELS: Record<string, string> = {
  suggestion: 'Forslag',
  wish: 'Ønske',
  bug: 'Feil',
  other: 'Annet',
}

interface ProfileSummary {
  display_name: string | null
  username: string | null
  avatar_url: string | null
  belt_rank: string | null
  academy_name: string | null
}

export default function SettingsPage({
  locale,
  userId,
  userEmail,
  profile,
  previousFeedback,
}: {
  locale: string
  userId: string
  userEmail: string
  profile: ProfileSummary | null
  previousFeedback: Feedback[]
}) {
  const [deleteStep, setDeleteStep] = useState<'idle' | 'confirm-data' | 'confirm-account'>('idle')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDeleteData = async () => {
    setIsDeleting(true)
    setDeleteError(null)

    // Delete all user data from every table (RLS ensures only own data)
    const tables = [
      'feedback',
      'reactions',
      'comments',
      'posts',
      'media',
      'session_techniques',
      'training_sessions',
      'gradings',
      'competitions',
      'injuries',
      'follows',
    ]

    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq('user_id', userId)
      if (error && !error.message.includes('column')) {
        // follows uses follower_id/following_id, handle separately
        if (table === 'follows') {
          await supabase.from('follows').delete().eq('follower_id', userId)
          await supabase.from('follows').delete().eq('following_id', userId)
          continue
        }
        // session_techniques uses session_id, skip direct user_id delete
        if (table === 'session_techniques') continue
      }
    }

    // Reset profile to defaults (don't delete — it's auto-created by trigger)
    await supabase.from('profiles').update({
      display_name: null,
      username: null,
      avatar_url: null,
      bio: null,
      belt_rank: 'white',
      belt_degrees: 0,
      academy_name: null,
      favorite_guard: null,
      favorite_submission: null,
      training_since_year: null,
      training_preference: null,
      passion_level: null,
      currently_training: true,
      heard_about_from: null,
      is_public: false,
      show_belt: true,
      show_academy: true,
      show_training_since: true,
      show_favorite_guard: true,
      show_favorite_submission: true,
      show_injuries: false,
      show_competitions: true,
      show_stats: true,
      show_feed: true,
    }).eq('id', userId)

    setIsDeleting(false)
    setDeleteStep('idle')
    router.refresh()
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    setDeleteError(null)

    // First delete all data
    await handleDeleteData()

    // Sign out
    await supabase.auth.signOut()
    router.push(`/${locale}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 pb-24">
      <h1 className="text-2xl font-bold">Innstillinger</h1>

      {/* Profile summary */}
      <section className="bg-surface rounded-2xl p-5">
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <Image src={profile.avatar_url} alt="" width={56} height={56} className="w-14 h-14 rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-surface-hover flex items-center justify-center text-2xl">
              👤
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">
              {profile?.display_name || 'Ingen navn'}
            </div>
            {profile?.username && (
              <div className="text-sm text-muted">@{profile.username}</div>
            )}
            <div className="text-xs text-muted mt-0.5">{userEmail}</div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/${locale}/profile/edit`}
            className="flex-1 py-2.5 text-center bg-primary text-background font-semibold rounded-xl hover:bg-primary-hover transition-colors text-sm"
          >
            Rediger profil
          </Link>
          <Link
            href={`/${locale}/profile`}
            className="px-4 py-2.5 text-center border border-white/10 rounded-xl text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            Se profil
          </Link>
        </div>
      </section>

      {/* Feedback */}
      <section className="bg-surface rounded-2xl p-5 space-y-4">
        <div>
          <h2 className="text-lg font-bold">Forslag og tilbakemeldinger</h2>
          <p className="text-sm text-muted mt-1">
            Vi vil gjerne høre fra deg! Del forslag, ønsker eller rapporter feil.
          </p>
        </div>
        <FeedbackForm locale={locale} userEmail={userEmail} />

        {previousFeedback.length > 0 && (
          <div className="pt-4 border-t border-white/5">
            <h3 className="text-sm font-bold text-muted mb-3">Dine tidligere meldinger</h3>
            <div className="space-y-2">
              {previousFeedback.map((fb) => (
                <div key={fb.id} className="bg-background rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 bg-surface-hover rounded-full text-muted">
                      {TYPE_LABELS[fb.type]}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      fb.status === 'resolved'
                        ? 'bg-green-500/20 text-green-400'
                        : fb.status === 'read'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-surface-hover text-muted'
                    }`}>
                      {STATUS_LABELS[fb.status]}
                    </span>
                    <span className="text-xs text-muted ml-auto">
                      {new Date(fb.created_at).toLocaleDateString('nb-NO')}
                    </span>
                  </div>
                  <p className="text-sm">{fb.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Data management */}
      <section className="bg-surface rounded-2xl p-5 space-y-4">
        <div>
          <h2 className="text-lg font-bold">Data og personvern</h2>
          <p className="text-sm text-muted mt-1">
            Administrer din personlige data. Alle handlinger er irreversible.
          </p>
        </div>

        <div className="space-y-3">
          {/* Delete data */}
          {deleteStep === 'confirm-data' ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
              <p className="text-sm text-red-400 font-medium">
                Er du sikker? Dette sletter alle treninger, graderinger, konkurranser, skader, innlegg og media. Profilen din nullstilles. Kontoen din beholdes.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteStep('idle')}
                  className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm hover:bg-surface-hover transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDeleteData}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                >
                  {isDeleting ? 'Sletter...' : 'Ja, slett all data'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setDeleteStep('confirm-data')}
              className="w-full py-3 text-left px-4 bg-background rounded-xl hover:bg-surface-hover transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-medium">Slett all data</div>
                <div className="text-xs text-muted">Fjern all treningsdata, innlegg og media. Kontoen beholdes.</div>
              </div>
              <span className="text-muted">→</span>
            </button>
          )}

          {/* Delete account */}
          {deleteStep === 'confirm-account' ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-3">
              <p className="text-sm text-red-400 font-medium">
                Er du helt sikker? Dette sletter ALL data og logger deg ut. Du kan opprette en ny konto senere, men ingenting kan gjenopprettes.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteStep('idle')}
                  className="flex-1 py-2.5 border border-white/10 rounded-xl text-sm hover:bg-surface-hover transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                >
                  {isDeleting ? 'Sletter...' : 'Ja, slett kontoen min'}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setDeleteStep('confirm-account')}
              className="w-full py-3 text-left px-4 bg-background rounded-xl hover:bg-surface-hover transition-colors flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-medium text-red-400">Slett konto</div>
                <div className="text-xs text-muted">Slett all data og konto permanent. Kan ikke angres.</div>
              </div>
              <span className="text-muted">→</span>
            </button>
          )}
        </div>

        {deleteError && (
          <p className="text-sm text-red-500">{deleteError}</p>
        )}
      </section>

      {/* Links */}
      <section className="bg-surface rounded-2xl p-5 space-y-1">
        <h2 className="text-lg font-bold mb-3">Om MyBJJStory</h2>
        <Link href={`/${locale}/about`} className="block py-2.5 px-1 text-sm text-muted hover:text-foreground transition-colors">
          Om oss
        </Link>
        <Link href={`/${locale}/privacy`} className="block py-2.5 px-1 text-sm text-muted hover:text-foreground transition-colors">
          Personvernserklæring
        </Link>
        <Link href={`/${locale}/terms`} className="block py-2.5 px-1 text-sm text-muted hover:text-foreground transition-colors">
          Vilkår for bruk
        </Link>
        <div className="pt-3 border-t border-white/5 mt-2">
          <p className="text-xs text-muted">MyBJJStory v1.0 — en del av TheBjjStory.no</p>
        </div>
      </section>
    </div>
  )
}
