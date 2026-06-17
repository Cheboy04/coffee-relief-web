import type { RefObject } from 'react'

export type HoursKey = 'monFri' | 'saturday' | 'sunday' | 'satSun'

export interface LocationHours {
  hoursKey: HoursKey
  time: string
}

export interface LocationData {
  id: string
  name: string
  address: string
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
