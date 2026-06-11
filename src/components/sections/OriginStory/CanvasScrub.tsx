'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrameLoader } from './useFrameLoader'
import { useCanvasScrub } from './useCanvasScrub'
import type { CanvasScrubProps } from './types'

export default function CanvasScrub({
  framesDir,
  frameCount,
  placeholderColor,
  alt,
  scrollTrackId,
}: CanvasScrubProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadEnabled, setLoadEnabled] = useState(false)

  // Trigger frame loading when beat is 600px from viewport
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoadEnabled(true)
          io.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(canvas)
    return () => io.disconnect()
  }, [])

  const frames = useFrameLoader(framesDir, frameCount, loadEnabled)

  useCanvasScrub(canvasRef, frames, {
    frameCount,
    scrollTrackId,
    placeholderColor,
  })

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // alt is passed for future use (e.g. open-graph image generation)
      data-alt={alt}
      className="w-full h-full block"
    />
  )
}
