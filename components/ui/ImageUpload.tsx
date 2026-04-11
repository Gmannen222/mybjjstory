'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { compressImage, generateFilename } from '@/lib/image'

interface ImageUploadProps {
  bucket: string
  path: string
  onUpload: (url: string) => void
  maxSizeMB?: number
  accept?: string
  currentImage?: string
  className?: string
}

export default function ImageUpload({
  bucket,
  path,
  onUpload,
  maxSizeMB = 5,
  accept = 'image/*',
  currentImage,
  className = '',
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Kun bildefiler er tillatt.'
    }

    // Check file size before compression
    if (file.size > maxSizeBytes * 3) {
      return `Filen er for stor. Maks ${maxSizeMB * 3} MB før komprimering.`
    }

    return null
  }

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      setUploading(true)

      try {
        // Compress the image
        const compressed = await compressImage(file)

        // Check size after compression
        if (compressed.size > maxSizeBytes) {
          setError(
            `Bildet er for stort etter komprimering (${(compressed.size / 1024 / 1024).toFixed(1)} MB). Maks ${maxSizeMB} MB.`
          )
          setPreview(currentImage || null)
          setUploading(false)
          URL.revokeObjectURL(objectUrl)
          return
        }

        // Generate storage path
        const storagePath = generateFilename(path, file.name)

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(storagePath, compressed, {
            contentType: 'image/jpeg',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload failed:', uploadError)
          setError('Kunne ikke laste opp bildet. Prøv igjen.')
          setPreview(currentImage || null)
          setUploading(false)
          URL.revokeObjectURL(objectUrl)
          return
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storagePath)

        // Clean up object URL
        URL.revokeObjectURL(objectUrl)
        setPreview(urlData.publicUrl)
        onUpload(urlData.publicUrl)
      } catch (err) {
        console.error('Image upload error:', err)
        setError('Noe gikk galt under opplasting. Prøv igjen.')
        setPreview(currentImage || null)
        URL.revokeObjectURL(objectUrl)
      } finally {
        setUploading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bucket, path, maxSizeBytes, maxSizeMB, currentImage, onUpload]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ''
    onUpload('')
  }

  const handleClick = () => {
    fileRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {preview ? (
        /* Image preview with change/remove controls */
        <div className="relative group">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface border border-white/10">
            <Image
              src={preview}
              alt="Forhåndsvisning"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <svg
                    className="animate-spin h-8 w-8 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="text-sm text-white">Laster opp...</span>
                </div>
              </div>
            )}
          </div>
          {!uploading && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleClick}
                className="flex-1 px-3 py-1.5 text-sm bg-surface border border-white/10 rounded-lg text-foreground hover:bg-surface-hover transition-colors"
              >
                Endre bilde
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 text-sm bg-surface border border-danger/30 rounded-lg text-danger hover:bg-danger/10 transition-colors"
              >
                Fjern
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Drop zone */
        <button
          type="button"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          disabled={uploading}
          className={`w-full py-8 rounded-lg border-2 border-dashed transition-colors flex flex-col items-center gap-3 ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-white/20 bg-surface hover:border-white/40 hover:bg-surface-hover'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {uploading ? (
            <svg
              className="animate-spin h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          )}
          <div className="text-center">
            <p className="text-sm text-foreground font-medium">
              {uploading ? 'Laster opp...' : 'Trykk for å velge bilde'}
            </p>
            <p className="text-xs text-muted mt-1">
              {isDragging ? 'Slipp bildet her' : `Eller dra og slipp. Maks ${maxSizeMB} MB.`}
            </p>
          </div>
        </button>
      )}

      {error && <p className="text-danger text-sm mt-2">{error}</p>}
    </div>
  )
}
