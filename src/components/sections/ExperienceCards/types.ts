export interface ExperienceCardData {
  id: string
  // Front face
  title: string
  imageAlt: string
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
