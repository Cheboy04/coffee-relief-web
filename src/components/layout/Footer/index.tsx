import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import FooterLinks from './FooterLinks'
import { InstagramIcon, TikTokIcon, FacebookIcon } from './icons'
import type { FooterLinkGroup, SocialLink } from '../types'

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

export default async function Footer() {
  const t = await getTranslations('footer')
  const year = new Date().getFullYear()

  const linkGroups: FooterLinkGroup[] = [
    {
      title: t('groups.explore.title'),
      links: [
        { label: t('groups.explore.menu'),  href: '/menu' },
        { label: t('groups.explore.shop'),  href: '/shop' },
        { label: t('groups.explore.blog'),  href: '/blog' },
      ],
    },
    {
      title: t('groups.brand.title'),
      links: [
        { label: t('groups.brand.origin'),         href: '/about' },
        { label: t('groups.brand.sustainability'),  href: '/about#sustainability' },
        { label: t('groups.brand.awards'),          href: '/about#awards' },
        { label: t('groups.brand.locations'),       href: '/locations' },
      ],
    },
  ]

  const socialLinks: SocialLink[] = [
    { platform: 'instagram', href: 'https://instagram.com/coffeerelief', label: t('social.instagram') },
    { platform: 'tiktok',    href: 'https://tiktok.com/@coffeerelief',   label: t('social.tiktok') },
    { platform: 'facebook',  href: 'https://facebook.com/coffeerelief',  label: t('social.facebook') },
  ]

  const legalLinks = [
    { label: t('legal.privacy'), href: '/privacidad' },
    { label: t('legal.terms'),   href: '/terminos' },
  ]

  return (
    <footer
      className="bg-primary bg-grain-subtle"
      aria-label={t('ariaLabel')}
    >
      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-12 lg:gap-16">

          {/* Brand column */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              aria-label={t('ariaLabel')}
              className="font-display text-headline-sm text-white hover:opacity-70 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed w-fit"
            >
              Coffee Relief
            </Link>
            <p className="font-sans text-body-md text-white/60 max-w-[300px] leading-relaxed">
              {t('tagline')}
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
            © {year} Coffee Relief. {t('copyright')}
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
