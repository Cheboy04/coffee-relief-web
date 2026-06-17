import { Link } from '@/i18n/navigation'
import Button from '@/components/ui/Button'
import LanguageSwitcher from '../LanguageSwitcher'
import type { NavLinksProps } from '../types'

export default function NavLinks({ links, ctaLabel, ctaHref }: NavLinksProps) {
  return (
    <div className="hidden md:flex items-center gap-8">
      <ul role="list" className="flex items-center gap-8 list-none">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-navbar-fg text-label-md uppercase tracking-wider hover:opacity-60 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              {...(link.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <LanguageSwitcher />
      <Button
        href={ctaHref}
        size="sm"
        aria-label={`${ctaLabel} — ir a la tienda online`}
      >
        {ctaLabel}
      </Button>
    </div>
  )
}
