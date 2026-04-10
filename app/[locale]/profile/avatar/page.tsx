import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AvatarEditor from '@/components/avatar/AvatarEditor'
import type { Profile } from '@/lib/types/database'

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
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Min avatar</h1>
        <Link
          href={`/${locale}/profile`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Tilbake
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
