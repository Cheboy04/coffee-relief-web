'use client'

import { useEffect, useRef } from 'react'
import ParallaxImage from './ParallaxImage'
import type { OriginBeat as OriginBeatType } from './types'

type Props = { beat: OriginBeatType }

export default function OriginBeat({ beat }: Props) {
  const beatRef    = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef    = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!beatRef.current || !eyebrowRef.current || !headlineRef.current || !bodyRef.current) return

    let revert: (() => void) | undefined

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const ctx = gsap.context(() => {
        gsap.fromTo(
          [eyebrowRef.current, headlineRef.current, bodyRef.current],
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: beatRef.current,
              start: 'top 80%',
            },
          }
        )
      }, beatRef)

      revert = () => ctx.revert()
    })()

    return () => revert?.()
  }, [])

  const imageEl = (
    <ParallaxImage
      src={beat.imageSrc}
      alt={beat.imageAlt}
      sizes="(min-width: 1280px) 662px, (min-width: 768px) 50vw, 100vw"
      placeholderBg={beat.placeholderBg}
    />
  )

  const textEl = (
    <div className="flex flex-col gap-y-5 max-w-prose md:px-8">
      <p ref={eyebrowRef} className="text-label-md uppercase text-secondary motion-safe:opacity-0">
        {beat.eyebrow}
      </p>
      <h3 ref={headlineRef} className="font-display text-headline-md text-on-surface motion-safe:opacity-0">
        {beat.headline}
      </h3>
      <p ref={bodyRef} className="font-sans text-body-lg text-on-surface-variant motion-safe:opacity-0">
        {beat.body}
      </p>
    </div>
  )

  return (
    <div ref={beatRef} className="py-section px-5 md:px-16">
      <div className="mx-auto max-w-content">
        <div className="flex flex-col gap-y-10 md:grid md:grid-cols-12 md:gap-x-gutter md:items-center">
          {/* Image: always first in DOM so it stacks on top on mobile */}
          <div className={beat.imageLeft
            ? 'md:row-start-1 md:col-start-1 md:col-span-7'
            : 'md:row-start-1 md:col-start-6 md:col-span-7'
          }>
            {imageEl}
          </div>
          {/* Text */}
          <div className={beat.imageLeft
            ? 'md:row-start-1 md:col-start-8 md:col-span-5'
            : 'md:row-start-1 md:col-start-1 md:col-span-5'
          }>
            {textEl}
          </div>
        </div>
      </div>
    </div>
  )
}
