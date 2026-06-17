import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { Libre_Caslon_Text, Hanken_Grotesk } from 'next/font/google'
import { Navbar, Footer } from '@/components/layout'
import '../globals.css'

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

// [[...locale]] catch-all: / → locale=undefined, /es → locale=['es']
export function generateStaticParams() {
  return [
    { locale: [] },        // English at /
    { locale: ['es'] },    // Spanish at /es
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string[] }>
}): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = (localeParam?.[0] ?? routing.defaultLocale) as Locale
  const t = await getTranslations({ locale, namespace: 'meta' })
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://coffeereliefecuador.com'

  return {
    title: {
      default: t('title'),
      template: '%s | Coffee Relief',
    },
    description: t('description'),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: locale === 'en' ? '/' : '/es',
      languages: {
        en: '/',
        es: '/es',
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'es_EC',
      siteName: 'Coffee Relief',
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale?: string[] }>
}) {
  const { locale: localeParam } = await params
  const locale = (localeParam?.[0] ?? routing.defaultLocale) as Locale

  if (!routing.locales.includes(locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const [messages, tNav] = await Promise.all([
    getMessages(),
    getTranslations('nav'),
  ])

  return (
    <html lang={locale} className={`${caslon.variable} ${hanken.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-toast focus-visible:bg-surface focus-visible:text-primary focus-visible:px-4 focus-visible:py-2 focus-visible:rounded focus-visible:shadow-float"
          >
            {tNav('skipToContent')}
          </a>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
