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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-primary focus:text-background focus:rounded-lg focus:font-semibold">
          Hopp til innhold
        </a>
        <NextIntlClientProvider messages={messages}>
          <RealtimeProvider>
            <BanCheck locale={locale} />
            <Header />
            <main id="main-content" className="flex-1 pb-20 sm:pb-0">{children}</main>
            <BottomNav />
            <PushPrompt />
          </RealtimeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
