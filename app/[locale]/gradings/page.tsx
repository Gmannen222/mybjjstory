import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Grading } from '@/lib/types/database'
import { BeltDisplay, BELT_LABELS } from '@/components/ui/BeltBadge'
import EmptyState from '@/components/ui/EmptyState'
import SavedBanner from '@/components/ui/SavedBanner'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export default async function GradingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('gradings')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const { data: gradings } = await supabase
    .from('gradings')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: true })

  const gradingList = (gradings as Grading[]) || []

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Suspense>
        <SavedBanner message="Graderingen ble lagret!" />
      </Suspense>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link
          href={`/${locale}/gradings/new`}
          className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          + {t('newGrading')}
        </Link>
      </div>

      {gradingList.length === 0 ? (
        <EmptyState
          icon="🏅"
          title="Ingen graderinger registrert ennå"
          description="Logg belteoppgraderinger og striper for å bygge opp din belt-historikk."
          ctaText={t('newGrading')}
          ctaHref={`/${locale}/gradings/new`}
        />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-0">
            {gradingList.map((g, i) => {
              const label = BELT_LABELS[g.belt_rank] ?? g.belt_rank
              const isStripe = g.grading_type === 'stripe'
              const isLast = i === gradingList.length - 1

              return (
                <Link
                  key={g.id}
                  href={`/${locale}/gradings/${g.id}`}
                  className="relative flex gap-4 group"
                >
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 flex items-start justify-center pt-6">
                    <div
                      className={`rounded-full border-2 border-background transition-transform group-hover:scale-125 ${
                        isStripe ? 'w-3 h-3 bg-primary/60' : 'w-4 h-4 bg-primary'
                      }`}
                    />
                  </div>

                  {/* Card */}
                  <div className={`flex-1 bg-surface rounded-xl p-5 hover:bg-surface-hover transition-colors ${isLast ? '' : 'mb-4'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm font-semibold">
                          {isStripe ? `Stripe ${g.belt_degrees}` : label}
                        </span>
                        {isStripe && (
                          <span className="text-xs text-muted ml-2">({label})</span>
                        )}
                      </div>
                      <span className="text-xs text-muted">{g.date}</span>
                    </div>

                    {/* Belt visual */}
                    <div className="w-40 mb-3">
                      <BeltDisplay rank={g.belt_rank} degrees={g.belt_degrees} size="md" />
                    </div>

                    {(g.instructor_name || g.academy_name) && (
                      <div className="text-sm text-muted">
                        {g.instructor_name && <span>{g.instructor_name}</span>}
                        {g.instructor_name && g.academy_name && <span> · </span>}
                        {g.academy_name && <span>{g.academy_name}</span>}
                      </div>
                    )}
                    {g.notes && (
                      <p className="text-sm text-muted mt-1 line-clamp-2">{g.notes}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
