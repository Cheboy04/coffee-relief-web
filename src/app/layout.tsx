import type { Metadata } from 'next'
import { Libre_Caslon_Text, Hanken_Grotesk } from 'next/font/google'
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
      <body>{children}</body>
    </html>
  )
}
