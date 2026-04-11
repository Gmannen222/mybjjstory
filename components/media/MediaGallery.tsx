'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Media } from '@/lib/types/database'
import Lightbox from '@/components/ui/Lightbox'

export default function MediaGallery({ media }: { media: Media[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (media.length === 0) return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  function getPublicUrl(path: string, bucket: string) {
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
  }

  function getBucket(m: Media) {
    if (m.session_id) return 'training-media'
    if (m.grading_id) return 'grading-media'
    return 'training-media'
  }

  // Separate images from videos for the lightbox
  const imageMedia = media.filter((m) => m.media_type === 'image')
  const imageUrls = imageMedia.map((m) => getPublicUrl(m.storage_path, getBucket(m)))

  // Map from overall media index to image-only index
  function getImageIndex(overallIndex: number): number {
    const item = media[overallIndex]
    return imageMedia.indexOf(item)
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {media.map((m, i) => {
          const bucket = getBucket(m)
          const url = getPublicUrl(m.storage_path, bucket)

          return (
            <button
              key={m.id}
              onClick={() => setSelectedIndex(i)}
              className="relative aspect-square rounded-lg overflow-hidden bg-surface-hover"
            >
              {m.media_type === 'image' ? (
                <Image
                  src={url}
                  alt={m.caption || ''}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  ▶
                </div>
              )}
            </button>
          )
        })}
      </div>

      {selectedIndex !== null && (() => {
        const m = media[selectedIndex]
        const bucket = getBucket(m)
        const url = getPublicUrl(m.storage_path, bucket)

        // Videos use inline player, images use Lightbox
        if (m.media_type === 'video') {
          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(13, 13, 26, 0.95)' }}
              onClick={() => setSelectedIndex(null)}
            >
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Lukk"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <video
                src={url}
                controls
                className="max-w-full max-h-[85vh] rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              {m.caption && (
                <p className="absolute bottom-6 text-white text-center px-4">{m.caption}</p>
              )}
            </div>
          )
        }

        return (
          <Lightbox
            images={imageUrls}
            initialIndex={getImageIndex(selectedIndex)}
            onClose={() => setSelectedIndex(null)}
          />
        )
      })()}
    </>
  )
}
