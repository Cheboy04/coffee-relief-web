import type { Product } from '@/types'

export interface ProductCardProps {
  product: Product
  /** Añadido por ProductGrid en la primera card para que HeroTransition pueda referenciarlo */
  isFirst?: boolean
}

export interface SizeSelectorProps {
  productId: string
  sizes: Product['sizes']
  selectedId: string
  onChange: (id: string) => void
}
