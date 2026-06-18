'use client'

import { useEffect, useState } from 'react'
import type { ScrubController, UseHeroScrubParams } from './types'

/**
 * Construye la timeline maestra GSAP que sincroniza el scroll con:
 *  - frame index del canvas (modo canvas, onFrame callback)
 *  - opacidad/desplazamiento de los 3 overlays
 *  - el morph de la funda → card destino (progress 0.88 → 1.0)
 *
 * GSAP + ScrollTrigger se importan dinámicamente dentro del efecto.
 * En canvas mode (onFrame provided) la timeline se construye inmediatamente.
 * En video mode (legacy) espera a loadedmetadata. Cleanup vía gsap.context().revert().
 */
export function useHeroScrub(params: UseHeroScrubParams): ScrubController {
  const { sectionRef, videoRef, overlayRefs, bagRef, targetRef, messages, enabled, onProgress, onFrame, frameCount } =
    params

  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const section = sectionRef.current
    if (!section) return

    const video = videoRef.current
    // Canvas mode uses onFrame; video mode requires the video element.
    if (!onFrame && !video) return

    let mounted = true
    let revert: (() => void) | undefined
    let detachMeta: (() => void) | undefined

    const build = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (!mounted) return
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              onProgress?.(self.progress)
              if (onFrame && frameCount != null) {
                // Índice fraccional → HeroCanvas mezcla floor/ceil (blending).
                onFrame(self.progress * (frameCount - 1))
              }
            },
          },
        })

        // Video scrub — only in legacy video mode.
        if (!onFrame && video) {
          tl.to(video, { currentTime: video.duration || 0, duration: 1 }, 0)
        }

        // ── Overlays: fade-in hasta peak, fade-out hasta end ───────────────────
        messages.forEach((m, i) => {
          const el = overlayRefs.current?.[i]
          if (!el) return
          tl.fromTo(
            el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, ease: 'power2.out', duration: Math.max(0.001, m.scrollPeak - m.scrollStart) },
            m.scrollStart,
          )
          tl.to(
            el,
            { opacity: 0, y: -24, ease: 'power2.in', duration: Math.max(0.001, m.scrollEnd - m.scrollPeak) },
            m.scrollPeak,
          )
        })

        // ── Morph funda → card (0.88 → 1.0) ────────────────────────────────────
        const bag = bagRef.current
        const target = targetRef.current
        if (bag && target) {
          tl.to(bag, { opacity: 1, duration: 0.02 }, 0.88)
          tl.fromTo(bag, { scale: 1 }, { scale: 0.5, ease: 'power2.inOut', duration: 0.08 }, 0.9)
          tl.to(video ?? bag, { opacity: 0, duration: 0.04 }, 0.92)
          tl.fromTo(target, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.95)
          tl.to(bag, { opacity: 0, duration: 0.02 }, 0.98)
        }
      }, section)

      revert = () => ctx.revert()
      setReady(true)
      ScrollTrigger.refresh()
    }

    if (onFrame) {
      // Canvas mode: no video metadata needed, build immediately.
      void build()
    } else if (video) {
      if (video.readyState >= 1 /* HAVE_METADATA */) {
        void build()
      } else {
        const onMeta = () => void build()
        video.addEventListener('loadedmetadata', onMeta, { once: true })
        detachMeta = () => video.removeEventListener('loadedmetadata', onMeta)
      }
    }

    return () => {
      mounted = false
      detachMeta?.()
      revert?.()
      setReady(false)
    }
  }, [enabled, sectionRef, videoRef, overlayRefs, bagRef, targetRef, messages, onProgress, onFrame, frameCount])

  return { ready }
}
