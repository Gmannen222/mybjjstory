'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresInsertPayload } from '@supabase/supabase-js'

export function useRealtimeInserts<T extends Record<string, unknown>>(
  table: string,
  filter?: { column: string; value: string } | null,
  callback?: (payload: T) => void
) {
  useEffect(() => {
    if (!callback) return

    const supabase = createClient()
    const channelName = filter
      ? `${table}-${filter.column}-${filter.value}`
      : `${table}-inserts`

    const channelConfig: {
      event: 'INSERT'
      schema: 'public'
      table: string
      filter?: string
    } = {
      event: 'INSERT',
      schema: 'public',
      table,
    }

    if (filter) {
      channelConfig.filter = `${filter.column}=eq.${filter.value}`
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        channelConfig,
        (payload: RealtimePostgresInsertPayload<T>) => {
          callback(payload.new as T)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, filter?.column, filter?.value, callback]) // eslint-disable-line react-hooks/exhaustive-deps
}
