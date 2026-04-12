'use client'

import { useState, useEffect, useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { submitReport } from '@/lib/actions/moderation'
import type { ContentType } from '@/lib/actions/moderation'

const REASONS = ['inappropriate', 'spam', 'harassment', 'other'] as const

export default function ReportButton({
  contentType,
  contentId,
}: {
  contentType: ContentType
  contentId: string
}) {
  const t = useTranslations('moderation.report')
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<string>('')
  const [state, formAction] = useActionState(submitReport, { success: false, error: '' })

  useEffect(() => {
    if (state.success) {
      setTimeout(() => setOpen(false), 1500)
    }
  }, [state.success])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted hover:text-red-400 transition-colors p-1"
        title={t('button')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h2.25a3 3 0 013 3v2.25a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm9.47.47a.75.75 0 011.06 0l2 2a.75.75 0 010 1.06l-2 2a.75.75 0 11-1.06-1.06l.72-.72H9.75a.75.75 0 010-1.5h3.44l-.72-.72a.75.75 0 010-1.06zM3 15.25a3 3 0 013-3h2.25a3 3 0 013 3V17.5a3 3 0 01-3 3H6a3 3 0 01-3-3v-2.25z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setOpen(false)}>
          <div className="bg-surface rounded-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            {state.success ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">✓</div>
                <p className="font-medium">{t('sent')}</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-4">{t('title')}</h3>
                <form action={formAction}>
                  <input type="hidden" name="content_type" value={contentType} />
                  <input type="hidden" name="content_id" value={contentId} />
                  <input type="hidden" name="reason" value={reason} />

                  <div className="space-y-2 mb-4">
                    {REASONS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReason(r)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                          reason === r
                            ? 'bg-red-400/20 text-red-400 border border-red-400/40'
                            : 'bg-background/50 text-muted hover:text-foreground border border-white/5'
                        }`}
                      >
                        {t(`reason_${r}`)}
                      </button>
                    ))}
                  </div>

                  <textarea
                    name="description"
                    placeholder={t('descriptionPlaceholder')}
                    rows={2}
                    className="w-full bg-background/50 border border-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
                  />

                  {!state.success && state.error && (
                    <p className="text-red-400 text-sm mb-3">{state.error}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="flex-1 px-4 py-2 text-sm rounded-lg bg-background/50 text-muted hover:text-foreground transition-colors"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={!reason}
                      className="flex-1 px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {t('submit')}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
