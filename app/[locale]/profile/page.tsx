import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Profile } from '@/lib/types/database'
import { BeltDisplay, BELT_LABELS } from '@/components/ui/BeltBadge'
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
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}`)
  }

  const userId = user.id

  const [{ data: profile }, weekRes, totalRes, gradingRes, compRes, injuryRes, unreadFeedbackRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase
      .from('training_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]),
    supabase
      .from('training_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('gradings')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('competitions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('injuries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('date_recovered', null),
    supabase
      .from('session_feedback')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('is_read', false),
  ])

  const p = profile as Profile | null
  const weekCount = weekRes.count ?? 0
  const totalCount = totalRes.count ?? 0
  const gradingCount = gradingRes.count ?? 0
  const compCount = compRes.count ?? 0
  const injuryCount = injuryRes.count ?? 0
  const unreadFeedbackCount = unreadFeedbackRes.count ?? 0
  const currentYear = new Date().getFullYear()
  const yearsTrained = p?.training_since_year ? currentYear - p.training_since_year : null

  const avatarConfig: AvatarConfig = {
    ...DEFAULT_AVATAR,
    ...(p?.avatar_config as AvatarConfig ?? {}),
    beltRank: p?.belt_rank,
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Hero section */}
      <div className="relative bg-surface rounded-2xl overflow-hidden mb-6">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

        <div className="relative p-6 sm:p-8">
          {/* Top actions */}
          <div className="flex justify-end gap-2 mb-4">
            <Link
              href={`/${locale}/profile/edit`}
              className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
            >
              {t('edit')}
            </Link>
            <Link
              href={`/${locale}/settings`}
              className="px-3 py-2 border border-white/10 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              ⚙
            </Link>
          </div>

          {/* Avatar + Name section */}
          <div className="flex flex-col items-center text-center">
            {/* Large avatar with glow */}
            <Link href={`/${locale}/profile/avatar`} className="group relative mb-5">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-background rounded-2xl p-4 border border-white/10 group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-[0_0_30px_-5px_rgba(201,168,76,0.3)]">
                <AvatarSVG config={avatarConfig} size={140} />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-surface-hover rounded text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                Rediger
              </div>
            </Link>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl font-bold">
              {p?.display_name || user.user_metadata?.full_name || user.email}
            </h1>
            {p?.username && (
              <p className="text-sm text-muted mt-1">@{p.username}</p>
            )}

            {/* Belt - prominent */}
            {p?.belt_rank && (
              <div className="mt-4 w-56 sm:w-64">
                <BeltDisplay rank={p.belt_rank} degrees={p.belt_degrees} size="xl" />
                <p className="text-xs text-muted mt-1.5">
                  {BELT_LABELS[p.belt_rank] ?? p.belt_rank} belte
                  {p.belt_degrees > 0 && ` · ${p.belt_degrees} stripe${p.belt_degrees > 1 ? 'r' : ''}`}
                </p>
              </div>
            )}

            {/* Bio */}
            {p?.bio && (
              <p className="mt-4 text-sm text-muted max-w-md leading-relaxed">{p.bio}</p>
            )}

            {/* Academy + years */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted">
              {p?.academy_name && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {p.academy_name}
                </span>
              )}
              {yearsTrained !== null && yearsTrained >= 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  {yearsTrained} år med BJJ
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Medlem siden {p?.created_at ? new Date(p.created_at).toLocaleDateString('no-NO', { month: 'short', year: 'numeric' }) : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard
          value={weekCount}
          label="Denne uka"
          icon="🔥"
          highlight={weekCount >= 3}
          href={`/${locale}/training`}
        />
        <StatCard
          value={totalCount}
          label="Totalt trent"
          icon="🥋"
          href={`/${locale}/training`}
        />
        <StatCard
          value={gradingCount}
          label="Graderinger"
          icon="🏅"
          href={`/${locale}/gradings`}
        />
        <StatCard
          value={compCount}
          label="Konkurranser"
          icon="🏆"
          href={`/${locale}/competitions`}
        />
      </div>

      {/* Injury alert */}
      {injuryCount > 0 && (
        <Link
          href={`/${locale}/injuries`}
          className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 hover:bg-red-500/15 transition-colors"
        >
          <span className="text-xl">🩹</span>
          <div>
            <span className="font-semibold text-red-400 text-sm">
              {injuryCount} aktiv{injuryCount > 1 ? 'e' : ''} skade{injuryCount > 1 ? 'r' : ''}
            </span>
          </div>
        </Link>
      )}

      {/* Details cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {/* Favorites */}
        {(p?.favorite_guard || p?.favorite_submission) && (
          <div className="bg-surface rounded-xl p-5 border border-white/5">
            <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Favoritter</h3>
            <div className="space-y-2.5">
              {p.favorite_guard && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Guard</span>
                  <span className="text-sm font-semibold text-blue-400">{p.favorite_guard}</span>
                </div>
              )}
              {p.favorite_submission && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Submission</span>
                  <span className="text-sm font-semibold text-red-400">{p.favorite_submission}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visibility */}
        <div className="bg-surface rounded-xl p-5 border border-white/5">
          <h3 className="text-xs text-muted uppercase tracking-wider mb-3">Synlighet</h3>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${p?.profile_visibility === 'public' ? 'bg-green-400' : p?.profile_visibility === 'followers' ? 'bg-blue-400' : p?.profile_visibility === 'academy' ? 'bg-purple-400' : 'bg-muted'}`} />
            <span className="text-sm font-medium">
              {p?.profile_visibility === 'public' ? 'Synlig for alle' :
               p?.profile_visibility === 'followers' ? 'Kun følgere' :
               p?.profile_visibility === 'academy' ? 'Kun akademi' : 'Privat'}
            </span>
          </div>
          {p?.public_display_name && p.profile_visibility !== 'private' && (
            <p className="text-xs text-muted mt-2">Vises som: {p.public_display_name}</p>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { href: `/${locale}/inbox`, icon: '📨', label: 'Tilbakemeldinger', badge: unreadFeedbackCount },
          { href: `/${locale}/injuries`, icon: '🩹', label: 'Skader', badge: 0 },
          { href: `/${locale}/settings`, icon: '⚙️', label: 'Innstillinger', badge: 0 },
          { href: `/${locale}/feedback`, icon: '💬', label: 'Tilbakemelding', badge: 0 },
          { href: `/${locale}/profile/avatar`, icon: '🎨', label: 'Rediger avatar', badge: 0 },
          { href: `/${locale}/achievements`, icon: '🏅', label: 'Achievements', badge: 0 },
          { href: `/${locale}/profile/edit`, icon: '✏️', label: 'Rediger profil', badge: 0 },
        ].map(({ href, icon, label, badge }) => (
          <Link
            key={href}
            href={href}
            className="relative bg-surface hover:bg-surface-hover border border-white/5 hover:border-primary/20 rounded-xl p-4 text-center transition-all duration-200"
          >
            <div className="text-2xl mb-1.5">{icon}</div>
            <div className="text-xs font-medium text-muted">{label}</div>
            {badge > 0 && (
              <span className="absolute top-2 right-2 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold bg-primary text-background rounded-full">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

function StatCard({
  value,
  label,
  icon,
  highlight,
  href,
}: {
  value: number
  label: string
  icon: string
  highlight?: boolean
  href: string
}) {
  return (
    <Link
      href={href}
      className={`relative bg-surface rounded-xl p-4 text-center border transition-all duration-200 hover:scale-[1.03] hover:shadow-lg ${
        highlight ? 'border-primary/30 shadow-[0_0_20px_-8px_rgba(201,168,76,0.3)]' : 'border-white/5 hover:border-primary/20'
      }`}
    >
      <div className="text-lg mb-1">{icon}</div>
      <div className={`text-2xl sm:text-3xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {value}
      </div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </Link>
  )
}
