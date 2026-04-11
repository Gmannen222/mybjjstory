import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Dashboard from '@/components/dashboard/Dashboard'
import { BeltDisplay, ALL_BELTS } from '@/components/ui/BeltBadge'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return <Dashboard locale={locale} userId={user.id} />
  }

  return <LandingPage locale={locale} />
}

async function LandingPage({ locale }: { locale: string }) {
  const t = await getTranslations('landing')

  const features = [
    { icon: '🥋', key: 'training', color: 'from-blue-500/10' },
    { icon: '🏅', key: 'gradings', color: 'from-yellow-500/10' },
    { icon: '📸', key: 'media', color: 'from-pink-500/10' },
    { icon: '📊', key: 'stats', color: 'from-green-500/10' },
    { icon: '👥', key: 'social', color: 'from-purple-500/10' },
    { icon: '📱', key: 'pwa', color: 'from-cyan-500/10' },
  ]

  // Belt progression to show: white → blue → purple → brown → black (each with some stripes)
  const beltProgression = [
    { rank: 'white', degrees: 3 },
    { rank: 'blue', degrees: 2 },
    { rank: 'purple', degrees: 1 },
    { rank: 'brown', degrees: 2 },
    { rank: 'black', degrees: 1 },
  ] as const

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-5xl mx-auto px-4 pt-20 pb-16 sm:pt-32 sm:pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-8 border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            {t('hero.badge')}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            {t('hero.title1')}
            <br />
            <span className="text-primary">{t('hero.title2')}</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/login`}
              className="px-8 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-all hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(201,168,76,0.4)] text-lg"
            >
              {t('hero.cta')}
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border border-white/20 text-foreground font-semibold rounded-xl hover:bg-surface hover:border-white/30 transition-colors text-lg"
            >
              {t('hero.secondary')}
            </a>
          </div>

          {/* Belt progression preview */}
          <div className="mt-16 flex flex-col items-center gap-3">
            <p className="text-xs text-muted uppercase tracking-widest">Din reise</p>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {beltProgression.map(({ rank, degrees }, i) => (
                <div key={rank} className="flex items-center gap-2">
                  <div className="w-20 sm:w-28">
                    <BeltDisplay rank={rank} degrees={degrees} size="sm" />
                  </div>
                  {i < beltProgression.length - 1 && (
                    <span className="text-muted/40 text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-surface/50">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-primary">✓</div>
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
      <section id="features" className="max-w-5xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon, key, color }) => (
            <div
              key={key}
              className="group relative bg-surface rounded-2xl p-6 border border-white/5 hover:border-primary/30 hover:scale-[1.03] hover:shadow-[0_0_40px_-10px_rgba(201,168,76,0.2)] transition-all duration-300 cursor-default overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{icon}</div>
                <h3 className="text-lg font-bold mb-2">
                  {t(`features.${key}.title` as any)}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t(`features.${key}.desc` as any)}
                </p>
                <div className="mt-4 h-5">
                  <span className="text-xs text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t('features.cta')} →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface/50 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
            {t('howItWorks.title')}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-6 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center relative">
                <div className="w-12 h-12 bg-primary text-background rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-[0_0_20px_-3px_rgba(201,168,76,0.4)]">
                  {step}
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {t(`howItWorks.step${step}.title` as any)}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t(`howItWorks.step${step}.desc` as any)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Belts showcase — all belts using BeltDisplay */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('belts.title')}
          </h2>
          <p className="text-muted max-w-2xl mx-auto text-lg">
            {t('belts.subtitle')}
          </p>
        </div>

        <div className="space-y-3 max-w-lg mx-auto">
          {/* Adult belts */}
          {(['white', 'blue', 'purple', 'brown', 'black'] as const).map((rank, i) => (
            <div key={rank} className="flex items-center gap-4">
              <div className="flex-1">
                <BeltDisplay rank={rank} degrees={i} size="md" />
              </div>
            </div>
          ))}
          {/* Kids belt examples */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-muted text-center mb-4 uppercase tracking-wider">Barnebelter</p>
            <div className="grid grid-cols-2 gap-3">
              {(['grey', 'yellow', 'orange', 'green'] as const).map((rank) => (
                <BeltDisplay key={rank} rank={rank} degrees={2} size="sm" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/8 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 py-24 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link
            href={`/${locale}/login`}
            className="inline-block px-10 py-4 bg-primary text-background font-bold rounded-xl hover:bg-primary-hover transition-all hover:scale-105 hover:shadow-[0_0_40px_-5px_rgba(201,168,76,0.5)] text-lg"
          >
            {t('cta.button')}
          </Link>
          <p className="text-xs text-muted mt-4">Prøv gratis. Ingen kredittkort.</p>
        </div>
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
