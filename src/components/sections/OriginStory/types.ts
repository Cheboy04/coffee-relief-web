export type OriginBeat = {
  id: string
  eyebrow: string
  headline: string
  body: string
  imageSrc: string
  imageAlt: string
  imageLeft: boolean
  placeholderBg: string
}

export type ParallaxImageProps = {
  src: string
  alt: string
  parallaxFactor?: number
  priority?: boolean
  sizes: string
  placeholderBg?: string
}
