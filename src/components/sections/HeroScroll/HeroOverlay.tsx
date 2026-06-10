'use client'

import type { RefObject } from 'react'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import type { HeroMode, OverlayMessage, OverlayPosition } from './types'

interface HeroOverlayProps {
  overlayRefs: RefObject<Array<HTMLDivElement | null>>
  messages: readonly OverlayMessage[]
  mode: HeroMode
  shopAnchorId: string
}

/** Clases de anclaje en modo scrub (cada mensaje posicionado en absoluto). */
const positionClasses: Record<OverlayPosition, string> = {
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center text-center',
  'bottom-left': 'bottom-24 left-5 md:left-16 items-start text-left',
  'bottom-center': 'bottom-24 left-1/2 -translate-x-1/2 items-center text-center',
}

/**
 * Los 3 overlays de texto.
 * - scrub: posicionados en absoluto, opacity-0 (GSAP los anima por scroll).
 * - loop/static: apilados en columna, visibles (degradación SSR/no-JS, mobile).
 */
export default function HeroOverlay({ overlayRefs, messages, mode, shopAnchorId }: HeroOverlayProps) {
  const scrub = mode === 'scrub'

  return (
    <div className={cn('absolute inset-0 z-raised pointer-events-none', !scrub && 'flex items-center justify-center')}>
      <div
        className={cn(
          scrub
            ? 'relative mx-auto h-full w-full max-w-[1280px] px-5 md:px-16'
            : 'flex max-w-prose flex-col items-center gap-10 px-5 text-center',
        )}
      >
        {messages.map((m, i) => (
          <div
            key={m.id}
            ref={(el) => {
              overlayRefs.current[i] = el
            }}
            className={cn(
              'flex max-w-prose flex-col',
              scrub ? cn('absolute opacity-0', positionClasses[m.position]) : 'items-center opacity-100',
            )}
          >
            {i === 0 ? (
              <h1 className="font-display text-display-lg-mob md:text-display-lg text-on-primary">{m.headline}</h1>
            ) : (
              <h2 className="font-display text-headline-md md:text-display-lg-mob text-on-primary">{m.headline}</h2>
            )}
            <p className="font-sans text-body-lg text-on-primary/85 mt-3">{m.subline}</p>
            {m.cta && (
              <div className="pointer-events-auto mt-6">
                <Button variant="primary" size="lg" href={`#${shopAnchorId}`}>
                  {m.cta.label}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
