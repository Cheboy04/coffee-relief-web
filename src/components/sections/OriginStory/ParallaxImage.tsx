'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { ParallaxImageProps } from './types'

export default function ParallaxImage({
  src,
  alt,
  parallaxFactor = 0.1,
  priority = false,
  sizes,
  placeholderBg = 'bg-surface-high',
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!containerRef.current || !imageWrapperRef.current) return

    let revert: (() => void) | undefined

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const offset = containerRef.current!.offsetHeight * parallaxFactor

      const ctx = gsap.context(() => {
        gsap.fromTo(
          imageWrapperRef.current,
          { y: -offset },
          {
            y: offset,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        )
      }, containerRef)

      revert = () => ctx.revert()
    })()

    return () => revert?.()
  }, [parallaxFactor])

  return (
    <div
      ref={containerRef}
      className={`relative h-beat-image-mob md:h-beat-image overflow-hidden rounded-lg ${placeholderBg}`}
    >
      <div
        ref={imageWrapperRef}
        className="absolute inset-0 scale-parallax"
        style={{ willChange: 'transform' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      </div>
    </div>
  )
}
