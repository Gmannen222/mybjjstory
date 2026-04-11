import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { SparringRound } from '@/lib/types/database'
import MyPartners from '@/components/sparring/MyPartners'

export const dynamic = 'force-dynamic'

export default async function SparringPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('sparring')
  const tCommon = await getTranslations('common')
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const { data: rounds } = await supabase
    .from('sparring_rounds')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('myPartners')}</h1>
        <Link
          href={`/${locale}/training`}
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          {tCommon('back')}
        </Link>
      </div>

      <MyPartners rounds={(rounds ?? []) as SparringRound[]} />
    </div>
  )
}
