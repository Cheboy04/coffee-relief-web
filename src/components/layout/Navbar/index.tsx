import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import NavLinks from './NavLinks'
import MobileMenu from './MobileMenu'

export default async function Navbar() {
  const t = await getTranslations('nav')

  const links = [
    { label: t('menu'),      href: '#menu' },
    { label: t('shop'),      href: '/shop' },
    { label: t('origin'),    href: '/about' },
    { label: t('blog'),      href: '/blog' },
    { label: t('locations'), href: '#locations' },
  ]

  const ctaLabel = t('cta')
  const ctaHref = '/shop'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-sticky h-navbar shadow-tonal-sm"
      role="banner"
    >
      <nav
        className="h-full max-w-[1280px] mx-auto px-5 md:px-16 flex items-center justify-between"
        aria-label={t('mobileMenuLabel')}
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label={t('home')}
          className="font-display text-headline-sm text-navbar-fg hover:opacity-70 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Coffee Relief
        </Link>

        {/* Desktop navigation */}
        <NavLinks links={links} ctaLabel={ctaLabel} ctaHref={ctaHref} />

        {/* Mobile navigation (hamburger + drawer) */}
        <MobileMenu links={links} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      </nav>
    </header>
  )
}
