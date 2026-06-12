'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import Button from '@/components/ui/Button'
import type { ProductCardProps } from './types'

export default function ProductCard({ product, isFirst = false }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const size = product.sizes[0]

  const handleAdd = useCallback(() => setAdded(true), [])

  useEffect(() => {
    if (!added) return
    const id = setTimeout(() => setAdded(false), 2000)
    return () => clearTimeout(id)
  }, [added])

  return (
    <article
      aria-label={product.name}
      data-product-id={product.id}
      {...(isFirst ? { 'data-hero-target': 'first' } : {})}
      className="flex flex-col rounded-lg overflow-hidden border border-primary/10 bg-surface"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 33vw, 100vw"
          />
        ) : (
          <div
            role="img"
            aria-label={product.imageAlt}
            className="absolute inset-0"
            style={{ backgroundColor: product.placeholderColor }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div>
          <p className="font-sans text-label-md uppercase text-secondary mb-1">
            {product.origin}
          </p>
          <h3 className="font-display text-headline-sm text-on-surface">
            {product.name}
          </h3>
          <p className="font-sans text-label-md text-on-surface-variant mt-1">
            {product.flavorNotes.join(' · ')}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <p className="font-sans text-headline-sm text-on-surface">
            ${size.price.toFixed(2)}
            <span className="font-sans text-label-md text-on-surface-variant ml-2">
              / {size.label}
            </span>
          </p>

          <Button
            variant="primary"
            size="sm"
            className={cn('self-start', added && 'pointer-events-none')}
            aria-label={
              added
                ? `${product.name} agregado`
                : `Agregar ${product.name} al carrito`
            }
            onClick={handleAdd}
          >
            {added ? 'Agregado ✓' : 'Agregar'}
          </Button>
        </div>
      </div>
    </article>
  )
}
