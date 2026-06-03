import Link from 'next/link'
import FooterLinks from './FooterLinks'
import { InstagramIcon, TikTokIcon, FacebookIcon } from './icons'
import type { FooterProps, SocialLink } from '../types'

function SocialIcon({ link }: { link: SocialLink }) {
  const icons = {
    instagram: InstagramIcon,
    tiktok:    TikTokIcon,
    facebook:  FacebookIcon,
  }
  const Icon = icons[link.platform]
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      className="flex items-center justify-center w-10 h-10 text-white/60 hover:text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed rounded"
    >
      <Icon />
    </a>
  )
}

export default function Footer({ linkGroups, socialLinks, legalLinks }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-primary bg-grain-subtle"
      aria-label="Pie de página de Coffee Relief"
    >
      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-12 lg:gap-16">

          {/* Brand column */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              aria-label="Coffee Relief — página de inicio"
              className="font-display text-headline-sm text-white hover:opacity-70 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed w-fit"
            >
              Coffee Relief
            </Link>
            <p className="font-sans text-body-md text-white/60 max-w-[300px] leading-relaxed">
              Café de especialidad ecuatoriano tostado en origen.
              Comercio directo, sostenible y con reconocimiento internacional.
            </p>
            {/* Social icons */}
            <div className="flex gap-1 -ml-2">
              {socialLinks.map((link) => (
                <SocialIcon key={link.platform} link={link} />
              ))}
            </div>
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <FooterLinks key={group.title} group={group} />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-caption text-white/40">
            © {year} Coffee Relief. Todos los derechos reservados.
          </p>
          <ul role="list" className="flex gap-6 list-none">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-caption text-white/40 hover:text-white/70 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
