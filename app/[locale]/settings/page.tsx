import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsPage from '@/components/settings/SettingsPage'

export const dynamic = 'force-dynamic'

export default async function Settings({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, username, avatar_url, belt_rank, academy_name, notification_preferences')
    .eq('id', user.id)
    .single()

  const { data: feedback } = await supabase
    .from('feedback')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <SettingsPage
      locale={locale}
      userId={user.id}
      userEmail={user.email ?? ''}
      profile={profile}
      previousFeedback={feedback || []}
      notificationPreferences={profile?.notification_preferences ?? {
        comments: true,
        reactions: true,
        follows: true,
        achievements: true,
        training_reminder: false,
      }}
    />
  )
}
