import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Competition } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

const RESULT_ICONS: Record<string, string> = {
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
  participant: '🏆',
}

const SOURCE_LABELS: Record<string, string> = {
  manual: 'Manuell',
  smoothcomp: 'Smoothcomp',
  ibjjf: 'IBJJF',
  adcc: 'ADCC',
  other: 'Annet',
}

export default async function CompetitionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect(`/${locale}`)

  const { data: competitions } = await supabase
    .from('competitions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('event_date', { ascending: false })

  const comps = (competitions || []) as Competition[]

  const stats = {
    total: comps.length,
    gold: comps.filter((c) => c.result === 'gold').length,
    silver: comps.filter((c) => c.result === 'silver').length,
    bronze: comps.filter((c) => c.result === 'bronze').length,
    totalWins: comps.reduce((sum, c) => sum + c.wins, 0),
    totalLosses: comps.reduce((sum, c) => sum + c.losses, 0),
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Konkurranser</h1>
        <Link
          href={`/${locale}/competitions/new`}
          className="px-4 py-2 bg-primary text-background font-semibold rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          + Ny konkurranse
        </Link>
      </div>

      {/* Stats */}
      {comps.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {[
            { label: 'Totalt', value: stats.total },
            { label: '🥇', value: stats.gold },
            { label: '🥈', value: stats.silver },
            { label: '🥉', value: stats.bronze },
            { label: 'Seire', value: stats.totalWins },
            { label: 'Tap', value: stats.totalLosses },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-primary">{value}</div>
              <div className="text-xs text-muted">{label}</div>
            </div>
          ))}
        </div>
      )}

      {comps.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">Ingen konkurranser registrert ennå</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comps.map((c) => (
            <div key={c.id} className="bg-surface rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {c.result && <span>{RESULT_ICONS[c.result]}</span>}
                    {c.event_name}
                  </div>
                  <div className="text-sm text-muted mt-0.5">
                    {c.event_date && <span>{c.event_date}</span>}
                    {c.organization && <span> · {c.organization}</span>}
                    {c.gi_nogi && <span> · {c.gi_nogi === 'gi' ? 'Gi' : 'No-Gi'}</span>}
                  </div>
                </div>
                <div className="text-right">
                  {(c.wins > 0 || c.losses > 0) && (
                    <div className="text-sm">
                      <span className="text-green-400">{c.wins}W</span>
                      {' / '}
                      <span className="text-red-400">{c.losses}L</span>
                    </div>
                  )}
                </div>
              </div>
              {c.weight_class && (
                <div className="text-xs text-muted mt-2">
                  {c.weight_class} · {c.belt_division}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 bg-surface-hover rounded-full text-muted">
                  {SOURCE_LABELS[c.source]}
                </span>
                {c.verified && (
                  <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                    Verifisert
                  </span>
                )}
                {c.source_url && (
                  <a
                    href={c.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Se kilde →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
