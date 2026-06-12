'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import Button from '@/components/ui/Button'
import type { ExperienceCardProps } from './types'

function FlipHintIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

export default function ExperienceCard({ data }: ExperienceCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasFlippedOnce, setHasFlippedOnce] = useState(false)
  const [isTouch] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(hover: none)').matches
  })
  const prefersReducedMotion = useReducedMotion()

  const flip = useCallback(() => setIsFlipped(true), [])
  const unflip = useCallback(() => setIsFlipped(false), [])
  const toggle = useCallback(() => {
    setIsFlipped((f) => !f)
    setHasFlippedOnce(true)
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as Element).closest('a')) return
      if (isTouch) toggle()
    },
    [isTouch, toggle],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    },
    [toggle],
  )

  return (
    <article
      aria-label={data.title}
      tabIndex={0}
      className={cn(
        'h-experience-card-mob md:h-experience-card',
        'card-wrapper relative cursor-pointer rounded-lg',
        'outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        isFlipped
          ? 'focus-visible:ring-white focus-visible:ring-offset-primary'
          : 'focus-visible:ring-primary focus-visible:ring-offset-surface',
      )}
      onMouseEnter={!isTouch ? flip : undefined}
      onMouseLeave={!isTouch ? unflip : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={cn(
          'card-inner',
          !prefersReducedMotion && isFlipped && 'card-inner-flipped',
        )}
      >
        {/* ── Front face ─────────────────────────────────────────────────── */}
        <div
          className={cn('card-face', prefersReducedMotion && isFlipped && 'opacity-0 pointer-events-none')}
          aria-hidden={isFlipped}
        >
          {data.imageSrc ? (
            <Image
              src={data.imageSrc}
              alt={data.imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            />
          ) : (
            <div
              role="img"
              aria-label={data.imageAlt}
              className="absolute inset-0"
              style={{ backgroundColor: data.placeholderColor }}
            />
          )}
          <div className="absolute inset-0 card-front-overlay" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
            <h3 className="font-display text-headline-sm md:text-headline-md text-on-primary mb-4">
              {data.title}
            </h3>
            <Button
              href={data.ctaFront.href}
              variant="ghost-light"
              size="sm"
              className="self-start"
              tabIndex={isFlipped ? -1 : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              {data.ctaFront.label}
            </Button>
          </div>

          {/* Tap hint — touch only, fades out after first flip */}
          {isTouch && (
            <div
              aria-hidden="true"
              className={cn(
                'absolute top-4 right-4 z-raised',
                'flex items-center justify-center w-9 h-9',
                'rounded-full bg-white/20 backdrop-blur-sm',
                'transition-opacity duration-300',
                !prefersReducedMotion && 'animate-hint-pulse',
                hasFlippedOnce && 'opacity-0 pointer-events-none',
              )}
            >
              <FlipHintIcon />
            </div>
          )}
        </div>

        {/* ── Back face ──────────────────────────────────────────────────── */}
        <div
          className={cn(
            'card-face card-back-face bg-primary',
            prefersReducedMotion && !isFlipped && 'opacity-0 pointer-events-none',
            prefersReducedMotion && isFlipped && 'transform-none',
          )}
          aria-hidden={!isFlipped}
        >
          <div className="h-full flex flex-col justify-between p-6 md:p-8">
            <div>
              <p className="font-sans text-label-md uppercase text-on-primary/60">
                {data.eyebrow}
              </p>
              <hr className="border-t border-white/15 mt-3 mb-4" />
              <p className="font-sans text-body-md text-on-primary/90 leading-relaxed">
                {data.summary}
              </p>
            </div>
            <Button
              href={data.ctaBack.href}
              variant="inverse"
              size="sm"
              className="self-start mt-6"
              tabIndex={isFlipped ? undefined : -1}
              onClick={(e) => e.stopPropagation()}
            >
              {data.ctaBack.label}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
