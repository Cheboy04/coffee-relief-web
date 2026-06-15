import type { LocationData } from '@/components/sections/Locations/types'

export const LOCATIONS: LocationData[] = [
  {
    id: 'la-whymper',
    name: 'La Whymper',
    address: 'Whymper 269, Quito 170517',
    neighborhood: 'La Whymper · cerca a La Floresta',
    hours: [
      { label: 'Lun–Vie', time: '8:30–20:00' },
      { label: 'Sábado',  time: '9:30–14:00 · 15:00–19:00' },
      { label: 'Domingo', time: '10:00–13:00 · 14:00–19:00' },
    ],
    coords: { lat: -0.1989775, lng: -78.4816834 },
    googleMapsUrl: 'https://maps.google.com/?q=-0.1989775,-78.4816834',
  },
  {
    id: 'tumbaco',
    name: 'Tumbaco',
    address: 'C. Boyacá y Pje. Santa Rosa 4-01, Quito 170902',
    neighborhood: 'La Morita · Tumbaco',
    hours: [
      { label: 'Lun–Vie', time: '8:00–13:00 · 15:00–20:00' },
      { label: 'Sáb–Dom', time: '8:30–13:00 · 15:00–20:00' },
    ],
    coords: { lat: -0.2130695, lng: -78.3909015 },
    googleMapsUrl: 'https://maps.google.com/?q=-0.2130695,-78.3909015',
  },
]
