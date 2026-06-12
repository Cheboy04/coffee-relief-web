import type { Product } from '@/types'

export interface ProductCardProps {
  product: Product
  /** Añadido en la primera card para que HeroTransition pueda referenciarlo */
  isFirst?: boolean
}
