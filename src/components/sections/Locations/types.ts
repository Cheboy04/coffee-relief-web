import type { RefObject } from 'react'

export interface LocationHours {
  label: string  // "Lun–Vie" | "Sábado" | "Sáb–Dom" …
  time: string   // "8:30–20:00" | "8:00–13:00 · 15:00–20:00"
}

export interface LocationData {
  id: string
  name: string
  address: string
  neighborhood: string
  hours: LocationHours[]
  coords: {
    lat: number
    lng: number
  }
  googleMapsUrl: string
}

export interface LeafletMapProps {
  locations: LocationData[]
  activeId: string | null
  onMarkerClick: (id: string) => void
}

export interface LocationCardProps {
  location: LocationData
  isActive: boolean
  onClick: (id: string) => void
}

export interface UseLeafletMapReturn {
  flyTo: (id: string) => void
}

export interface UseLeafletMapArgs {
  containerRef: RefObject<HTMLDivElement | null>
  locations: LocationData[]
  activeId: string | null
  onMarkerClick: (id: string) => void
}
