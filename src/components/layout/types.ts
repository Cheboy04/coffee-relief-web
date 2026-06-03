export interface NavLinkItem {
  label: string
  href: string
  isExternal?: boolean
}

export interface NavbarProps {
  links: NavLinkItem[]
  ctaLabel: string
  ctaHref: string
}

export interface NavLinksProps {
  links: NavLinkItem[]
  ctaLabel: string
  ctaHref: string
}

export interface MobileMenuProps {
  links: NavLinkItem[]
  ctaLabel: string
  ctaHref: string
}

export interface FooterLinkGroup {
  title: string
  links: NavLinkItem[]
}

export interface SocialLink {
  platform: 'instagram' | 'tiktok' | 'facebook'
  href: string
  label: string
}

export interface FooterLinksProps {
  group: FooterLinkGroup
}

export interface FooterProps {
  linkGroups: FooterLinkGroup[]
  socialLinks: SocialLink[]
  legalLinks: NavLinkItem[]
}
