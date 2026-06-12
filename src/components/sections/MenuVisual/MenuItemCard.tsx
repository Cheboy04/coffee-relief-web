import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import type { MenuItem, MenuItemTag } from './types'

interface MenuItemCardProps {
  item: MenuItem
  delay: number
}

const tagClasses: Record<MenuItemTag, string> = {
  signature:   'bg-primary-container text-on-primary-container',
  vegano:      'bg-secondary-container text-on-secondary-container',
  'sin-gluten': 'bg-surface-high text-on-surface-variant',
}

const tagLabels: Record<MenuItemTag, string> = {
  signature:   'Signature',
  vegano:      'Vegano',
  'sin-gluten': 'Sin gluten',
}

export default function MenuItemCard({ item, delay }: MenuItemCardProps) {
  return (
    <article
      className="animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-menu-item overflow-hidden rounded-lg">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.imageAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 564px, (min-width: 768px) calc(50vw - 80px), calc(100vw - 40px)"
          />
        ) : (
          <div
            role="img"
            aria-label={item.imageAlt}
            className="absolute inset-0"
            style={{ backgroundColor: item.placeholderColor }}
          />
        )}

        {item.tag && (
          <span
            className={cn(
              'absolute left-3 top-3 rounded-full px-3 py-1 text-label-md uppercase',
              tagClasses[item.tag]
            )}
          >
            {tagLabels[item.tag]}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="font-display text-headline-sm text-on-surface">{item.name}</p>
        <p className="mt-1 font-sans text-body-md text-on-surface-variant">{item.description}</p>
        <p className="mt-2 text-label-md text-secondary">{item.price}</p>
      </div>
    </article>
  )
}
