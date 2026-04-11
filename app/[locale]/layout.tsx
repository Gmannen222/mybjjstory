import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '../i18n/routing'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import BanCheck from '@/components/auth/BanCheck'
import PushPrompt from '@/components/notifications/PushPrompt'
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'no')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="h-full">
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <NextIntlClientProvider messages={messages}>
          <RealtimeProvider>
            <BanCheck locale={locale} />
            <Header />
            <main className="flex-1 pb-20 sm:pb-0">{children}</main>
            <BottomNav />
            <PushPrompt />
          </RealtimeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
