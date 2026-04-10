import { createStaticClient } from '@/lib/supabase/static'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Academy } from '@/lib/types/database'

export default async function AcademyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const t = await getTranslations('academies')
  const supabase = createStaticClient()

  const { data: academy } = await supabase
    .from('academies')
    .select('*')
    .eq('id', id)
    .single()

  if (!academy) notFound()

  const a = academy as Academy

  const mapsUrl = a.lat && a.lng
    ? `https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}`
    : a.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.address)}`
      : null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 sm:pb-6">
        {/* Back link */}
        <Link
          href={`/${locale}/academies`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <span>←</span>
          <span>{t('detail.backToList')}</span>
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          {a.logo_url ? (
            <img
              src={a.logo_url}
              alt={a.name}
              className="w-16 h-16 rounded-xl object-contain bg-white/5 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🥋</span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{a.name}</h1>
            <p className="text-muted mt-0.5">{a.city}{a.region ? `, ${a.region}` : ''}</p>
            {a.affiliation && (
              <span className="inline-block mt-2 text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                {a.affiliation}
              </span>
            )}
          </div>
        </div>

        {/* Info cards */}
        <div className="space-y-4">
          {/* Address */}
          {a.address && (
            <div className="rounded-xl bg-surface border border-white/10 p-4">
              <h2 className="text-sm font-medium text-muted mb-2">{t('card.address')}</h2>
              <p className="text-foreground">{a.address}</p>
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  📍 {t('card.openInMaps')}
                </a>
              )}
            </div>
          )}

          {/* Website */}
          {a.website_url && (
            <div className="rounded-xl bg-surface border border-white/10 p-4">
              <h2 className="text-sm font-medium text-muted mb-2">{t('card.website')}</h2>
              <a
                href={a.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                🌐 {t('card.visitWebsite')}
              </a>
            </div>
          )}

          {/* Map embed */}
          {a.lat && a.lng && (
            <div className="rounded-xl bg-surface border border-white/10 overflow-hidden">
              <h2 className="text-sm font-medium text-muted p-4 pb-2">{t('detail.location')}</h2>
              <iframe
                title={a.name}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${a.lng - 0.01},${a.lat - 0.005},${a.lng + 0.01},${a.lat + 0.005}&layer=mapnik&marker=${a.lat},${a.lng}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
