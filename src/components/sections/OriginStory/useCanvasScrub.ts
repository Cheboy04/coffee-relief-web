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

// Returns the frame at idx if loaded, else the nearest loaded frame below it, else null.
function pickLoaded(
  frames: HTMLImageElement[],
  idx: number,
): HTMLImageElement | null {
  for (let i = idx; i >= 0; i--) {
    const f = frames[i]
    if (f?.complete && f.naturalWidth > 0) return f
  }
  return null
}

// Static draw (reduced-motion / first paint): best available frame at index, else placeholder.
function drawBestFrame(
  ctx: CanvasRenderingContext2D,
  frames: HTMLImageElement[],
  frameIndex: number,
  cw: number,
  ch: number,
  placeholderColor: string,
) {
  const f = pickLoaded(frames, frameIndex)
  if (f) {
    ctx.globalAlpha = 1
    drawCover(ctx, f, cw, ch)
    return
  }
  ctx.fillStyle = placeholderColor
  ctx.fillRect(0, 0, cw, ch)
}

// Blended draw: `pos` is a fractional frame index (0 .. frameCount-1).
// Draws floor frame at alpha 1, then ceil frame at alpha = fraction → cross-dissolve.
function drawFrameBlended(
  ctx: CanvasRenderingContext2D,
  frames: HTMLImageElement[],
  pos: number,
  frameCount: number,
  cw: number,
  ch: number,
  placeholderColor: string,
) {
  const last = frameCount - 1
  const clamped = Math.max(0, Math.min(pos, last))
  const lo = Math.floor(clamped)
  const hi = Math.min(lo + 1, last)
  const frac = clamped - lo

  const base = pickLoaded(frames, lo)
  if (!base) {
    ctx.fillStyle = placeholderColor
    ctx.fillRect(0, 0, cw, ch)
    return
  }
  ctx.globalAlpha = 1
  drawCover(ctx, base, cw, ch)

  const next = frames[hi]
  if (hi !== lo && frac > 0 && next?.complete && next.naturalWidth > 0) {
    ctx.globalAlpha = frac
    drawCover(ctx, next, cw, ch)
    ctx.globalAlpha = 1
  }
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
    if (reducedMotion) {
      // Reduced-motion: middle frame, static (progressRef never advances)
      drawBestFrame(ctx, framesRef.current, Math.floor(frameCount / 2), canvas.width, canvas.height, placeholderColor)
    } else {
      drawFrameBlended(
        ctx,
        framesRef.current,
        progressRef.current * (frameCount - 1),
        frameCount,
        canvas.width,
        canvas.height,
        placeholderColor,
      )
    }
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
      drawFrameBlended(
        ctx,
        framesRef.current,
        progressRef.current * (frameCount - 1),
        frameCount,
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
          scrub: 0.5,
          onUpdate: (self) => {
            progressRef.current = self.progress
            const canvas = canvasRef.current
            const context = canvas?.getContext('2d')
            if (!canvas || !context) return
            drawFrameBlended(
              context,
              framesRef.current,
              self.progress * (frameCount - 1),
              frameCount,
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
