import type { OriginBeat } from './types'

export const ORIGIN_BEATS: OriginBeat[] = [
  {
    id: 'origen',
    eyebrow: 'Valle del Chota',
    headline: 'Volcánico por naturaleza',
    body: 'A 2.800 metros sobre el nivel del mar, los suelos de ceniza volcánica del norte ecuatoriano concentran azúcares y acidez en cada cereza. El café no crece aquí a pesar del terreno — crece gracias a él.',
    imageSrc: '/images/origin-volcanic.jpeg',
    imageAlt: 'Finca cafetalera en las laderas volcánicas del norte de Ecuador al amanecer',
    imageLeft: true,
    placeholderBg: 'bg-primary-container',
  },
  {
    id: 'seleccion',
    eyebrow: 'Cosecha manual',
    headline: 'Solo el grano en su punto',
    body: 'Las cerezas se recogen una por una, en el momento exacto de madurez. Un kilogramo de café tostado requiere cinco kilogramos de fruta seleccionada. Esa proporción no es ineficiencia — es criterio.',
    imageSrc: '/images/origin-harvest.jpeg',
    imageAlt: 'Manos de agricultor sosteniendo cerezas de café maduras recién cosechadas',
    imageLeft: false,
    placeholderBg: 'bg-surface-high',
  },
  {
    id: 'tueste',
    eyebrow: 'Quito, Ecuador',
    headline: 'El tueste donde nace',
    body: 'Tostamos en Quito, a menos de 200 km del cultivo. El café no viaja verde hacia otra ciudad para ser transformado: el calor, el tiempo y la decisión ocurren aquí, por las mismas manos que conocen el terreno.',
    imageSrc: '/images/origin-roasting.jpeg',
    imageAlt: 'Tambor tostador artesanal en el taller de Coffee Relief en Quito, con granos en movimiento',
    imageLeft: true,
    placeholderBg: 'bg-secondary-container',
  },
  {
    id: 'comercio',
    eyebrow: 'Sin intermediarios',
    headline: 'Del productor a tu taza',
    body: 'Compramos directamente a las familias cultivadoras a precios por encima del mercado. No porque sea tendencia: porque el café excepcional requiere que quien lo cultiva pueda seguir cultivándolo.',
    imageSrc: '/images/origin-direct.jpeg',
    imageAlt: 'Agricultor ecuatoriano revisando sacos de café verde antes del envío directo',
    imageLeft: false,
    placeholderBg: 'bg-tertiary-container',
  },
]
