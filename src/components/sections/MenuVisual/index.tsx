import { getTranslations } from 'next-intl/server'
import SectionTitle from '@/components/ui/SectionTitle'
import Button from '@/components/ui/Button'
import { MENU_CATEGORIES, MENU_ITEMS } from '@/data/menu'
import MenuCategorySection from './MenuCategorySection'
import type { MenuCategory, MenuItem } from './types'

export default async function MenuVisual() {
  const t = await getTranslations('menu')

  const translatedCategories: MenuCategory[] = MENU_CATEGORIES.map((cat) => ({
    ...cat,
    label:   t(`categories.${cat.id as 'cafe' | 'brunch' | 'frio'}.label`),
    eyebrow: t(`categories.${cat.id as 'cafe' | 'brunch' | 'frio'}.eyebrow`),
  }))

  const translatedItems: MenuItem[] = MENU_ITEMS.map((item) => {
    const key = item.id as MenuItemKey
    return {
      ...item,
      name:        t(`items.${key}.name`),
      description: t(`items.${key}.description`),
      imageAlt:    t(`items.${key}.imageAlt`),
    }
  })

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
          eyebrow={t('eyebrow')}
          size="headline-md"
          align="center"
        >
          {t('heading')}
        </SectionTitle>

        <div className="mt-16 flex flex-col gap-16 md:mt-20 md:gap-20">
          {translatedCategories.map((category) => (
            <MenuCategorySection
              key={category.id}
              category={category}
              items={translatedItems.filter((item) => item.categoryId === category.id)}
            />
          ))}
        </div>

        <div className="mt-16 flex justify-center md:mt-20">
          {/* TODO: #reservas — sistema de reservas pendiente de fase futura sin número asignado */}
          <Button href="#reservas" variant="secondary">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  )
}

type MenuItemKey =
  | 'espresso-largo' | 'cortado-origen' | 'filtrado-volcanico' | 'latte-temporada'
  | 'tostada-masa-madre' | 'benedictinos-altiplano' | 'bowl-andino' | 'crepe-guayaba'
  | 'cold-brew' | 'tonica-cafe' | 'batido-platano'
