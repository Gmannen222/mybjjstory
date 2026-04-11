import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Injury } from '@/lib/types/database'
import EmptyState from '@/components/ui/EmptyState'
import SavedBanner from '@/components/ui/SavedBanner'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

const SEVERITY_COLORS: Record<string, string> = {
  mild: 'text-yellow-400',
  moderate: 'text-orange-400',
  severe: 'text-red-400',
}

const SEVERITY_LABELS: Record<string, string> = {
  mild: 'Mild',
  moderate: 'Moderat',
  severe: 'Alvorlig',
}

const IMPACT_LABELS: Record<string, string> = {
  none: 'Ingen påvirkning',
  modified: 'Tilpasset trening',
  rest: 'Hvile',
}

export default async function InjuriesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const { data: injuries } = await supabase
    .from('injuries')
    .select('*')
    .eq('user_id', user.id)
    .order('date_occurred', { ascending: false })

  const allInjuries = (injuries || []) as Injury[]
  const active = allInjuries.filter((i) => !i.date_recovered)
  const recovered = allInjuries.filter((i) => i.date_recovered)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Suspense>
        <SavedBanner message="Skaden ble lagret!" />
      </Suspense>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Skader</h1>
        <Link
          href={`/${locale}/injuries/new`}
          className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          + Registrer skade
        </Link>
      </div>

      {allInjuries.length === 0 ? (
        <EmptyState
          icon="💪"
          title="Ingen skader registrert"
          description="Forhåpentligvis forblir det slik!"
        />
      ) : (
        <>
          {active.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Aktive skader ({active.length})
              </h2>
              <div className="space-y-3">
                {active.map((injury) => (
                  <InjuryCard key={injury.id} injury={injury} locale={locale} />
                ))}
              </div>
            </section>
          )}

          {recovered.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Tilfrisknet ({recovered.length})
              </h2>
              <div className="space-y-3">
                {recovered.map((injury) => (
                  <InjuryCard key={injury.id} injury={injury} locale={locale} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function InjuryCard({ injury, locale }: { injury: Injury; locale: string }) {
  const isActive = !injury.date_recovered

  return (
    <Link
      href={`/${locale}/injuries/${injury.id}`}
      className={`block bg-surface rounded-xl p-4 hover:bg-surface-hover transition-colors ${isActive ? 'border-l-4 border-red-400' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="font-semibold">{injury.body_part}</div>
        <span className={`text-sm font-medium ${SEVERITY_COLORS[injury.severity]}`}>
          {SEVERITY_LABELS[injury.severity]}
        </span>
      </div>
      <div className="text-sm text-muted mt-1">
        {injury.date_occurred}
        {injury.date_recovered && <span> → {injury.date_recovered}</span>}
        {injury.injury_type && <span> · {injury.injury_type}</span>}
      </div>
      {injury.description && (
        <p className="text-sm mt-2">{injury.description}</p>
      )}
      <div className="text-xs text-muted mt-2">
        {IMPACT_LABELS[injury.training_impact]}
      </div>
    </Link>
  )
}
