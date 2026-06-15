'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import LocationCard from './LocationCard'
import type { LocationData } from './types'

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-locations-map-mob md:h-locations-map rounded-lg bg-primary-container animate-pulse"
      aria-hidden="true"
    />
  ),
})

interface LocationsClientProps {
  locations: LocationData[]
}

export default function LocationsClient({ locations }: LocationsClientProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const handleCardClick = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id))
  }, [])

  const handleMarkerClick = useCallback((id: string) => {
    setActiveId(id)
  }, [])

  return (
    <div className="mt-16 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-0 lg:gap-12 items-start">
      {/* Panel de sedes */}
      <div className="order-2 lg:order-1">
        {locations.map((loc) => (
          <LocationCard
            key={loc.id}
            location={loc}
            isActive={activeId === loc.id}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* Mapa */}
      <div className="order-1 lg:order-2 lg:sticky lg:top-24">
        <LeafletMap
          locations={locations}
          activeId={activeId}
          onMarkerClick={handleMarkerClick}
        />
        <noscript>
          <div className="p-6 bg-primary-container rounded-lg mt-4 space-y-4">
            {locations.map((loc) => (
              <address key={loc.id} className="not-italic text-on-primary-container text-body-md">
                <strong className="font-display text-headline-sm block mb-1">{loc.name}</strong>
                {loc.address}<br />
                {loc.hours.map((h) => `${h.label}: ${h.time}`).join(' · ')}
              </address>
            ))}
          </div>
        </noscript>
      </div>
    </div>
  )
}
