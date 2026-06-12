import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { MENU_CATEGORIES, MENU_ITEMS } from '@/data/menu'
import MenuCategorySection from './MenuCategorySection'

export default function MenuVisual() {
  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="bg-surface-low py-section px-5 md:px-16"
    >
      <div className="mx-auto max-w-content">
        <SectionTitle
          as="h2"
          id="menu-heading"
          eyebrow="La cafetería"
          size="headline-md"
          align="center"
        >
          Nuestro menú
        </SectionTitle>

        <div className="mt-16 flex flex-col gap-16 md:mt-20 md:gap-20">
          {MENU_CATEGORIES.map((category) => (
            <MenuCategorySection
              key={category.id}
              category={category}
              items={MENU_ITEMS.filter((item) => item.categoryId === category.id)}
            />
          ))}
        </div>

        <div className="mt-16 flex justify-center md:mt-20">
          {/* TODO: #reservas — sistema de reservas pendiente de fase futura sin número asignado */}
          <Button href="#reservas" variant="secondary">
            Reservar mesa
          </Button>
        </div>
      </div>
    </section>
  )
}
