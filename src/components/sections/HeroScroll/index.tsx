'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import HeroCanvas, { type HeroCanvasHandle } from './HeroCanvas'
import HeroVideo from './HeroVideo'
import HeroOverlay from './HeroOverlay'
import HeroTransition from './HeroTransition'
import { PRODUCTS } from '@/data/products'
import { useHeroMode } from './useHeroMode'
import { useHeroScrub } from './useHeroScrub'
import { useHeroTransition } from './useHeroTransition'
import type { HeroScrollProps } from './types'

/**
 * HeroScroll — corazón narrativo del home.
 *
 * Modos de render:
 *  - scrub  (desktop + motion): canvas frame-sequence scrubbed por scroll (GSAP)
 *  - loop   (mobile + motion):  video autoplay muted loop
 *  - static (reduced-motion / saveData / SSR): solo poster
 *
 * El color del Navbar se coordina via --navbar-fg-color sin tocar el componente Navbar.
 */
export default function HeroScroll({
  overlayMessages = [],
  ariaLabel,
  videoSrc = '/video/hero.mp4',
  posterSrc = '/images/hero/hero-poster.webp',
  frameDir = '/frames',
  frameCount = 81,
  shopAnchorId = 'shop',
  className,
}: HeroScrollProps) {
  const mode = useHeroMode()

  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HeroCanvasHandle | null>(null)
  const overlayRefs = useRef<Array<HTMLDivElement | null>>([])
  const bagRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  const [progress, setProgress] = useState(0)
  const [posterHidden, setPosterHidden] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  const handleFrame = useCallback((index: number) => {
    canvasRef.current?.drawFrame(index)
  }, [])

  // Loop/static: gestionar reproducción del video.
  useEffect(() => {
    const v = videoRef.current
    if (!v || mode === 'scrub' || videoFailed) return
    if (mode === 'loop') {
      v.loop = true
      v.preload = 'metadata'
      void v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [mode, videoFailed])

  // Loop/static: revelar video ocultando el poster cuando hay primer frame.
  useEffect(() => {
    const v = videoRef.current
    if (!v || mode === 'scrub' || mode === 'static' || videoFailed) {
      setPosterHidden(false)
      return
    }
    const reveal = () => setPosterHidden(true)
    if (v.readyState >= 2) reveal()
    else v.addEventListener('loadeddata', reveal, { once: true })
    return () => v.removeEventListener('loadeddata', reveal)
  }, [mode, videoFailed])

  // Color del Navbar + frosted glass: coordina con hero en viewport (todos los modos).
  // Hero visible   → texto blanco, sin backdrop (clase navbar-scrolled removida)
  // Hero invisible → texto oscuro, frosted glass (clase navbar-scrolled añadida)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const root = document.documentElement
    const reset = () => {
      root.style.setProperty('--navbar-fg-color', 'var(--color-on-surface)')
      root.classList.remove('navbar-scrolled')
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          root.style.setProperty('--navbar-fg-color', '#ffffff')
          root.classList.remove('navbar-scrolled')
        } else {
          root.style.setProperty('--navbar-fg-color', 'var(--color-on-surface)')
          root.classList.add('navbar-scrolled')
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      reset()
    }
  }, [])

  useHeroScrub({
    sectionRef,
    videoRef,
    overlayRefs,
    bagRef,
    targetRef,
    messages: overlayMessages,
    enabled: mode === 'scrub',
    onProgress: setProgress,
    onFrame: handleFrame,
    frameCount,
  })

  const transition = useHeroTransition({ progress, enabled: mode === 'scrub' })

  return (
    <section
      ref={sectionRef}
      className={cn('hero-track relative w-full', className)}
      aria-label={ariaLabel}
    >
      <div className="sticky top-0 h-screen w-full">
        <div className="relative h-full w-full overflow-hidden">
          {mode === 'scrub' ? (
            <HeroCanvas
              ref={canvasRef}
              frameCount={frameCount}
              frameDir={frameDir}
              posterSrc={posterSrc}
            />
          ) : (
            <HeroVideo
              videoRef={videoRef}
              videoSrc={videoSrc}
              posterSrc={posterSrc}
              posterHidden={posterHidden}
              onError={() => setVideoFailed(true)}
            />
          )}
          <HeroOverlay
            overlayRefs={overlayRefs}
            messages={overlayMessages}
            mode={mode}
            shopAnchorId={shopAnchorId}
          />
          {mode === 'scrub' && (
            <HeroTransition
              bagRef={bagRef}
              targetRef={targetRef}
              settled={transition.settled}
              product={PRODUCTS[0]}
            />
          )}
        </div>
      </div>
    </section>
  )
}
