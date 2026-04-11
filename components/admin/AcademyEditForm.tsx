'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import type { AcademyData } from './AcademyApproval'

export default function AcademyEditForm({
  academy,
  onClose,
}: {
  academy: AcademyData
  onClose: () => void
}) {
  const t = useTranslations('admin.academies')
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState(academy.name)
  const [city, setCity] = useState(academy.city || '')
  const [region, setRegion] = useState(academy.region || '')
  const [websiteUrl, setWebsiteUrl] = useState(academy.website_url || '')
  const [affiliation, setAffiliation] = useState(academy.affiliation || '')
  const [description, setDescription] = useState(academy.description || '')
  const [headInstructor, setHeadInstructor] = useState(academy.head_instructor || '')

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    setError(null)
    setSuccess(false)

    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('academies')
      .update({
        name: name.trim(),
        city: city.trim() || null,
        region: region.trim() || null,
        website_url: websiteUrl.trim() || null,
        affiliation: affiliation.trim() || null,
        description: description.trim() || null,
        head_instructor: headInstructor.trim() || null,
      })
      .eq('id', academy.id)

    setSaving(false)

    if (updateError) {
      console.error('Academy update failed:', updateError)
      setError(updateError.message)
      return
    }

    setSuccess(true)
    router.refresh()
    setTimeout(() => {
      onClose()
    }, 800)
  }

  const inputClass =
    'w-full rounded-xl bg-[#0d0d1a] border border-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors'

  return (
    <form onSubmit={handleSave} className="mt-4 pt-4 border-t border-white/10">
      <h4 className="text-sm font-semibold mb-3">{t('editTitle')}</h4>

      {error && (
        <div className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-3">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2 mb-3">
          {t('saved')}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted mb-1 block">{t('fieldName')} *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">{t('fieldCity')}</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">{t('fieldRegion')}</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">{t('fieldWebsite')}</label>
          <input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">{t('fieldAffiliation')}</label>
          <input
            type="text"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">{t('fieldHeadInstructor')}</label>
          <input
            type="text"
            value={headInstructor}
            onChange={(e) => setHeadInstructor(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="text-xs text-muted mb-1 block">{t('fieldDescription')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClass + ' resize-none'}
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="px-4 py-2 text-sm rounded-xl bg-primary text-black font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? t('saving') : t('save')}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-4 py-2 text-sm rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          {t('cancel')}
        </button>
      </div>
    </form>
  )
}
