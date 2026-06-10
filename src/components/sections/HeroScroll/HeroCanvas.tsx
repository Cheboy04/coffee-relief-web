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

  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current
    const img = framesRef.current[index]
    if (!canvas || !img?.complete || !img.naturalWidth) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    currentFrameRef.current = index
    drawCover(ctx, img, canvas)
    if (!revealedRef.current) {
      revealedRef.current = true
      setPosterHidden(true)
    }
  }, [])

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
