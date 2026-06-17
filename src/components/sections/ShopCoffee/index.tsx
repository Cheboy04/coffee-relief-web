import { getTranslations } from 'next-intl/server'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { PRODUCTS } from '@/data/products'
import ProductGrid from './ProductGrid'
import CoffeeQuiz from './CoffeeQuiz'

type ProductKey = 'bold' | 'tropical' | 'immersive'

export default async function ShopCoffee() {
  const t = await getTranslations('shop')

  const translatedProducts = PRODUCTS.map((p) => ({
    ...p,
    imageAlt:    t(`products.${p.id as ProductKey}.imageAlt`),
    flavorNotes: t.raw(`products.${p.id as ProductKey}.flavorNotes`) as string[],
  }))

  return (
    <section
      id="shop"
      aria-labelledby="shop-heading"
      className="bg-surface py-section px-5 md:px-16"
    >
      <div className="mx-auto max-w-content">
        <SectionTitle
          id="shop-heading"
          eyebrow={t('eyebrow')}
          size="headline-md"
        >
          {t('heading')}
        </SectionTitle>

        <div className="mt-12 mb-12">
          <CoffeeQuiz />
        </div>

        <ProductGrid products={translatedProducts} />

        <div className="mt-10 flex justify-center">
          {/* TODO: /tienda — catálogo completo pendiente de fase futura sin número asignado */}
          <Button href="/tienda" variant="secondary">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
