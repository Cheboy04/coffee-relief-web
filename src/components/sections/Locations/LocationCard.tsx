'use client'

import Button from '@/components/ui/Button'
import type { LocationCardProps } from './types'

export default function LocationCard({ location, isActive, onClick }: LocationCardProps) {
  return (
    <article
      aria-labelledby={`location-${location.id}`}
      className={[
        'py-8 pl-6 border-t border-on-primary/15 transition-all duration-200',
        isActive ? 'border-l-2 border-l-secondary pl-5' : 'border-l-2 border-l-transparent',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => onClick(location.id)}
        className="w-full text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary rounded"
        aria-pressed={isActive}
      >
        <p className="text-label-md uppercase text-secondary">
          {location.neighborhood}
        </p>
        <h3
          id={`location-${location.id}`}
          className="font-display text-headline-sm text-on-primary mt-2 group-hover:text-on-primary/80 transition-colors"
        >
          {location.name}
        </h3>
      </button>

      <address className="font-sans text-body-md text-on-primary/70 not-italic mt-3">
        {location.address}
      </address>

      <div className="mt-4 space-y-2">
        <p className="text-label-md uppercase text-secondary">Horarios</p>
        {location.hours.map((h) => (
          <div key={h.label} className="flex gap-3 items-baseline">
            <span className="text-label-md text-secondary/70 w-16 shrink-0">{h.label}</span>
            <span className="text-body-md text-on-primary/70">{h.time}</span>
          </div>
        ))}
      </div>

      <Button
        href={location.googleMapsUrl}
        variant="ghost-light"
        size="sm"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Cómo llegar a ${location.name} (abre Google Maps en nueva pestaña)`}
        className="mt-6"
      >
        Cómo llegar
      </Button>
    </article>
  )
}
