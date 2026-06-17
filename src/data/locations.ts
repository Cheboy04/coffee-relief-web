import type { LocationData } from '@/components/sections/Locations/types'

export const LOCATIONS: LocationData[] = [
  {
    id: 'la-whymper',
    name: 'La Whymper',
    address: 'Whymper 269, Quito 170517',
    hours: [
      { hoursKey: 'monFri',   time: '8:30–20:00' },
      { hoursKey: 'saturday', time: '9:30–14:00 · 15:00–19:00' },
      { hoursKey: 'sunday',   time: '10:00–13:00 · 14:00–19:00' },
    ],
    coords: { lat: -0.1989775, lng: -78.4816834 },
    googleMapsUrl: 'https://maps.google.com/?q=-0.1989775,-78.4816834',
  },
  {
    id: 'tumbaco',
    name: 'Tumbaco',
    address: 'C. Boyacá y Pje. Santa Rosa 4-01, Quito 170902',
    hours: [
      { hoursKey: 'monFri', time: '8:00–13:00 · 15:00–20:00' },
      { hoursKey: 'satSun', time: '8:30–13:00 · 15:00–20:00' },
    ],
    coords: { lat: -0.2130695, lng: -78.3909015 },
    googleMapsUrl: 'https://maps.google.com/?q=-0.2130695,-78.3909015',
  },
]
