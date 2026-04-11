'use client'

import { useState, useCallback } from 'react'
import type { NotificationPreferences } from '@/lib/types/database'

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const buffer = new ArrayBuffer(rawData.length)
  const outputArray = new Uint8Array(buffer)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

interface ToggleProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between py-3 text-left"
    >
      <div className="mr-4">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted mt-0.5">{description}</div>
      </div>
      <div
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          checked ? 'bg-primary' : 'bg-surface-hover'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  )
}

const NOTIFICATION_TYPES: {
  key: keyof NotificationPreferences
  label: string
  description: string
}[] = [
  {
    key: 'comments',
    label: 'Kommentarer',
    description: 'Noen kommenterer på innlegget ditt',
  },
  {
    key: 'reactions',
    label: 'Reaksjoner',
    description: 'Noen reagerer på innlegget ditt',
  },
  {
    key: 'follows',
    label: 'Følgere',
    description: 'Noen begynner å følge deg',
  },
  {
    key: 'achievements',
    label: 'Achievements',
    description: 'Du låser opp en ny achievement',
  },
  {
    key: 'training_reminder',
    label: 'Treningspåminnelse',
    description: 'Daglig påminnelse om å trene',
  },
]

export default function NotificationSettings({
  preferences: initialPreferences,
}: {
  preferences: NotificationPreferences
}) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(initialPreferences)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [pushStatus, setPushStatus] = useState<'unknown' | 'subscribed' | 'unsubscribed'>('unknown')
  const [pushLoading, setPushLoading] = useState(false)

  // Check push subscription status on mount
  useState(() => {
    async function checkPushStatus() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setPushStatus('unsubscribed')
        return
      }

      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setPushStatus(subscription ? 'subscribed' : 'unsubscribed')
      } catch {
        setPushStatus('unsubscribed')
      }
    }

    checkPushStatus()
  })

  const savePreferences = useCallback(async (updated: NotificationPreferences) => {
    setSaveStatus('saving')

    try {
      const formData = new FormData()
      formData.set('comments', String(updated.comments))
      formData.set('reactions', String(updated.reactions))
      formData.set('follows', String(updated.follows))
      formData.set('achievements', String(updated.achievements))
      formData.set('training_reminder', String(updated.training_reminder))

      const { updateNotificationPreferences } = await import('@/lib/actions/notifications')
      const result = await updateNotificationPreferences({ success: true }, formData)

      if (result.success) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        console.error('Failed to save preferences:', result.error)
        setSaveStatus('error')
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Failed to save notification preferences:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }, [])

  function handleToggle(key: keyof NotificationPreferences, checked: boolean) {
    const updated = { ...preferences, [key]: checked }
    setPreferences(updated)
    savePreferences(updated)
  }

  async function handleActivatePush() {
    if (!('PushManager' in window) || !('Notification' in window)) return

    setPushLoading(true)

    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setPushLoading(false)
        return
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) {
        console.error('VAPID public key not configured')
        setPushLoading(false)
        return
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      const subJson = subscription.toJSON()

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys?.p256dh,
            auth: subJson.keys?.auth,
          },
        }),
      })

      if (response.ok) {
        setPushStatus('subscribed')
      }
    } catch (error) {
      console.error('Push activation failed:', error)
    } finally {
      setPushLoading(false)
    }
  }

  async function handleDeactivatePush() {
    setPushLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        const endpoint = subscription.endpoint
        await subscription.unsubscribe()

        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        })
      }

      setPushStatus('unsubscribed')
    } catch (error) {
      console.error('Push deactivation failed:', error)
    } finally {
      setPushLoading(false)
    }
  }

  const pushSupported = typeof window !== 'undefined' && 'PushManager' in window

  return (
    <div className="space-y-4">
      {/* Push subscription status */}
      <div className="flex items-center justify-between py-3 border-b border-white/5">
        <div>
          <div className="text-sm font-medium">Push-varsler</div>
          <div className="text-xs text-muted mt-0.5">
            {!pushSupported
              ? 'Nettleseren din støtter ikke push-varsler'
              : pushStatus === 'subscribed'
                ? 'Varsler er aktivert'
                : 'Varsler er deaktivert'}
          </div>
        </div>
        {pushSupported && (
          <button
            onClick={pushStatus === 'subscribed' ? handleDeactivatePush : handleActivatePush}
            disabled={pushLoading || pushStatus === 'unknown'}
            className={`py-1.5 px-4 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 ${
              pushStatus === 'subscribed'
                ? 'border border-white/10 text-muted hover:text-foreground hover:bg-surface-hover'
                : 'bg-primary text-background hover:bg-primary-hover'
            }`}
          >
            {pushLoading
              ? 'Laster...'
              : pushStatus === 'subscribed'
                ? 'Deaktiver'
                : 'Aktiver'}
          </button>
        )}
      </div>

      {/* Notification type toggles */}
      <div className="divide-y divide-white/5">
        {NOTIFICATION_TYPES.map((type) => (
          <Toggle
            key={type.key}
            label={type.label}
            description={type.description}
            checked={preferences[type.key]}
            onChange={(checked) => handleToggle(type.key, checked)}
          />
        ))}
      </div>

      {/* Save status indicator */}
      {saveStatus !== 'idle' && (
        <div className={`text-xs ${
          saveStatus === 'saving' ? 'text-muted' :
          saveStatus === 'saved' ? 'text-green-400' :
          'text-red-400'
        }`}>
          {saveStatus === 'saving' && 'Lagrer...'}
          {saveStatus === 'saved' && 'Lagret!'}
          {saveStatus === 'error' && 'Kunne ikke lagre. Prøv igjen.'}
        </div>
      )}
    </div>
  )
}
