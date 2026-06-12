export interface ExperienceCardData {
  id: string
  // Front face
  title: string
  imageAlt: string
  imageSrc?: string          // undefined → placeholder color, string → next/image
  placeholderColor: string   // CSS custom property, e.g. 'var(--color-primary-container)'
  ctaFront: {
    label: string
    href: string
  }
  // Back face
  eyebrow: string
  summary: string
  ctaBack: {
    label: string
    href: string
  }
}

export interface ExperienceCardProps {
  data: ExperienceCardData
}
