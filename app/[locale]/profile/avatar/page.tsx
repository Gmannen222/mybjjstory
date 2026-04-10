import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AvatarEditor from '@/components/avatar/AvatarEditor'

export const dynamic = 'force-dynamic'

export default async function AvatarPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect(`/${locale}`)

  const [{ data: profile }, { data: injuries }] = await Promise.all([
    supabase
      .from('profiles')
      .select('belt_rank, avatar_config')
      .eq('id', session.user.id)
      .single(),
    supabase
      .from('injuries')
      .select('body_part')
      .eq('user_id', session.user.id)
      .is('date_recovered', null),
  ])

  const activeInjuryParts = (injuries ?? []).map((i: { body_part: string }) => i.body_part)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Min avatar</h1>
          <p className="text-sm text-muted mt-1">Lag din egen BJJ-karakter</p>
        </div>
        <Link
          href={`/${locale}/profile`}
          className="px-4 py-2 border border-white/10 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface transition-colors"
        >
          ← Profil
        </Link>
      </div>
      <AvatarEditor
        initialConfig={profile?.avatar_config ?? null}
        beltRank={profile?.belt_rank ?? null}
        activeInjuries={activeInjuryParts}
      />
    </div>
  )
}
