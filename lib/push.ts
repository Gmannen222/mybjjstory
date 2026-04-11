import webpush from 'web-push'
import { createClient as createServiceClient } from '@supabase/supabase-js'

// Configure VAPID
webpush.setVapidDetails(
  'mailto:kontakt@mybjjstory.no',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export type NotificationType = 'comments' | 'reactions' | 'follows' | 'achievements' | 'training_reminder'

/**
 * Check if a notification type is enabled for a user.
 * Uses service role to read another user's preferences.
 */
export async function shouldNotify(
  userId: string,
  type: NotificationType
): Promise<boolean> {
  const serviceClient = getServiceClient()

  const { data } = await serviceClient
    .from('profiles')
    .select('notification_preferences')
    .eq('id', userId)
    .single()

  const prefs = data?.notification_preferences as Record<string, boolean> | null
  return prefs?.[type] ?? true
}

/**
 * Send a push notification to all devices registered by a user.
 * Automatically cleans up expired/invalid subscriptions.
 */
export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  options?: {
    url?: string
    tag?: string
    type?: NotificationType
  }
) {
  // Check user preferences if a type is specified
  if (options?.type) {
    const enabled = await shouldNotify(userId, options.type)
    if (!enabled) return
  }

  const serviceClient = getServiceClient()

  const { data: subscriptions } = await serviceClient
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)

  if (!subscriptions?.length) return

  const payload = JSON.stringify({
    title,
    body,
    url: options?.url || '/',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: options?.tag || 'default',
  })

  await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload
      ).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription expired or invalid, remove it
          await serviceClient
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id)
        }
        throw err
      })
    )
  )
}
