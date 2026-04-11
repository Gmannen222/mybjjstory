import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BannedContent from '@/components/auth/BannedContent'

export const dynamic = 'force-dynamic'

export default async function BannedPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in or not banned, redirect away
  if (!user) {
    redirect(`/${locale}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_banned')
    .eq('id', user.id)
    .single()

  if (!profile?.is_banned) {
    redirect(`/${locale}`)
  }

  return <BannedContent locale={locale} />
}
