import type { OverlayStructure } from './types'

/**
 * Structural data for the 3 hero narrative beats.
 * Text (headline, subline, cta.label) is now in messages/[locale].json (hero namespace).
 */
export const OVERLAY_STRUCTURE: readonly OverlayStructure[] = [
  {
    id: 'cup',
    scrollStart: 0.0,
    scrollPeak: 0.1,
    scrollEnd: 0.3,
    position: 'center',
  },
  {
    id: 'beans',
    scrollStart: 0.33,
    scrollPeak: 0.48,
    scrollEnd: 0.62,
    position: 'bottom-left',
  },
  {
    id: 'bag',
    scrollStart: 0.66,
    scrollPeak: 0.8,
    scrollEnd: 0.9,
    position: 'center',
    cta: { href: '#shop' },
  },
] as const
