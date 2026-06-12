import type { ExperienceCardData } from '@/components/sections/ExperienceCards/types'

export const EXPERIENCE_CARDS: ExperienceCardData[] = [
  {
    id: 'cafeteria',
    title: 'La Cafetería',
    imageAlt: 'Barra de espresso en la cafetería Coffee Relief, Quito',
    imageSrc: '/images/experience/cafeteria.webp',
    placeholderColor: 'var(--color-primary-container)',
    ctaFront: { label: 'Visítanos', href: '#locations' },
    eyebrow: 'Cafetería · Quito',
    summary:
      'Un espacio donde el espresso toma forma. Barismo de precisión, ambiente íntimo y granos de origen único. Ven a descubrir por qué cada taza es una experiencia irrepetible.',
    ctaBack: { label: 'Ver ubicación', href: '#locations' },
  },
  {
    id: 'tienda',
    title: 'Café Online',
    imageSrc: '/images/experience/tienda.webp',
    imageAlt: 'Funda kraft de café Coffee Relief sobre mesa de madera',
    placeholderColor: 'var(--color-secondary-container)',
    ctaFront: { label: 'Comprar ahora', href: '#shop' },
    eyebrow: 'Tienda · Envío nacional',
    summary:
      'Lotes pequeños de café volcánico ecuatoriano, tostados a la semana y enviados directo a tu puerta. Perfil claro, medio o intenso — tú eliges la intensidad del viaje.',
    ctaBack: { label: 'Ver tienda', href: '#shop' },
  },
  {
    id: 'tasting',
    title: 'Tasting',
    imageSrc: '/images/experience/tasting.webp',
    imageAlt: 'Sesión de cupping con tazas de cata y fichas de evaluación sensorial',
    placeholderColor: 'var(--color-tertiary-container)',
    ctaFront: { label: 'Reservar sesión', href: '#experiencias' },
    eyebrow: 'Experiencias · Cupping',
    summary:
      'Sesiones guiadas por nuestro Q-Grader: aprende a identificar notas de sabor, orígenes y procesos de fermentación. El café de especialidad explicado desde la taza.',
    ctaBack: { label: 'Ver experiencias', href: '#experiencias' },
  },
  {
    id: 'brunch',
    title: 'Brunch',
    imageSrc: '/images/experience/brunch.webp',
    imageAlt: 'Mesa de brunch Coffee Relief con cerámica artesanal y café de especialidad',
    placeholderColor: 'var(--color-surface-high)',
    ctaFront: { label: 'Ver menú', href: '#menu' },
    eyebrow: 'Menú · Sábados y domingos',
    summary:
      'Cocina de temporada con ingredientes locales, presentación editorial y el café exacto para cada momento de la mañana. Un brunch diseñado para que el tiempo no importe.',
    ctaBack: { label: 'Reservar mesa', href: '#menu' },
  },
]
