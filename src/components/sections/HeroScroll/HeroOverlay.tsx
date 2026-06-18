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
 * Overlays de texto del hero.
 * - scrub (desktop): los 3 beats posicionados en absoluto, opacity-0 (GSAP los anima por scroll).
 * - loop/static (mobile/no-JS): un solo mensaje de hero (h1 + subline del primer beat + CTA),
 *   porque una narrativa de 3 actos sin scroll no tiene sentido apilada.
 */
export default function HeroOverlay({ overlayRefs, messages, mode, shopAnchorId }: HeroOverlayProps) {
  const scrub = mode === 'scrub'

  // loop/static: un único mensaje — h1/subline del primer beat + el CTA del beat que lo lleva.
  if (!scrub) {
    const lead = messages[0]
    const ctaMessage = messages.find((m) => m.cta)
    if (!lead) return null

    return (
      <div className="absolute inset-0 z-raised pointer-events-none flex items-center justify-center">
        <div className="flex max-w-prose flex-col items-center gap-6 px-5 text-center">
          <h1 className="font-display text-display-lg-mob md:text-display-lg text-on-primary">{lead.headline}</h1>
          <p className="font-sans text-body-lg text-on-primary/85">{lead.subline}</p>
          {ctaMessage?.cta && (
            <div className="pointer-events-auto mt-2">
              <Button variant="primary" size="lg" href={`#${shopAnchorId}`}>
                {ctaMessage.cta.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // scrub (desktop): los 3 beats animados por GSAP.
  return (
    <div className="absolute inset-0 z-raised pointer-events-none">
      <div className="relative mx-auto h-full w-full max-w-content px-5 md:px-16">
        {messages.map((m, i) => (
          <div
            key={m.id}
            ref={(el) => {
              overlayRefs.current[i] = el
            }}
            className={cn('flex max-w-prose flex-col absolute opacity-0', positionClasses[m.position])}
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
