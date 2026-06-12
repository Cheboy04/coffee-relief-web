'use client'

import { cn } from '@/lib/utils/cn'
import type { SizeSelectorProps } from './types'

export default function SizeSelector({ productId, sizes, selectedId, onChange }: SizeSelectorProps) {
  return (
    <fieldset>
      <legend className="sr-only">Elige el tamaño</legend>
      <div className="flex gap-2">
        {sizes.map((size) => {
          const inputId = `${productId}-${size.id}`
          const isSelected = size.id === selectedId
          return (
            <label
              key={size.id}
              htmlFor={inputId}
              className={cn(
                'cursor-pointer rounded-full px-3 py-1',
                'font-sans text-label-md transition-colors duration-150',
                'border',
                isSelected
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-low text-on-surface-variant border-primary/10 hover:border-primary/30',
              )}
            >
              <input
                id={inputId}
                type="radio"
                name={`${productId}-size`}
                value={size.id}
                checked={isSelected}
                onChange={() => onChange(size.id)}
                className="sr-only"
              />
              {size.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
