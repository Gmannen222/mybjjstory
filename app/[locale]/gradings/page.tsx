import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Grading } from '@/lib/types/database'
import { BeltBadge } from '@/components/ui/BeltBadge'

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
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${locale}`)
  }

  const { data: gradings } = await supabase
    .from('gradings')
    .select('*')
    .eq('user_id', session.user.id)
    .order('date', { ascending: false })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Link
          href={`/${locale}/gradings/new`}
          className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          + {t('newGrading')}
        </Link>
      </div>

      {!gradings || gradings.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">{t('noGradings')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(gradings as Grading[]).map((g) => (
            <div
              key={g.id}
              className="bg-surface rounded-xl p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BeltBadge rank={g.belt_rank} degrees={g.belt_degrees} />
                  <span className="text-sm text-muted">{g.date}</span>
                </div>
              </div>
              {(g.instructor_name || g.academy_name) && (
                <div className="text-sm text-muted mt-2">
                  {g.instructor_name && <span>{g.instructor_name}</span>}
                  {g.instructor_name && g.academy_name && <span> · </span>}
                  {g.academy_name && <span>{g.academy_name}</span>}
                </div>
              )}
              {g.notes && (
                <p className="text-sm text-muted mt-2">{g.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
