import ProductCard from './ProductCard'
import type { ProductGridProps } from './types'

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} isFirst={index === 0} />
      ))}
    </div>
  )
}
