export interface ProductSize {
  label: string
  weight: string
  price: number
}

export interface Product {
  id: string
  slug: string
  name: string
  origin: string
  altitude: string
  process: string
  roastLevel: 'light' | 'medium' | 'medium-dark'
  flavorNotes: string[]
  grindOptions: string[]
  sizes: ProductSize[]
  description: { es: string; en: string }
  image: string
  featured: boolean
}

export interface Review {
  id: string
  author: string
  rating: number
  text: { es: string; en: string }
  source: 'google' | 'instagram' | 'tripadvisor'
  date: string
  isInternational: boolean
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  coordinates: { lat: number; lng: number }
  hours: Record<string, string>
  phone: string
  amenities: string[]
}

export interface Award {
  id: string
  name: string
  organization: string
  year: number
  category: string
  logo: string
}
