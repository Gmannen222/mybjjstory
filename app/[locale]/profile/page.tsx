import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Profile } from '@/lib/types/database'
import { BeltBadge, BeltDisplay } from '@/components/ui/BeltBadge'
import AvatarSVG, { DEFAULT_AVATAR, type AvatarConfig } from '@/components/avatar/AvatarSVG'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('profile')
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${locale}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  const p = profile as Profile | null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <div className="flex gap-2">
          <Link
            href={`/${locale}/profile/edit`}
            className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
          >
            {t('edit')}
          </Link>
          <Link
            href={`/${locale}/settings`}
            className="px-3 py-2 border border-white/10 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            ⚙
          </Link>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6">
        <div className="flex items-center gap-4">
          {/* BJJ Avatar */}
          <Link href={`/${locale}/profile/avatar`} className="group flex-shrink-0">
            <div className="bg-background rounded-xl p-2 border border-white/5 group-hover:border-primary/30 transition-colors">
              <AvatarSVG
                config={{
                  ...DEFAULT_AVATAR,
                  ...(p?.avatar_config as AvatarConfig ?? {}),
                  beltRank: p?.belt_rank,
                }}
                size={60}
              />
            </div>
          </Link>

          <div>
            <h2 className="text-xl font-bold">
              {p?.display_name || session.user.user_metadata?.full_name || session.user.email}
            </h2>
            {p?.username && (
              <p className="text-sm text-muted">@{p.username}</p>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted w-24">{t('belt')}:</span>
            {p?.belt_rank ? (
              <BeltBadge rank={p.belt_rank} degrees={p.belt_degrees} />
            ) : (
              <span className="text-sm text-muted">Ikke satt</span>
            )}
          </div>

          {p?.academy_name && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted w-24">{t('academy')}:</span>
              <span>{p.academy_name}</span>
            </div>
          )}

          {p?.bio && (
            <div>
              <span className="text-sm text-muted">{t('bio')}:</span>
              <p className="mt-1">{p.bio}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted w-24">{t('memberSince')}:</span>
            <span className="text-sm">
              {p?.created_at
                ? new Date(p.created_at).toLocaleDateString('no-NO')
                : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
