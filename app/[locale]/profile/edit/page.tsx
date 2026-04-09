import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import ProfileForm from '@/components/profile/ProfileForm'
import type { Profile } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

export default async function EditProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('profile')
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect(`/${locale}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{t('edit')}</h1>
      <ProfileForm profile={profile as Profile | null} locale={locale} />
    </div>
  )
}
