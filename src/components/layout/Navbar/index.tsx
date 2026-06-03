import Link from 'next/link'
import NavLinks from './NavLinks'
import MobileMenu from './MobileMenu'
import type { NavbarProps } from '../types'

export default function Navbar({ links, ctaLabel, ctaHref }: NavbarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-sticky h-navbar shadow-tonal-sm"
      role="banner"
    >
      <nav
        className="h-full max-w-[1280px] mx-auto px-5 md:px-16 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Coffee Relief — página de inicio"
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
