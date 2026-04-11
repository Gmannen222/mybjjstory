'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

interface LightboxProps {
  images: string[]
  initialIndex: number
  onClose: () => void
}

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [scale, setScale] = useState(1)
  const touchStartRef = useRef<{ x: number; y: number; distance: number | null }>({
    x: 0,
    y: 0,
    distance: null,
  })
  const containerRef = useRef<HTMLDivElement>(null)

  const total = images.length

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setScale(1)
      setCurrentIndex(index)
      setTimeout(() => setIsTransitioning(false), 200)
    },
    [isTransitioning]
  )

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) goTo(currentIndex + 1)
  }, [currentIndex, total, goTo])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1)
  }, [currentIndex, goTo])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goPrev()
          break
        case 'ArrowRight':
          goNext()
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, goNext, goPrev])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  // Touch handlers for swipe and pinch-to-zoom
  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      distance: e.touches.length >= 2 ? getTouchDistance(e.touches) : null,
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    // Pinch-to-zoom
    if (e.touches.length >= 2 && touchStartRef.current.distance !== null) {
      const currentDistance = getTouchDistance(e.touches)
      const ratio = currentDistance / touchStartRef.current.distance
      setScale(Math.max(1, Math.min(4, ratio)))
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    // If it was a pinch gesture, just reset
    if (touchStartRef.current.distance !== null) {
      touchStartRef.current.distance = null
      // Snap back to 1x if close
      if (scale < 1.2) setScale(1)
      return
    }

    if (e.changedTouches.length === 0) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    // Only count horizontal swipes (not vertical)
    if (absDx > 50 && absDx > absDy) {
      if (dx < 0) {
        goNext()
      } else {
        goPrev()
      }
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click target is the backdrop itself
    if (e.target === containerRef.current) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#0d0d1a' }}
    >
      {/* Backdrop with click-to-close */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(13, 13, 26, 0.95)' }}
        onClick={handleBackdropClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Lukk"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Image counter */}
        {total > 1 && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
            {currentIndex + 1}/{total}
          </div>
        )}

        {/* Previous button */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Forrige bilde"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Next button */}
        {currentIndex < total - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Neste bilde"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* Main image */}
        <div
          className="relative max-w-full max-h-[85vh] transition-transform duration-200 ease-out"
          style={{ transform: `scale(${scale})` }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Bilde ${currentIndex + 1} av ${total}`}
            width={1200}
            height={900}
            className={`max-w-full max-h-[85vh] rounded-lg object-contain transition-opacity duration-200 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            priority
          />
        </div>
      </div>
    </div>
  )
}

export { Lightbox }
