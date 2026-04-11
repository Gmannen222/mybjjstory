'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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

export default function PushPrompt() {
  const [visible, setVisible] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    async function checkShouldShow() {
      // Check browser support
      if (!('PushManager' in window) || !('Notification' in window)) return
      if (!('serviceWorker' in navigator)) return

      // Check permission state
      if (Notification.permission !== 'default') return

      // Check if user dismissed before
      if (localStorage.getItem('push-prompt-dismissed') === 'true') return

      // Check if user is logged in
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Show after a short delay for less intrusive UX
      timer = setTimeout(() => setVisible(true), 2500)
    }

    checkShouldShow()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [])

  async function handleActivate() {
    setIsSubscribing(true)

    try {
      const permission = await Notification.requestPermission()

      if (permission !== 'granted') {
        // User denied — hide and don't show again
        setVisible(false)
        return
      }

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) {
        console.error('VAPID public key not configured')
        setVisible(false)
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

      if (!response.ok) {
        console.error('Failed to save push subscription')
      }
    } catch (error) {
      console.error('Push subscription failed:', error)
    } finally {
      setIsSubscribing(false)
      setVisible(false)
    }
  }

  function handleDismiss() {
    localStorage.setItem('push-prompt-dismissed', 'true')
    setVisible(false)
  }

  return (
    <div
      className={`fixed bottom-24 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 transition-all duration-300 ease-in-out ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-surface border border-white/10 rounded-2xl p-4 shadow-xl">
        <p className="text-sm mb-3">
          Vil du motta varsler om kommentarer, reaksjoner og achievements?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleActivate}
            disabled={isSubscribing}
            className="flex-1 py-2 px-3 bg-primary text-background font-semibold rounded-xl hover:bg-primary-hover transition-colors text-sm disabled:opacity-50"
          >
            {isSubscribing ? 'Aktiverer...' : 'Aktiver varsler'}
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 text-sm text-muted hover:text-foreground transition-colors"
          >
            Ikke nå
          </button>
        </div>
      </div>
    </div>
  )
}
