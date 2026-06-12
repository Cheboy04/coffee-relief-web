import type { ExperienceCardData } from '@/components/sections/ExperienceCards/types'

export const EXPERIENCE_CARDS: ExperienceCardData[] = [
  {
    id: 'cafeteria',
    title: 'La Cafetería',
    // Imagen real: plano medio de la barra de espresso con luz natural lateral,
    // estantes con sacos de café en arpillera al fondo. Temperatura cálida,
    // sin personas en foco. Ratio portrait (3:4 o 3:5).
    imageAlt: 'Barra de espresso en la cafetería Coffee Relief, Quito',
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
    // Imagen real: close-up de funda kraft cerrada con etiqueta Coffee Relief sobre
    // superficie de madera oscura, granos de café esparcidos alrededor. Luz cenital
    // suave, fondo neutro cream. Ratio portrait.
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
    // Imagen real: manos sosteniendo tazas de cupping sobre mesa de madera clara,
    // fichas de cata visibles. Composición cenital. Luz natural difusa, temperatura
    // neutra-cálida. Ratio portrait.
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
    // Imagen real: mesa completa de brunch con luz de ventana, cerámica artesanal local,
    // flores secas, pan de masa madre y café en chemex. Composición editorial en 3/4,
    // estética slow-food. Temperatura cálida. Ratio portrait.
    imageAlt: 'Mesa de brunch Coffee Relief con cerámica artesanal y café de especialidad',
    placeholderColor: 'var(--color-surface-high)',
    ctaFront: { label: 'Ver menú', href: '#menu' },
    eyebrow: 'Menú · Sábados y domingos',
    summary:
      'Cocina de temporada con ingredientes locales, presentación editorial y el café exacto para cada momento de la mañana. Un brunch diseñado para que el tiempo no importe.',
    ctaBack: { label: 'Reservar mesa', href: '#menu' },
  },
]
