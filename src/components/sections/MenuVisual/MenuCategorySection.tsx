import SectionTitle from '@/components/ui/SectionTitle'
import MenuItemCard from './MenuItemCard'
import type { MenuCategory, MenuItem } from './types'

interface MenuCategorySectionProps {
  category: MenuCategory
  items: MenuItem[]
}

export default function MenuCategorySection({ category, items }: MenuCategorySectionProps) {
  // Items that fill complete rows of 3, plus how many are orphaned in the last row
  const orphanCount = items.length % 3
  const mainCount   = items.length - orphanCount
  const mainItems   = items.slice(0, mainCount)
  const orphanItems = items.slice(mainCount)

  return (
    <div>
      <div className="mb-8">
        <SectionTitle as="h3" size="headline-sm" eyebrow={category.eyebrow}>
          {category.label}
        </SectionTitle>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mainItems.map((item, index) => (
          <MenuItemCard key={item.id} item={item} delay={index * 80} />
        ))}

        {/* 1 orphan → center in the middle column at lg */}
        {orphanCount === 1 && (
          <div className="sm:col-span-2 lg:col-span-1 lg:col-start-2">
            <MenuItemCard item={orphanItems[0]} delay={mainCount * 80} />
          </div>
        )}

        {/* 2 orphans → flex row centered across the 3 columns at lg */}
        {orphanCount === 2 && (
          <div className="col-span-1 flex flex-col gap-6 sm:col-span-2 lg:col-span-3 lg:flex-row lg:justify-center">
            {orphanItems.map((item, i) => (
              <div key={item.id} className="lg:w-menu-col">
                <MenuItemCard item={item} delay={(mainCount + i) * 80} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
