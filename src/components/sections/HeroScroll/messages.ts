import type { OverlayMessage } from './types'

/**
 * Los 3 beats narrativos del journey, con sus ventanas de scroll (0..1).
 * msg1 'cup'   → <h1> de la página (SEO).
 * msg3 'bag'   → único con CTA hacia la tienda.
 */
export const OVERLAY_MESSAGES: readonly OverlayMessage[] = [
  {
    id: 'cup',
    scrollStart: 0.0,
    scrollPeak: 0.1,
    scrollEnd: 0.3,
    headline: 'Del origen ecuatoriano',
    subline: 'Tostado en las laderas del volcán',
    position: 'center',
  },
  {
    id: 'beans',
    scrollStart: 0.33,
    scrollPeak: 0.48,
    scrollEnd: 0.62,
    headline: 'Al grano perfecto',
    subline: 'Comercio directo · tueste de especialidad',
    position: 'bottom-left',
  },
  {
    id: 'bag',
    scrollStart: 0.66,
    scrollPeak: 0.8,
    scrollEnd: 0.9,
    headline: 'Coffee Relief',
    subline: 'Llévate el origen a casa',
    position: 'center',
    cta: { label: 'Comprar café', href: '#shop' },
  },
] as const
