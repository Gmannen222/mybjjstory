import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AchievementsList from '@/components/achievements/AchievementsList'

export const dynamic = 'force-dynamic'

export default async function AchievementsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Achievements</h1>
      <AchievementsList />
    </div>
  )
}
