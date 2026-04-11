/**
 * Client-side image compression and utility functions.
 * Uses the Canvas API for resizing and JPEG compression.
 */

/**
 * Compress an image file by resizing (if needed) and re-encoding as JPEG.
 * Uses createImageBitmap which handles EXIF orientation automatically.
 *
 * @param file - Original image File
 * @param maxWidth - Maximum width in pixels (default 1920)
 * @param quality - JPEG quality 0-1 (default 0.8)
 * @returns Compressed Blob, or the original file if compression made it larger
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<Blob> {
  // Only compress raster image types
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file
  }

  const bitmap = await createImageBitmap(file)

  let targetWidth = bitmap.width
  let targetHeight = bitmap.height

  if (targetWidth > maxWidth) {
    const ratio = maxWidth / targetWidth
    targetWidth = maxWidth
    targetHeight = Math.round(targetHeight * ratio)
  }

  const canvas = new OffscreenCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return file
  }

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)
  bitmap.close()

  const compressed = await canvas.convertToBlob({
    type: 'image/jpeg',
    quality,
  })

  // If compression made the file larger, return the original
  if (compressed.size >= file.size) {
    return file
  }

  return compressed
}

/**
 * Generate a storage-safe filename with user ID prefix.
 * Pattern: {userId}/{timestamp}_{sanitizedName}
 *
 * @param userId - Supabase user ID
 * @param originalName - Original filename from the File object
 * @returns Storage path string
 */
export function generateFilename(userId: string, originalName: string): string {
  const timestamp = Date.now()

  // Remove path separators, keep only the filename
  const baseName = originalName.split(/[\\/]/).pop() || 'image'

  // Sanitize: lowercase, replace spaces and special chars with underscores
  const sanitized = baseName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_')
    .replace(/_+/g, '_')

  return `${userId}/${timestamp}_${sanitized}`
}
