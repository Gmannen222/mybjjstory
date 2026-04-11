'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

const DEFAULT_ITEMS = [
  'Gi / Rashguard',
  'Belte',
  'Munnbeskytter',
  'Vannflaske',
  'Håndkle',
  'Tape',
  'Sandaler / slippers',
  'Skifte / dusjtøy',
]

const CHECKED_KEY = 'training-checklist-checked'

export default function TrainingChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadItems() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: customItems } = await supabase
      .from('training_checklists')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order')

    const savedChecked: string[] = JSON.parse(localStorage.getItem(CHECKED_KEY) || '[]')

    const allItems: ChecklistItem[] = [
      ...DEFAULT_ITEMS.map((label) => ({
        id: `default-${label}`,
        label,
        checked: savedChecked.includes(`default-${label}`),
      })),
      ...(customItems || []).map((item: { id: string; label: string }) => ({
        id: item.id,
        label: item.label,
        checked: savedChecked.includes(item.id),
      })),
    ]

    setItems(allItems)
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  function toggleItem(id: string) {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
      const checkedIds = updated.filter((i) => i.checked).map((i) => i.id)
      localStorage.setItem(CHECKED_KEY, JSON.stringify(checkedIds))
      return updated
    })
  }

  async function addItem() {
    if (!newItem.trim()) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('training_checklists')
      .insert({ user_id: user.id, label: newItem.trim(), sort_order: items.length })
      .select()
      .single()

    if (!error && data) {
      setItems((prev) => [...prev, { id: data.id, label: data.label, checked: false }])
      setNewItem('')
    }
  }

  async function removeItem(id: string) {
    if (id.startsWith('default-')) return
    const supabase = createClient()
    await supabase.from('training_checklists').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function resetAll() {
    setItems((prev) => prev.map((i) => ({ ...i, checked: false })))
    localStorage.removeItem(CHECKED_KEY)
  }

  const checkedCount = items.filter((i) => i.checked).length
  const allChecked = items.length > 0 && checkedCount === items.length

  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-4" aria-busy="true" aria-label="Laster sjekkliste">
        <div className="h-5 bg-surface-hover rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-1.5 bg-surface-hover rounded-full mb-4 animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3">
              <div className="w-5 h-5 rounded border-2 border-white/10 bg-surface-hover animate-pulse flex-shrink-0" />
              <div className="h-3 bg-surface-hover rounded animate-pulse" style={{ width: `${60 + (i % 3) * 15}%` }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Pakkeliste</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">{checkedCount}/{items.length}</span>
          {checkedCount > 0 && (
            <button onClick={resetAll} className="text-xs text-primary hover:underline">
              Nullstill
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-white/5 rounded-full mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${items.length > 0 ? (checkedCount / items.length) * 100 : 0}%` }}
        />
      </div>

      {allChecked && (
        <div className="text-center text-sm text-green-400 mb-3 font-medium">
          Alt pakket! Klar for trening!
        </div>
      )}

      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 group">
            <button
              onClick={() => toggleItem(item.id)}
              className={`flex-1 flex items-center gap-3 py-2 px-3 rounded-lg transition-colors text-left ${
                item.checked ? 'bg-primary/10' : 'hover:bg-white/5'
              }`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                item.checked ? 'bg-primary border-primary' : 'border-white/20'
              }`}>
                {item.checked && (
                  <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${item.checked ? 'line-through text-muted' : ''}`}>
                {item.label}
              </span>
            </button>
            {!item.id.startsWith('default-') && (
              <button
                onClick={() => removeItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 text-xs px-2 py-1 hover:bg-red-400/10 rounded transition-all"
              >
                Fjern
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add custom item */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder="Legg til egen..."
          className="flex-1 px-3 py-2 bg-background border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
        />
        <button
          onClick={addItem}
          disabled={!newItem.trim()}
          className="px-3 py-2 bg-primary text-background text-sm font-semibold rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
