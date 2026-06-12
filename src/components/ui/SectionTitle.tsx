import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface SectionTitleProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  id?: string
  size?: 'display' | 'headline-md' | 'headline-sm'
  eyebrow?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  children: ReactNode
}

const sizeClasses: Record<NonNullable<SectionTitleProps['size']>, string> = {
  display: 'text-display-lg-mob md:text-display-lg',
  'headline-md': 'text-headline-md',
  'headline-sm': 'text-headline-sm',
}

const alignClasses: Record<NonNullable<SectionTitleProps['align']>, string> = {
  left: 'items-start',
  center: 'items-center text-center',
  right: 'items-end text-right',
}

export default function SectionTitle({
  as: Tag = 'h2',
  id,
  size = 'headline-md',
  eyebrow,
  align = 'left',
  className,
  children,
}: SectionTitleProps) {
  return (
    <div className={cn('flex flex-col gap-3', alignClasses[align])}>
      {eyebrow && (
        <span className="font-sans text-label-md uppercase text-on-surface-variant">
          {eyebrow}
        </span>
      )}
      <Tag id={id} className={cn('font-display text-on-surface', sizeClasses[size], className)}>
        {children}
      </Tag>
    </div>
  )
}
