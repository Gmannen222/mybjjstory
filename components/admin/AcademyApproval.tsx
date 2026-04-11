'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

interface AcademyData {
  id: string
  name: string
  city: string | null
  region: string | null
  website_url: string | null
  created_at: string
  submitted_by_name?: string | null
  member_count?: number
}

export default function AcademyApproval({
  academy,
  type,
}: {
  academy: AcademyData
  type: 'pending' | 'active'
}) {
  const t = useTranslations('admin.academies')
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAction(action: 'approve' | 'reject' | 'deactivate') {
    setError(null)
    setLoading(action)
    const supabase = createClient()

    let result
    if (action === 'approve') {
      result = await supabase
        .from('academies')
        .update({ is_active: true })
        .eq('id', academy.id)
    } else if (action === 'reject') {
      result = await supabase
        .from('academies')
        .delete()
        .eq('id', academy.id)
    } else {
      result = await supabase
        .from('academies')
        .update({ is_active: false })
        .eq('id', academy.id)
    }

    setLoading(null)
    if (result.error) {
      console.error(`Academy ${action} failed:`, result.error)
      setError(result.error.message)
      return
    }
    router.refresh()
  }

  return (
    <div className="bg-surface rounded-xl p-5">
      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-3">
          {error}
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{academy.name}</h3>
          <div className="text-sm text-muted mt-1 space-y-0.5">
            {academy.city && (
              <p>
                {academy.city}
                {academy.region ? `, ${academy.region}` : ''}
              </p>
            )}
            {academy.website_url && (
              <a
                href={academy.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline block truncate"
              >
                {academy.website_url}
              </a>
            )}
            {type === 'pending' && academy.submitted_by_name && (
              <p className="text-xs">
                {t('submittedBy')}: {academy.submitted_by_name}
              </p>
            )}
            {type === 'active' && academy.member_count !== undefined && (
              <p className="text-xs">
                {academy.member_count} {t('members')}
              </p>
            )}
            {type === 'pending' && (
              <p className="text-xs text-muted/60">
                {new Date(academy.created_at).toLocaleDateString('nb-NO', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {type === 'pending' && (
            <>
              <button
                onClick={() => handleAction('approve')}
                disabled={loading !== null}
                className="px-3 py-1.5 text-xs rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors font-medium disabled:opacity-50"
              >
                {loading === 'approve' ? '...' : t('approve')}
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={loading !== null}
                className="px-3 py-1.5 text-xs rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors font-medium disabled:opacity-50"
              >
                {loading === 'reject' ? '...' : t('reject')}
              </button>
            </>
          )}
          {type === 'active' && (
            <button
              onClick={() => handleAction('deactivate')}
              disabled={loading !== null}
              className="px-3 py-1.5 text-xs rounded-lg bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 transition-colors font-medium disabled:opacity-50"
            >
              {loading === 'deactivate' ? '...' : t('deactivate')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
