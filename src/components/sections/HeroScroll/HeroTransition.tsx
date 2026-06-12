'use client'

import type { RefObject } from 'react'
import { cn } from '@/lib/utils/cn'
import type { Product } from '@/types'

interface HeroTransitionProps {
  bagRef: RefObject<HTMLDivElement | null>
  targetRef: RefObject<HTMLDivElement | null>
  /** true cuando la card destino ya tomó el relevo visual (progress ≥ 0.97) */
  settled: boolean
  /** Primer producto del catálogo — se revela en el slot destino al settled */
  product: Product
}

/**
 * Capa cinematográfica del morph funda → card.
 * - bagRef: placeholder tokenizado de la funda kraft. GSAP lo escala y funde.
 * - targetRef: slot destino tamaño-card. Revela datos reales del producto al settled.
 * GSAP (useHeroScrub) es dueño de la opacidad de ambos elementos.
 * El componente es aria-hidden — es puramente decorativo durante el morph.
 */
export default function HeroTransition({ bagRef, targetRef, settled, product }: HeroTransitionProps) {
  const previewSize = product.sizes.find((s) => s.id === product.defaultSizeId) ?? product.sizes[0]

  return (
    <div aria-hidden className="absolute inset-0 z-dropdown pointer-events-none flex items-center justify-center">
      {/* Funda kraft — placeholder tokenizado, GSAP anima opacity + scale */}
      <div
        ref={bagRef}
        className="absolute flex aspect-product w-72 items-end justify-center rounded-lg bg-primary bg-grain-subtle p-6 opacity-0 will-change-transform md:w-96"
      >
        <span className="font-display text-headline-sm text-on-primary">Coffee Relief</span>
      </div>

      {/* Slot destino — preview del primer producto, se revela al settled */}
      <div
        ref={targetRef}
        className="absolute flex aspect-product w-56 flex-col justify-end overflow-hidden rounded-lg opacity-0"
        style={{ backgroundColor: product.placeholderColor }}
      >
        {/* Gradiente de legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />

        <div
          className={cn(
            'relative p-4 transition-opacity duration-300',
            settled ? 'opacity-100' : 'opacity-0',
          )}
        >
          <p className="font-sans text-label-md uppercase text-white/70 mb-1">
            {product.origin}
          </p>
          <p className="font-display text-headline-sm text-white leading-tight">
            {product.name}
          </p>
          <p className="font-sans text-label-md text-white/60 mt-1">
            ${previewSize.price.toFixed(2)} / {previewSize.label}
          </p>
        </div>
      </div>
    </div>
  )
}
