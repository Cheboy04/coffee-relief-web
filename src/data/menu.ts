import type { MenuCategory, MenuItem } from '@/components/sections/MenuVisual/types'

export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'cafe',   label: 'Cafés de especialidad', eyebrow: 'La taza'  },
  { id: 'brunch', label: 'Brunch',                eyebrow: 'La mesa'  },
  { id: 'frio',   label: 'Bebidas frías',          eyebrow: 'La pausa' },
]

export const MENU_ITEMS: MenuItem[] = [
  // ── Cafés ─────────────────────────────────────────────────────────────────
  {
    id: 'espresso-largo',
    categoryId: 'cafe',
    name: 'Espresso Largo',
    description: 'Bold Relief · 18 g · 45 ml · extracción directa a 9 bar.',
    price: '$4.50',
    image: undefined,
    // foto: plano cenital, taza blanca sobre losa de piedra, crema dorada
    imageAlt: 'Taza de espresso sobre superficie de piedra volcánica',
    placeholderColor: 'var(--color-primary-container)',
    tag: 'signature',
  },
  {
    id: 'cortado-origen',
    categoryId: 'cafe',
    name: 'Cortado de Origen',
    description: 'Bold Relief con leche entera de Cayambe, ratio 1:1.',
    price: '$5.50',
    image: undefined,
    // foto: primer plano lateral, vaso corto, latte art simple, fondo neutro
    imageAlt: 'Cortado en vaso de vidrio con dibujo en leche',
    placeholderColor: 'var(--color-secondary-container)',
  },
  {
    id: 'filtrado-volcanico',
    categoryId: 'cafe',
    name: 'Filtrado Volcánico',
    description: 'V60 · Tropical Relief · 15 g · 250 ml · 92 °C. Floral y cítrico.',
    price: '$6.50',
    image: undefined,
    // foto: V60 en proceso, gota cayendo, luz ventana, fondo oscuro
    imageAlt: 'V60 con café filtrándose y luz natural lateral',
    placeholderColor: 'var(--color-tertiary-container)',
    tag: 'signature',
  },
  {
    id: 'latte-temporada',
    categoryId: 'cafe',
    name: 'Latte de Temporada',
    description: 'Espresso doble, leche texturizada y jarabe de caña artesanal.',
    price: '$6.00',
    image: undefined,
    // foto: taza grande, latte art, reflejo en jarabe, luz cálida lateral
    imageAlt: 'Latte en taza grande con microespuma y jarabe ámbar',
    placeholderColor: 'var(--color-surface-high)',
  },

  // ── Brunch ────────────────────────────────────────────────────────────────
  {
    id: 'tostada-masa-madre',
    categoryId: 'brunch',
    name: 'Tostada de Masa Madre',
    description: 'Pan de levadura natural, aguacate del Valle del Chota, huevo escalfado.',
    price: '$11.50',
    image: undefined,
    // foto: plano cenital, cerámica artesanal sobre mesa de madera clara, verdes vivos
    imageAlt: 'Tostada de masa madre con aguacate y huevo escalfado en plato de cerámica',
    placeholderColor: 'var(--color-secondary-container)',
    tag: 'vegano',
  },
  {
    id: 'benedictinos-altiplano',
    categoryId: 'brunch',
    name: 'Benedictinos del Altiplano',
    description: 'Muffin casero, jamón serrano, hollandaise de ají amarillo.',
    price: '$13.50',
    image: undefined,
    // foto: 45° lateral, yema rompiendo, salsa dorada, vapor suave
    imageAlt: 'Huevos benedictinos con salsa hollandaise sobre muffin artesanal',
    placeholderColor: 'var(--color-primary-container)',
    tag: 'signature',
  },
  {
    id: 'bowl-andino',
    categoryId: 'brunch',
    name: 'Bowl Andino',
    description: 'Quinoa negra, camote asado, espinaca salteada y yogur de coco.',
    price: '$12.00',
    image: undefined,
    // foto: plano cenital, bowl de cerámica oscura, colores terrosos, hierbas frescas
    imageAlt: 'Bowl con quinoa, camote y vegetales sobre fondo de lino',
    placeholderColor: 'var(--color-surface-high)',
    tag: 'vegano',
  },
  {
    id: 'crepe-guayaba',
    categoryId: 'brunch',
    name: 'Crepe de Guayaba',
    description: 'Masa ligera, guayaba ecuatoriana, queso crema y miel de caña.',
    price: '$9.50',
    image: undefined,
    // foto: lateral, crepe abierto, guayaba rosada, miel brillante, luz suave
    imageAlt: 'Crepe doblado con guayaba y miel de caña en plato blanco',
    placeholderColor: 'var(--color-secondary-container)',
  },

  // ── Bebidas frías ─────────────────────────────────────────────────────────
  {
    id: 'cold-brew',
    categoryId: 'frio',
    name: 'Cold Brew Concentrado',
    description: '20 horas en frío · Tropical Relief · Limpio, brillante, sin acidez.',
    price: '$7.00',
    image: undefined,
    // foto: vaso alto, hielo transparente, cold brew oscuro, fondo claro minimalista
    imageAlt: 'Cold brew en vaso alto con hielo y condensación exterior',
    placeholderColor: 'var(--color-tertiary-container)',
    tag: 'signature',
  },
  {
    id: 'tonica-cafe',
    categoryId: 'frio',
    name: 'Tónica de Café',
    description: 'Cold brew, agua tónica artesanal y ralladura de naranja de Puembo.',
    price: '$8.00',
    image: undefined,
    // foto: cenital, vaso corto, burbujas, naranja fresca, mesa de mármol
    imageAlt: 'Tónica de café con rodaja de naranja y burbujas en vaso bajo',
    placeholderColor: 'var(--color-surface-high)',
  },
  {
    id: 'batido-platano',
    categoryId: 'frio',
    name: 'Batido de Plátano',
    description: 'Immersive Relief, plátano maduro, leche de avena y canela.',
    price: '$8.50',
    image: undefined,
    // foto: vaso con pajita, batido ámbar, canela espolvoreada, fondo cálido neutro
    imageAlt: 'Batido cremoso en vaso con canela espolvoreada encima',
    placeholderColor: 'var(--color-secondary-container)',
    tag: 'vegano',
  },
]
