'use client'

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Shared = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'ghost-light' | 'inverse' | 'link'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  className?: string
  children: ReactNode
}

type AsAnchor = Shared &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Shared> & {
    href: string
  }

type AsButton = Shared &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Shared> & {
    href?: never
  }

export type ButtonProps = AsAnchor | AsButton

const base = [
  'inline-flex items-center justify-center gap-2',
  'rounded font-sans text-label-md uppercase',
  'transition-all duration-200',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
].join(' ')

const variantClasses: Record<NonNullable<Shared['variant']>, string> = {
  primary: 'bg-espresso text-on-primary hover:bg-primary-container active:scale-95',
  secondary: 'border border-primary/20 text-primary hover:bg-surface-low hover:border-primary/40 active:scale-95',
  ghost: 'text-primary hover:bg-surface-low active:scale-95',
  // For use on dark overlay backgrounds (card front)
  'ghost-light': 'border border-white/40 text-on-primary hover:bg-white/10 active:scale-95 focus-visible:outline-white',
  // For use on espresso backgrounds (card back)
  inverse: 'bg-surface text-primary hover:bg-surface-low active:scale-95',
  link: 'text-secondary underline-offset-4 rounded-none hover:underline',
}

const sizeClasses: Record<NonNullable<Shared['size']>, string> = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', loading = false, className, children } = props
  const classes = cn(base, variantClasses[variant], sizeClasses[size], className)

  const content = loading ? (
    <>
      <Spinner />
      <span className="sr-only">{children}</span>
    </>
  ) : (
    children
  )

  if ('href' in props && props.href != null) {
    // Extract shared props (consumed above) so they don't bleed into <a> attributes
    const {
      variant: _v, size: _s, loading: _l, className: _c, children: _ch,
      ...anchorRest
    } = props as AsAnchor
    return (
      <a
        className={classes}
        aria-disabled={loading || undefined}
        {...anchorRest}
      >
        {content}
      </a>
    )
  }

  const { disabled, type = 'button', onClick, onFocus, onBlur } = props as AsButton
  return (
    <button
      type={type}
      className={classes}
      disabled={loading || disabled}
      aria-disabled={loading || disabled || undefined}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {content}
    </button>
  )
}
