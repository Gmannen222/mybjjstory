'use client'

import { useState, useRef } from 'react'
import AvatarSVG, { type AvatarConfig, DEFAULT_AVATAR } from './AvatarSVG'

/**
 * PoC 1: CSS 3D Transforms on existing SVG avatar
 * Wraps the SVG with perspective and allows drag-to-rotate
 */
export default function Avatar3D_CSS({ config = DEFAULT_AVATAR, size = 200 }: { config?: AvatarConfig; size?: number }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const [autoRotate, setAutoRotate] = useState(true)

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    setAutoRotate(false)
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    setRotation(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - dy * 0.5)),
      y: prev.y + dx * 0.5,
    }))
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = () => setIsDragging(false)

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        style={{ perspective: 800, width: size, height: size * 1.4 }}
        className="cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            animation: autoRotate ? 'css3d-float 4s ease-in-out infinite' : 'none',
            width: '100%',
            height: '100%',
          }}
          className="flex items-center justify-center"
        >
          {/* Front face */}
          <div style={{ backfaceVisibility: 'hidden' }}>
            <AvatarSVG config={config} size={size} />
          </div>
        </div>
      </div>

      {/* Shadow */}
      <div
        className="rounded-full bg-black/20 blur-md"
        style={{
          width: size * 0.5,
          height: 8,
          transform: `scaleX(${1 + Math.abs(rotation.y) / 100})`,
          opacity: 0.3 + Math.abs(rotation.x) / 100,
        }}
      />

      <style jsx>{`
        @keyframes css3d-float {
          0%, 100% { transform: rotateX(2deg) rotateY(-8deg) translateY(0px); }
          25% { transform: rotateX(-2deg) rotateY(8deg) translateY(-6px); }
          50% { transform: rotateX(2deg) rotateY(15deg) translateY(0px); }
          75% { transform: rotateX(-1deg) rotateY(-5deg) translateY(-4px); }
        }
      `}</style>

      <button
        onClick={() => { setAutoRotate(!autoRotate); setRotation({ x: 0, y: 0 }) }}
        className="text-xs text-muted hover:text-foreground transition-colors"
      >
        {autoRotate ? '⏸ Stopp' : '▶ Auto-roter'} · Dra for å rotere
      </button>
    </div>
  )
}
