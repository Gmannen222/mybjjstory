import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Dashboard from '@/components/dashboard/Dashboard'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    return <Dashboard locale={locale} userId={session.user.id} />
  }

  return <LandingPage locale={locale} />
}

async function LandingPage({ locale }: { locale: string }) {
  const t = await getTranslations('landing')

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="max-w-5xl mx-auto px-4 py-20 sm:py-32 text-center relative">
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
            {t('hero.badge')}
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
            {t('hero.title1')}
            <br />
            <span className="text-primary">{t('hero.title2')}</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/login`}
              className="px-8 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-colors text-lg"
            >
              {t('hero.cta')}
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border border-white/20 text-foreground font-semibold rounded-xl hover:bg-surface transition-colors text-lg"
            >
              {t('hero.secondary')}
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-surface/50">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary">100%</div>
            <div className="text-sm text-muted mt-1">{t('stats.free')}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary">PWA</div>
            <div className="text-sm text-muted mt-1">{t('stats.mobile')}</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary">BJJ</div>
            <div className="text-sm text-muted mt-1">{t('stats.community')}</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          {t('features.title')}
        </h2>
        <p className="text-muted text-center mb-16 max-w-2xl mx-auto">
          {t('features.subtitle')}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🥋', key: 'training' },
            { icon: '🏅', key: 'gradings' },
            { icon: '📸', key: 'media' },
            { icon: '📊', key: 'stats' },
            { icon: '👥', key: 'social' },
            { icon: '📱', key: 'pwa' },
          ].map(({ icon, key }) => (
            <div
              key={key}
              className="group relative bg-surface rounded-2xl p-6 border border-white/5 hover:border-primary/30 hover:scale-[1.03] hover:shadow-[0_0_30px_-5px_rgba(201,168,76,0.15)] transition-all duration-300 cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                <h3 className="text-lg font-bold mb-2">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="text-sm text-muted mb-4">
                  {t(`features.${key}.desc`)}
                </p>
                <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t('features.cta')} →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            {t('howItWorks.title')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-primary text-background rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {t(`howItWorks.step${step}.title`)}
                </h3>
                <p className="text-sm text-muted">
                  {t(`howItWorks.step${step}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Belts showcase */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          {t('belts.title')}
        </h2>
        <p className="text-muted text-center mb-12 max-w-2xl mx-auto">
          {t('belts.subtitle')}
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          {[
            { color: '#ffffff', text: '#111', label: 'Hvitt' },
            { color: '#3b82f6', text: '#fff', label: 'Blått' },
            { color: '#9333ea', text: '#fff', label: 'Lilla' },
            { color: '#92400e', text: '#fff', label: 'Brunt' },
            { color: '#1a1a1a', text: '#fff', label: 'Svart' },
          ].map(({ color, text, label }) => (
            <div
              key={label}
              className="px-6 py-3 rounded-full font-bold text-sm"
              style={{ backgroundColor: color, color: text }}
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-muted text-lg mb-8">
          {t('cta.subtitle')}
        </p>
        <Link
          href={`/${locale}/login`}
          className="inline-block px-8 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-colors text-lg"
        >
          {t('cta.button')}
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-surface/30">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <span>MyBJJStory &copy; {new Date().getFullYear()}</span>
          <div className="flex gap-6">
            <Link href={`/${locale}/about`} className="hover:text-foreground transition-colors">
              {t('footer.about')}
            </Link>
            <Link href={`/${locale}/privacy`} className="hover:text-foreground transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-foreground transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
