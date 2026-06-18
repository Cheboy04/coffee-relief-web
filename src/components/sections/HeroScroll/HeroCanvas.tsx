'use client'

import Image from 'next/image'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface HeroCanvasProps {
  frameCount: number
  frameDir: string
  posterSrc: string
}

export interface HeroCanvasHandle {
  drawFrame: (index: number) => void
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) {
  const imgAR = img.naturalWidth / img.naturalHeight
  const canvasAR = canvas.width / canvas.height
  let sx: number, sy: number, sw: number, sh: number
  if (imgAR > canvasAR) {
    sh = img.naturalHeight
    sw = sh * canvasAR
    sx = (img.naturalWidth - sw) / 2
    sy = 0
  } else {
    sw = img.naturalWidth
    sh = sw / canvasAR
    sx = 0
    sy = (img.naturalHeight - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
}

const HeroCanvas = forwardRef<HeroCanvasHandle, HeroCanvasProps>(function HeroCanvas(
  { frameCount, frameDir, posterSrc },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const revealedRef = useRef(false)
  const [posterHidden, setPosterHidden] = useState(false)

  // `pos` es un índice fraccional (0 .. frameCount-1). Se dibuja el frame `floor`
  // y encima el `ceil` con alpha = fracción → cross-dissolve continuo entre frames.
  const draw = useCallback((pos: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const frames = framesRef.current
    const last = frameCount - 1
    const clamped = Math.max(0, Math.min(pos, last))
    const lo = Math.floor(clamped)
    const hi = Math.min(lo + 1, last)
    const frac = clamped - lo

    const loImg = frames[lo]
    if (!loImg?.complete || !loImg.naturalWidth) return
    currentFrameRef.current = clamped

    ctx.globalAlpha = 1
    drawCover(ctx, loImg, canvas)

    const hiImg = frames[hi]
    if (hi !== lo && frac > 0 && hiImg?.complete && hiImg.naturalWidth) {
      ctx.globalAlpha = frac
      drawCover(ctx, hiImg, canvas)
      ctx.globalAlpha = 1
    }

    if (!revealedRef.current) {
      revealedRef.current = true
      setPosterHidden(true)
    }
  }, [frameCount])

  useImperativeHandle(ref, () => ({ drawFrame: draw }), [draw])

  // Preload all frames; draw frame 0 as soon as it's ready.
  useEffect(() => {
    const images: HTMLImageElement[] = []
    framesRef.current = images

    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image()
      img.src = `${frameDir}/frame_${String(i).padStart(6, '0')}.webp`
      if (i === 0) {
        img.onload = () => draw(0)
      }
      images.push(img)
    }

    return () => {
      framesRef.current = []
      revealedRef.current = false
    }
  }, [frameCount, frameDir, draw])

  // Keep canvas dimensions in sync with container; redraw on resize.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      draw(currentFrameRef.current)
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [draw])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-video h-full w-full"
        aria-hidden="true"
      />
      <div aria-hidden className="absolute inset-0 z-video bg-grain-subtle pointer-events-none" />
      <div
        aria-hidden
        className="absolute inset-0 z-video bg-gradient-to-t from-primary/70 via-primary/10 to-primary/40 pointer-events-none"
      />
      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
        className={cn(
          'z-raised object-cover transition-opacity duration-700 ease-out pointer-events-none',
          posterHidden ? 'opacity-0' : 'opacity-100',
        )}
      />
    </>
  )
})

export default HeroCanvas
