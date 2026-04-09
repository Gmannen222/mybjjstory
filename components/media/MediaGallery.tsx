'use client'

import { useState } from 'react'
import type { Media } from '@/lib/types/database'

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
              className="aspect-square rounded-lg overflow-hidden bg-surface-hover"
            >
              {m.media_type === 'image' ? (
                <img
                  src={url}
                  alt={m.caption || ''}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white text-2xl"
          >
            ✕
          </button>
          {(() => {
            const m = media[selectedIndex]
            const bucket = getBucket(m)
            const url = getPublicUrl(m.storage_path, bucket)

            if (m.media_type === 'video') {
              return (
                <video
                  src={url}
                  controls
                  className="max-w-full max-h-[80vh] rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              )
            }
            return (
              <img
                src={url}
                alt={m.caption || ''}
                className="max-w-full max-h-[80vh] rounded-lg object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )
          })()}
          {media[selectedIndex].caption && (
            <p className="absolute bottom-6 text-white text-center px-4">
              {media[selectedIndex].caption}
            </p>
          )}
        </div>
      )}
    </>
  )
}
