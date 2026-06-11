'use client'

import { useEffect, useRef, type RefObject } from 'react'

interface UseCanvasScrubConfig {
  frameCount: number
  scrollTrackId: string
  placeholderColor: string
}

// object-fit: cover equivalent for canvas drawImage
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
  const x = (cw - img.naturalWidth * scale) / 2
  const y = (ch - img.naturalHeight * scale) / 2
  ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale)
}

function drawBestFrame(
  ctx: CanvasRenderingContext2D,
  frames: HTMLImageElement[],
  frameIndex: number,
  cw: number,
  ch: number,
  placeholderColor: string,
) {
  const frame = frames[frameIndex]
  if (frame?.complete && frame.naturalWidth > 0) {
    drawCover(ctx, frame, cw, ch)
    return
  }
  // fall back to the last successfully loaded frame
  for (let i = frameIndex - 1; i >= 0; i--) {
    const f = frames[i]
    if (f?.complete && f.naturalWidth > 0) {
      drawCover(ctx, f, cw, ch)
      return
    }
  }
  // no frames loaded yet — show placeholder
  ctx.fillStyle = placeholderColor
  ctx.fillRect(0, 0, cw, ch)
}

export function useCanvasScrub(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  frames: HTMLImageElement[],
  config: UseCanvasScrubConfig,
): void {
  const { frameCount, scrollTrackId, placeholderColor } = config

  // Refs that stay in sync without triggering ScrollTrigger re-registration
  const framesRef = useRef(frames)
  const progressRef = useRef(0)

  // Sync framesRef after render (not during — React 19 rule)
  useEffect(() => {
    framesRef.current = frames
  }, [frames])

  // Draw placeholder on mount
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.fillStyle = placeholderColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [canvasRef, placeholderColor])

  // Redraw when frames arrive (handles user already scrolled into beat)
  useEffect(() => {
    if (!frames.length) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // In reduced-motion mode show the middle frame, not frame 0 (progressRef never advances)
    const fi = reducedMotion
      ? Math.floor(frameCount / 2)
      : Math.min(Math.floor(progressRef.current * frameCount), frameCount - 1)
    drawBestFrame(ctx, framesRef.current, fi, canvas.width, canvas.height, placeholderColor)
  }, [frames, frameCount, placeholderColor, canvasRef])

  // Canvas ResizeObserver — keeps internal resolution in sync with CSS size
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      canvas.width = Math.round(width)
      canvas.height = Math.round(height)
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      drawBestFrame(
        ctx,
        framesRef.current,
        Math.min(Math.floor(progressRef.current * frameCount), frameCount - 1),
        canvas.width,
        canvas.height,
        placeholderColor,
      )
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [canvasRef, frameCount, placeholderColor])

  // ScrollTrigger — registered once, reads frames via framesRef
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show middle frame for reduced-motion
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        drawBestFrame(
          ctx,
          framesRef.current,
          Math.floor(frameCount / 2),
          canvas.width,
          canvas.height,
          placeholderColor,
        )
      }
      return
    }

    let revert: (() => void) | undefined
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const scrollTrack = document.getElementById(scrollTrackId)
      if (!scrollTrack) return

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: scrollTrack,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            progressRef.current = self.progress
            const canvas = canvasRef.current
            const context = canvas?.getContext('2d')
            if (!canvas || !context) return
            const fi = Math.min(
              Math.floor(self.progress * frameCount),
              frameCount - 1,
            )
            drawBestFrame(
              context,
              framesRef.current,
              fi,
              canvas.width,
              canvas.height,
              placeholderColor,
            )
          },
        })
      })

      revert = () => ctx.revert()
    })()

    return () => revert?.()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally empty — framesRef/progressRef stay in sync via assignment above
}
