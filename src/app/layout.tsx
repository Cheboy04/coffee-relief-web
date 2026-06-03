import type { Metadata } from 'next'
import { Libre_Caslon_Text, Hanken_Grotesk } from 'next/font/google'
import { Navbar, Footer } from '@/components/layout'
import { NAV_LINKS, NAV_CTA, FOOTER_DATA } from '@/data/navigation'
import './globals.css'

const caslon = Libre_Caslon_Text({
  variable: '--font-caslon',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: true,
})

const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Coffee Relief — Specialty Coffee from Ecuador',
    template: '%s | Coffee Relief',
  },
  description:
    'Premium specialty coffee roasted at origin in Ecuador. Direct trade, sustainable, award-winning. Shop online or visit our café.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://coffeereliefecuador.com'),
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    alternateLocale: 'en_US',
    siteName: 'Coffee Relief',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${caslon.variable} ${hanken.variable}`}>
      <body>
        {/* Skip navigation — visible only on keyboard focus */}
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-toast focus-visible:bg-surface focus-visible:text-primary focus-visible:px-4 focus-visible:py-2 focus-visible:rounded focus-visible:shadow-float"
        >
          Saltar al contenido
        </a>

        <Navbar
          links={NAV_LINKS}
          ctaLabel={NAV_CTA.label}
          ctaHref={NAV_CTA.href}
        />

        {/* No pt-navbar here — hero (Phase 3) is full-bleed behind navbar.
            Interior pages manage their own top spacing. */}
        <main id="main-content">
          {children}
        </main>

        <Footer
          linkGroups={FOOTER_DATA.groups}
          socialLinks={FOOTER_DATA.social}
          legalLinks={FOOTER_DATA.legal}
        />
      </body>
    </html>
  )
}
