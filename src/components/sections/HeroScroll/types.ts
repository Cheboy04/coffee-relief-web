import type { RefObject } from 'react'

/** Anclaje visual de un overlay dentro del viewport del hero. */
export type OverlayPosition = 'center' | 'bottom-left' | 'bottom-center'

/**
 * Modo de ejecución resuelto en cliente tras montar.
 * - 'scrub'  → desktop (≥768px) + motion ok + sin saveData → video scrubbed por scroll (GSAP)
 * - 'loop'   → mobile (<768px) + motion ok + sin saveData → autoplay muted loop, sin scrub
 * - 'static' → reduced-motion | saveData | SSR/no-JS → solo poster, sin reproducción
 */
export type HeroMode = 'scrub' | 'loop' | 'static'

/** CTA — solo lo lleva el tercer overlay. */
export interface OverlayCTA {
  label: string
  href: string
}

/** Un mensaje del journey, con su ventana de scroll (valores 0..1). */
export interface OverlayMessage {
  id: 'cup' | 'beans' | 'bag'
  scrollStart: number // progreso donde empieza a aparecer
  scrollPeak: number // progreso a opacidad 1.0
  scrollEnd: number // progreso donde termina de desaparecer
  headline: string // font-display
  subline: string // font-sans
  position: OverlayPosition
  cta?: OverlayCTA
}

/** Structural data for an overlay — no translatable text, only scroll/position metadata. */
export interface OverlayStructure {
  id: 'cup' | 'beans' | 'bag'
  scrollStart: number
  scrollPeak: number
  scrollEnd: number
  position: OverlayPosition
  cta?: { href: string }
}

/** Props públicas del componente. Todas con default → uso sin props posible. */
export interface HeroScrollProps {
  overlayMessages?: readonly OverlayMessage[]
  ariaLabel?: string
  videoSrc?: string    // default '/video/hero.mp4' — usado en loop/static
  posterSrc?: string   // default '/images/hero/hero-poster.webp'
  frameDir?: string    // default '/frames' — directorio de frames WebP para scrub desktop
  frameCount?: number  // default 81
  /** id del ancla destino al que apunta el CTA y donde aterriza la transición. */
  shopAnchorId?: string // default 'shop'
  className?: string
}

/** Estado observable de la timeline de scrub. */
export interface ScrubController {
  ready: boolean // true cuando video.duration es conocido y la timeline está viva
}

/** Estado de la transición funda → card. */
export interface TransitionState {
  /** true cuando progress ≥ TRANSITION_START (la funda empezó a encoger). */
  active: boolean
  /** true cuando la card destino ya tomó el relevo visual. */
  settled: boolean
}

/** Parámetros del hook de scrub. */
export interface UseHeroScrubParams {
  sectionRef: RefObject<HTMLElement | null>
  videoRef: RefObject<HTMLVideoElement | null>
  overlayRefs: RefObject<Array<HTMLDivElement | null>>
  bagRef: RefObject<HTMLDivElement | null>
  targetRef: RefObject<HTMLDivElement | null>
  messages: readonly OverlayMessage[]
  enabled: boolean
  /** Callback de progreso para que la transición reaccione al final del scroll. */
  onProgress?: (progress: number) => void
  /** Canvas mode: callback que recibe el índice de frame a dibujar (0-based). */
  onFrame?: (index: number) => void
  /** Número total de frames; requerido cuando onFrame está presente. */
  frameCount?: number
}

/** Parámetros del hook de transición. */
export interface UseHeroTransitionParams {
  progress: number
  enabled: boolean
}
