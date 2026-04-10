'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TECHNIQUE_LIBRARY, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/techniques'
import type { TechniqueCategory, UserTechnique } from '@/lib/types/database'

interface SelectedTechnique {
  name: string
  category: TechniqueCategory | null
}

export default function TechniquePicker({
  selected,
  onChange,
}: {
  selected: SelectedTechnique[]
  onChange: (techniques: SelectedTechnique[]) => void
}) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState<TechniqueCategory | ''>('')
  const [userTechniques, setUserTechniques] = useState<UserTechnique[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('user_techniques')
      .select('*')
      .order('name')
      .then(({ data }) => setUserTechniques(data || []))
  }, [supabase])

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const allTechniques = [
    ...TECHNIQUE_LIBRARY,
    ...userTechniques.map((t) => ({ name: t.name, category: t.category || ('other' as TechniqueCategory) })),
  ]

  // Deduplicate by name (user overrides default)
  const uniqueTechniques = allTechniques.reduce<Record<string, SelectedTechnique>>((acc, t) => {
    if (!acc[t.name.toLowerCase()]) {
      acc[t.name.toLowerCase()] = { name: t.name, category: t.category }
    }
    return acc
  }, {})

  const selectedNames = new Set(selected.map((s) => s.name.toLowerCase()))

  const filtered = Object.values(uniqueTechniques).filter((t) => {
    if (selectedNames.has(t.name.toLowerCase())) return false
    if (filterCategory && t.category !== filterCategory) return false
    if (query && !t.name.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  const addTechnique = (tech: SelectedTechnique) => {
    onChange([...selected, tech])
    setQuery('')
    inputRef.current?.focus()
  }

  const removeTechnique = (name: string) => {
    onChange(selected.filter((t) => t.name !== name))
  }

  const addCustom = async () => {
    if (!query.trim()) return
    const name = query.trim()
    if (selectedNames.has(name.toLowerCase())) return

    addTechnique({ name, category: filterCategory || null })

    // Save to user's technique library
    const { data: session } = await supabase.auth.getSession()
    if (session.session) {
      await supabase.from('user_techniques').upsert({
        user_id: session.session.user.id,
        name,
        category: filterCategory || null,
      }, { onConflict: 'user_id,name' })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered.length > 0) {
        addTechnique(filtered[0])
      } else if (query.trim()) {
        addCustom()
      }
    }
  }

  return (
    <div ref={dropdownRef} className="space-y-3">
      {/* Selected techniques */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((tech) => (
            <span
              key={tech.name}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                tech.category ? CATEGORY_COLORS[tech.category] : 'bg-surface-hover text-muted'
              }`}
            >
              {tech.name}
              <button
                type="button"
                onClick={() => removeTechnique(tech.name)}
                className="opacity-60 hover:opacity-100 ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Søk teknikk eller skriv ny..."
          className="w-full px-4 py-3 bg-surface border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-primary text-sm"
        />

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-surface border border-white/10 rounded-xl shadow-xl max-h-64 overflow-hidden">
            {/* Category filters */}
            <div className="flex gap-1 p-2 border-b border-white/5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilterCategory('')}
                className={`px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                  !filterCategory ? 'bg-primary text-background' : 'text-muted hover:text-foreground'
                }`}
              >
                Alle
              </button>
              {(Object.keys(CATEGORY_LABELS) as TechniqueCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
                  className={`px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                    filterCategory === cat ? 'bg-primary text-background' : 'text-muted hover:text-foreground'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-48 overflow-y-auto">
              {filtered.slice(0, 20).map((tech) => (
                <button
                  key={tech.name}
                  type="button"
                  onClick={() => addTechnique(tech)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-surface-hover transition-colors text-left"
                >
                  <span className="text-sm">{tech.name}</span>
                  {tech.category && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${CATEGORY_COLORS[tech.category]}`}>
                      {CATEGORY_LABELS[tech.category]}
                    </span>
                  )}
                </button>
              ))}

              {filtered.length === 0 && query.trim() && (
                <button
                  type="button"
                  onClick={addCustom}
                  className="w-full px-3 py-3 text-left hover:bg-surface-hover transition-colors"
                >
                  <span className="text-sm text-primary">+ Legg til &quot;{query.trim()}&quot;</span>
                  <span className="text-xs text-muted block mt-0.5">Lagres i ditt teknikk-bibliotek</span>
                </button>
              )}

              {filtered.length === 0 && !query.trim() && (
                <div className="px-3 py-3 text-sm text-muted text-center">
                  Alle teknikker er valgt
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
