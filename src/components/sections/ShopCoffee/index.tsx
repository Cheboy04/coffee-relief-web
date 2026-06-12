import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { PRODUCTS } from '@/data/products'
import ProductGrid from './ProductGrid'
import CoffeeQuiz from './CoffeeQuiz'

export default function ShopCoffee() {
  return (
    <section
      id="shop"
      aria-labelledby="shop-heading"
      className="bg-surface py-section px-5 md:px-16"
    >
      <div className="mx-auto max-w-content">
        <SectionTitle
          id="shop-heading"
          eyebrow="Tienda"
          size="headline-md"
        >
          Nuestro café
        </SectionTitle>

        <div className="mt-12 mb-12">
          <CoffeeQuiz />
        </div>

        <ProductGrid products={PRODUCTS} />

        <div className="mt-10 flex justify-center">
          {/* TODO: /tienda — catálogo completo pendiente de fase futura sin número asignado */}
          <Button href="/tienda" variant="secondary">
            Ver catálogo completo
          </Button>
        </div>
      </div>
    </section>
  )
}
