'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'

interface Academy {
  id: string
  name: string
  city: string | null
}

interface AcademySelectorProps {
  value: string
  academyId: string | null
  onChange: (name: string, id: string | null) => void
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[æå]/g, 'a')
    .replace(/ø/g, 'o')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

export default function AcademySelector({ value, academyId, onChange }: AcademySelectorProps) {
  const [search, setSearch] = useState(value)
  const [results, setResults] = useState<Academy[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Add form state
  const [newName, setNewName] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newRegion, setNewRegion] = useState('')
  const [newWebsite, setNewWebsite] = useState('')
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState(false)
  const [addSaving, setAddSaving] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()
  const t = useTranslations('academySelector')

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync external value changes
  useEffect(() => {
    setSearch(value)
  }, [value])

  const searchAcademies = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([])
      return
    }
    setIsSearching(true)
    const { data } = await supabase
      .from('academies')
      .select('id, name, city')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .eq('visibility', 'visible')
      .limit(10)
    setResults(data || [])
    setIsSearching(false)
  }, [supabase])

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setIsOpen(true)
    setShowAddForm(false)
    setAddSuccess(false)

    // If user clears or edits text, clear academy_id
    onChange(val, null)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      searchAcademies(val)
    }, 300)
  }

  const handleSelect = (academy: Academy) => {
    setSearch(academy.name)
    onChange(academy.name, academy.id)
    setIsOpen(false)
    setResults([])
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddError(null)
    setAddSaving(true)

    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      setAddError(t('authRequired'))
      setAddSaving(false)
      return
    }

    const slug = generateSlug(newName)

    const { data, error } = await supabase
      .from('academies')
      .insert({
        id: slug,
        name: newName,
        city: newCity,
        region: newRegion || null,
        website_url: newWebsite || null,
        country: 'Norge',
        country_code: 'NO',
        is_active: false,
        submitted_by: sessionData.session.user.id,
      })
      .select('id, name, city')
      .single()

    if (error) {
      if (error.code === '23505') {
        setAddError(t('duplicateAcademy'))
      } else {
        console.error('Error adding academy:', error)
        setAddError(t('addError'))
      }
      setAddSaving(false)
      return
    }

    if (data) {
      setSearch(data.name)
      onChange(data.name, data.id)
      setAddSuccess(true)
      setShowAddForm(false)
      setIsOpen(false)
    }
    setAddSaving(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-muted mb-2">
        {t('label')}
      </label>

      <input
        type="text"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        onFocus={() => { if (search.length >= 2) setIsOpen(true) }}
        placeholder={t('searchPlaceholder')}
        className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary"
      />

      {academyId && !isOpen && (
        <p className="text-xs text-primary mt-1">{t('linked')}</p>
      )}

      {addSuccess && (
        <p className="text-xs text-green-400 mt-1">{t('pendingApproval')}</p>
      )}

      {/* Search results dropdown */}
      {isOpen && search.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-surface border border-white/10 rounded-lg shadow-lg overflow-hidden">
          {isSearching && (
            <div className="px-4 py-3 text-sm text-muted">{t('searching')}</div>
          )}

          {!isSearching && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted">{t('noResults')}</div>
          )}

          {results.map((academy) => (
            <button
              key={academy.id}
              type="button"
              onClick={() => handleSelect(academy)}
              className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
            >
              <span className="text-foreground text-sm font-medium">{academy.name}</span>
              {academy.city && (
                <span className="text-muted text-xs ml-2">{academy.city}</span>
              )}
            </button>
          ))}

          {/* Add new academy link */}
          <button
            type="button"
            onClick={() => {
              setShowAddForm(true)
              setNewName(search)
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-3 text-primary text-sm hover:bg-white/5 transition-colors border-t border-white/10"
          >
            {t('addNew')}
          </button>
        </div>
      )}

      {/* Add new academy form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="mt-3 p-4 bg-surface border border-white/10 rounded-lg space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t('addNewTitle')}</h3>

          <div>
            <label className="block text-xs text-muted mb-1">
              {t('academyName')} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">
              {t('city')} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">{t('region')}</label>
            <input
              type="text"
              value={newRegion}
              onChange={(e) => setNewRegion(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">{t('website')}</label>
            <input
              type="url"
              value={newWebsite}
              onChange={(e) => setNewWebsite(e.target.value)}
              placeholder="https://"
              className="w-full px-3 py-2 bg-background border border-white/10 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {addError && <p className="text-red-400 text-xs">{addError}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={addSaving || !newName || !newCity}
              className="px-4 py-2 bg-primary text-background text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {addSaving ? t('saving') : t('submitAcademy')}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-muted text-sm hover:text-foreground transition-colors"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
