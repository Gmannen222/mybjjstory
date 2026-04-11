'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { isSafeUrl } from '@/lib/url'
import type { Academy } from '@/lib/types/database'

interface Props {
  academy: Academy
}

export default function AcademyCard({ academy }: Props) {
  const t = useTranslations('academies')
  const locale = useLocale()

  return (
    <Link
      href={`/${locale}/academies/${academy.id}`}
      className="block rounded-xl bg-surface border border-white/10 p-4 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-start gap-3">
        {academy.logo_url && isSafeUrl(academy.logo_url) ? (
          <Image
            src={academy.logo_url}
            alt={academy.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-lg object-contain bg-white/5 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🥋</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground truncate">{academy.name}</h3>
          <p className="text-sm text-muted">{academy.city}{academy.region ? `, ${academy.region}` : ''}</p>
          {academy.affiliation && (
            <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {academy.affiliation}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
