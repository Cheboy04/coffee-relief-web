import type { NavLinkItem, FooterLinkGroup, SocialLink } from '@/components/layout/types'

export const NAV_LINKS: NavLinkItem[] = [
  { label: 'Menú',        href: '/menu' },
  { label: 'Tienda',      href: '/shop' },
  { label: 'Origen',      href: '/about' },
  { label: 'Blog',        href: '/blog' },
  { label: 'Ubicaciones', href: '/locations' },
]

export const NAV_CTA = { label: 'Comprar café', href: '/shop' } as const

const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: 'Explorar',
    links: [
      { label: 'Menú',   href: '/menu' },
      { label: 'Tienda', href: '/shop' },
      { label: 'Blog',   href: '/blog' },
    ],
  },
  {
    title: 'La marca',
    links: [
      { label: 'Origen',          href: '/about' },
      { label: 'Sostenibilidad',  href: '/about#sustainability' },
      { label: 'Premios',         href: '/about#awards' },
      { label: 'Ubicaciones',     href: '/locations' },
    ],
  },
]

const FOOTER_SOCIAL: SocialLink[] = [
  { platform: 'instagram', href: 'https://instagram.com/coffeerelief', label: 'Coffee Relief en Instagram' },
  { platform: 'tiktok',    href: 'https://tiktok.com/@coffeerelief',   label: 'Coffee Relief en TikTok' },
  { platform: 'facebook',  href: 'https://facebook.com/coffeerelief',  label: 'Coffee Relief en Facebook' },
]

const FOOTER_LEGAL: NavLinkItem[] = [
  { label: 'Privacidad',     href: '/privacidad' },
  { label: 'Términos de uso', href: '/terminos' },
]

export const FOOTER_DATA = {
  groups: FOOTER_LINK_GROUPS,
  social: FOOTER_SOCIAL,
  legal:  FOOTER_LEGAL,
} as const
