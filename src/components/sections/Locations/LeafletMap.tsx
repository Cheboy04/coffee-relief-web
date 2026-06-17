'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import 'leaflet/dist/leaflet.css'
import { useLeafletMap } from './useLeafletMap'
import type { LeafletMapProps } from './types'

export default function LeafletMap({
  locations,
  activeId,
  onMarkerClick,
}: LeafletMapProps) {
  const t = useTranslations('locations')
  const containerRef = useRef<HTMLDivElement>(null)

  useLeafletMap({ containerRef, locations, activeId, onMarkerClick })

  return (
    <div
      ref={containerRef}
      role="application"
      aria-label={t('mapAriaLabel')}
      className="w-full h-locations-map-mob md:h-locations-map rounded-lg overflow-hidden"
    />
  )
}
