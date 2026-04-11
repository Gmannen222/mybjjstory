'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { BeltRank, UserRole, AvatarConfigData } from '@/lib/types/database'
import UserDetailPanel from './UserDetailPanel'

export interface AdminUser {
  id: string
  display_name: string | null
  username: string | null
  belt_rank: BeltRank | null
  belt_degrees: number
  avatar_config: AvatarConfigData | null
  academy_id: string | null
  academy_name: string | null
  role: UserRole
  is_banned: boolean
  banned_at: string | null
  ban_reason: string | null
  created_at: string
  session_count: number
  last_session: string | null
}

const BELT_COLORS: Record<string, string> = {
  white: 'border-white',
  blue: 'border-blue-500',
  purple: 'border-purple-500',
  brown: 'border-amber-700',
  black: 'border-gray-800',
}

const BELT_BG: Record<string, string> = {
  white: 'bg-white text-gray-900',
  blue: 'bg-blue-500 text-white',
  purple: 'bg-purple-500 text-white',
  brown: 'bg-amber-700 text-white',
  black: 'bg-gray-900 text-white border border-white/20',
}

function getMainBelt(belt: string | null): string {
  if (!belt) return 'white'
  if (['grey_white', 'grey', 'grey_black', 'yellow_white', 'yellow', 'yellow_black', 'orange_white', 'orange', 'orange_black', 'green_white', 'green', 'green_black'].includes(belt)) {
    return 'white'
  }
  return belt
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('no-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function UserList({
  users,
  locale,
}: {
  users: AdminUser[]
  locale: string
}) {
  const t = useTranslations('admin.users')
  const tBelts = useTranslations('belts')
  const [search, setSearch] = useState('')
  const [beltFilter, setBeltFilter] = useState<string>('all')
  const [showBanned, setShowBanned] = useState(false)
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = users

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        (u) =>
          (u.display_name || '').toLowerCase().includes(q) ||
          (u.username || '').toLowerCase().includes(q)
      )
    }

    // Belt filter
    if (beltFilter !== 'all') {
      result = result.filter((u) => getMainBelt(u.belt_rank) === beltFilter)
    }

    // Banned filter
    if (!showBanned) {
      result = result.filter((u) => !u.is_banned)
    }

    return result
  }, [users, search, beltFilter, showBanned])

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-[44px]"
        />
        <select
          value={beltFilter}
          onChange={(e) => setBeltFilter(e.target.value)}
          className="bg-background border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary min-h-[44px]"
        >
          <option value="all">{t('filterAll')}</option>
          {['white', 'blue', 'purple', 'brown', 'black'].map((belt) => (
            <option key={belt} value={belt}>
              {tBelts(belt)}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 bg-background border border-white/10 rounded-xl px-4 py-3 text-sm cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={showBanned}
            onChange={(e) => setShowBanned(e.target.checked)}
            className="accent-primary"
          />
          {t('showBanned')}
        </label>
      </div>

      {/* Count */}
      <p className="text-sm text-muted mb-4">
        {filtered.length} / {users.length} {t('title').toLowerCase()}
      </p>

      {/* User list */}
      {filtered.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 text-center text-muted">
          {t('noUsers')}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((user) => (
            <div key={user.id}>
              <button
                onClick={() =>
                  setExpandedUserId(expandedUserId === user.id ? null : user.id)
                }
                className="w-full bg-surface rounded-xl p-4 flex items-center gap-4 hover:bg-surface/80 transition-colors text-left min-h-[44px]"
              >
                {/* Avatar circle with belt border */}
                <div
                  className={`w-10 h-10 rounded-full border-2 ${BELT_COLORS[getMainBelt(user.belt_rank)] || 'border-white'} flex items-center justify-center text-sm font-bold shrink-0`}
                  style={{
                    backgroundColor: user.avatar_config?.skinTone || '#4a5568',
                  }}
                >
                  {(user.display_name || user.username || '?')[0].toUpperCase()}
                </div>

                {/* Name + username */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {user.display_name || user.username || 'Uten navn'}
                  </div>
                  {user.username && (
                    <div className="text-xs text-muted truncate">
                      @{user.username}
                    </div>
                  )}
                </div>

                {/* Belt badge */}
                <span
                  className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full ${BELT_BG[getMainBelt(user.belt_rank)] || 'bg-white text-gray-900'}`}
                >
                  {tBelts(user.belt_rank || 'white')}
                </span>

                {/* Academy */}
                <span className="hidden md:inline-block text-xs text-muted truncate max-w-[120px]">
                  {user.academy_name || '-'}
                </span>

                {/* Session count */}
                <span className="hidden sm:inline-block text-xs text-muted w-16 text-right">
                  {user.session_count} {t('sessions').toLowerCase().slice(0, 5)}
                </span>

                {/* Joined */}
                <span className="hidden lg:inline-block text-xs text-muted w-24 text-right">
                  {formatDate(user.created_at)}
                </span>

                {/* Status badge */}
                {user.is_banned ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-400/20 text-red-400 font-medium">
                    {t('banned')}
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/20 text-green-400 font-medium">
                    {t('active')}
                  </span>
                )}
              </button>

              {/* Expanded detail panel */}
              {expandedUserId === user.id && (
                <UserDetailPanel user={user} locale={locale} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
