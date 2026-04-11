'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { Academy } from '@/lib/types/database'
import AcademyCard from './AcademyCard'

interface Props {
  academies: Academy[]
  regions: string[]
  affiliations: string[]
  memberCounts: Record<string, number>
}

export default function AcademyListClient({ academies, regions, affiliations, memberCounts }: Props) {
  const t = useTranslations('academies')
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('')
  const [affiliation, setAffiliation] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return academies.filter((a) => {
      if (region && a.region !== region) return false
      if (affiliation && a.affiliation !== affiliation) return false
      if (q && !a.name.toLowerCase().includes(q) && !a.city?.toLowerCase().includes(q)) return false
      return true
    })
  }, [academies, search, region, affiliation])

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search.placeholder')}
          className="flex-1 px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-foreground placeholder:text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-foreground [&>option]:text-black [&>option]:bg-white focus:outline-none focus:border-primary/50 transition-colors"
        >
          <option value="">{t('filters.regionAll')}</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <select
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-foreground [&>option]:text-black [&>option]:bg-white focus:outline-none focus:border-primary/50 transition-colors"
        >
          <option value="">{t('filters.affiliationAll')}</option>
          {affiliations.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-sm text-muted mb-4">
        {t('count', { count: filtered.length })}
      </p>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p>{t('empty.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((academy) => (
            <AcademyCard key={academy.id} academy={academy} memberCount={memberCounts[academy.id] ?? 0} />
          ))}
        </div>
      )}
    </div>
  )
}
