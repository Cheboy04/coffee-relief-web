'use client'

import Image from 'next/image'
import type { RefObject } from 'react'
import { cn } from '@/lib/utils/cn'

interface HeroVideoProps {
  videoRef: RefObject<HTMLVideoElement | null>
  videoSrc: string
  posterSrc: string
  /** Cuando true, el poster se desvanece revelando el video (scrub/loop listos). */
  posterHidden: boolean
  onError: () => void
}

/**
 * Capas (de atrás hacia delante): video → grain → scrim → poster.
 * El poster (next/image, priority) es el LCP; cubre el video hasta que hay frame.
 * El scrim garantiza contraste WCAG AA del texto sobre el video.
 */
export default function HeroVideo({ videoRef, videoSrc, posterSrc, posterHidden, onError }: HeroVideoProps) {
  return (
    <>
      <video
        ref={videoRef}
        className="absolute inset-0 z-video h-full w-full object-cover"
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onError={onError}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div aria-hidden className="absolute inset-0 z-video bg-grain-subtle pointer-events-none" />
      <div
        aria-hidden
        className="absolute inset-0 z-video bg-gradient-to-t from-primary/70 via-primary/10 to-primary/40 pointer-events-none"
      />

      <Image
        src={posterSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden="true"
        className={cn(
          'z-video object-cover transition-opacity duration-700 ease-out',
          posterHidden ? 'opacity-0' : 'opacity-100',
        )}
      />
    </>
  )
}
