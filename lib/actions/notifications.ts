'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/actions/posts'
import type { NotificationPreferences } from '@/lib/types/database'

export async function updateNotificationPreferences(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Du må være innlogget for å oppdatere varsler.' }
  }

  const preferences: NotificationPreferences = {
    comments: formData.get('comments') === 'true',
    reactions: formData.get('reactions') === 'true',
    follows: formData.get('follows') === 'true',
    achievements: formData.get('achievements') === 'true',
    training_reminder: formData.get('training_reminder') === 'true',
  }

  const { error } = await supabase
    .from('profiles')
    .update({ notification_preferences: preferences })
    .eq('id', user.id)

  if (error) {
    console.error('Failed to update notification preferences:', error)
    return { success: false, error: 'Kunne ikke oppdatere varslingsinnstillinger. Prøv igjen.' }
  }

  revalidatePath('/')

  return { success: true }
}
