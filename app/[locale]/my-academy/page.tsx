import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import EmptyState from '@/components/ui/EmptyState'
import AcademyMemberCard from '@/components/academies/AcademyMemberCard'
import { isSafeUrl } from '@/lib/url'
import type { Academy } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function MyAcademyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('myAcademy')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${locale}`)
  }

  // Fetch user's profile to get academy_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('academy_id')
    .eq('id', user.id)
    .single()

  const academyId = profile?.academy_id

  // No academy linked
  if (!academyId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
        <EmptyState
          icon="🏫"
          title={t('noAcademy')}
          description={t('noAcademyDescription')}
          ctaText={t('goToProfile')}
          ctaHref={`/${locale}/profile/edit`}
        />
      </div>
    )
  }

  // Fetch academy info and members in parallel
  const [{ data: academy }, { data: members }] = await Promise.all([
    supabase
      .from('academies')
      .select('*')
      .eq('id', academyId)
      .single(),
    supabase
      .from('profiles')
      .select('id, display_name, username, avatar_url, belt_rank, profile_visibility')
      .eq('academy_id', academyId)
      .eq('show_in_academy_list', true)
      .order('display_name', { ascending: true }),
  ])

  const typedAcademy = academy as Academy | null

  // Filter members: show the user themselves, plus members with public/academy visibility
  const visibleMembers = (members ?? []).filter(
    (m) =>
      m.id === user.id ||
      m.profile_visibility === 'public' ||
      m.profile_visibility === 'academy'
  )

  const memberCount = visibleMembers.length
  const memberCountText =
    memberCount === 1 ? t('oneMember') : t('memberCount', { count: memberCount })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      {/* Academy header */}
      <div className="bg-surface rounded-2xl border border-white/10 p-6 mb-6">
        <div className="flex items-start gap-4">
          {typedAcademy?.logo_url && isSafeUrl(typedAcademy.logo_url) ? (
            <Image
              src={typedAcademy.logo_url}
              alt={typedAcademy.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-xl object-contain bg-white/5 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🥋</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-foreground">
              {typedAcademy?.name ?? t('title')}
            </h1>
            {typedAcademy?.city && (
              <p className="text-muted text-sm mt-0.5">
                {typedAcademy.city}
                {typedAcademy.region ? `, ${typedAcademy.region}` : ''}
              </p>
            )}
            {typedAcademy?.affiliation && (
              <span className="inline-block mt-2 text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {typedAcademy.affiliation}
              </span>
            )}
          </div>
        </div>

        {typedAcademy?.description && (
          <p className="text-muted text-sm mt-4 leading-relaxed">
            {typedAcademy.description}
          </p>
        )}

        {typedAcademy?.head_instructor && (
          <p className="text-sm text-muted mt-2">
            <span className="text-foreground font-medium">Hovedinstruktør:</span>{' '}
            {typedAcademy.head_instructor}
          </p>
        )}
      </div>

      {/* Members section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('members')}</h2>
        <span className="text-sm text-muted">{memberCountText}</span>
      </div>

      {visibleMembers.length === 0 ? (
        <div className="text-center py-12 text-muted text-sm">
          {t('noMembers')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleMembers.map((member) => (
            <AcademyMemberCard
              key={member.id}
              profile={member}
              locale={locale}
              isYou={member.id === user.id}
              youLabel={t('you')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
