'use client'

import type { RefObject } from 'react'
import { cn } from '@/lib/utils/cn'

interface HeroTransitionProps {
  bagRef: RefObject<HTMLDivElement | null>
  targetRef: RefObject<HTMLDivElement | null>
  /** true cuando la card destino ya tomó el relevo visual. */
  settled: boolean
}

/**
 * Capa cinematográfica del morph funda → card.
 * - bag: placeholder tokenizado de la funda (NO imagen). GSAP lo escala/funde.
 * - target: slot destino tamaño-card. En la Fase 7 se reemplaza por <ProductCard>.
 * GSAP es dueño de la opacidad de ambos; `settled` solo revela el rótulo interno.
 */
export default function HeroTransition({ bagRef, targetRef, settled }: HeroTransitionProps) {
  return (
    <div aria-hidden className="absolute inset-0 z-dropdown pointer-events-none flex items-center justify-center">
      {/* Funda (placeholder CSS) */}
      <div
        ref={bagRef}
        className="absolute flex aspect-product w-72 items-end justify-center rounded-lg bg-primary bg-grain-subtle p-6 opacity-0 will-change-transform md:w-96"
      >
        <span className="font-display text-headline-sm text-on-primary">Coffee Relief</span>
      </div>

      {/* Slot destino — PHASE 7: reemplazar por <ProductCard product={featuredProducts[0]} /> */}
      <div
        ref={targetRef}
        className="absolute flex aspect-product w-56 items-center justify-center rounded-lg border border-on-primary/15 bg-surface p-4 opacity-0"
      >
        <span
          className={cn(
            'font-sans text-label-md uppercase text-on-surface-variant transition-opacity duration-300',
            settled ? 'opacity-100' : 'opacity-0',
          )}
        >
          Tienda
        </span>
      </div>
    </div>
  )
}
