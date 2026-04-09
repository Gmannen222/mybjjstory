import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${locale}/login`)
  }

  // Check if user already completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, belt_rank')
    .eq('id', session.user.id)
    .single()

  if (profile?.username && profile?.belt_rank) {
    redirect(`/${locale}`)
  }

  return <OnboardingFlow locale={locale} />
}
