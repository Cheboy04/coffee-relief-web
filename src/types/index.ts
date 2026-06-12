export interface ProductSize {
  id: string        // '250g' | '500g' | '1kg'
  label: string     // '250 g' | '500 g' | '1 kg'
  price: number
}

export interface Product {
  id: string
  slug: string
  name: string
  sku: string
  origin: string
  altitude: string
  process: string
  roastLevel: 'light' | 'medium' | 'medium-dark'
  intensity: 'suave' | 'medio' | 'intenso'
  flavorNotes: string[]
  grindOptions: string[]
  sizes: ProductSize[]
  defaultSizeId: string
  description: { es: string; en: string }
  image: string
  imageAlt: string
  placeholderColor: string
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
