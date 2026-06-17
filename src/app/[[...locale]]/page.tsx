import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { OVERLAY_STRUCTURE } from '@/components/sections/HeroScroll/messages'
import type { OverlayMessage } from '@/components/sections/HeroScroll/types'
import { HeroScroll, TrustBar, OriginStory, ExperienceCards, MenuVisual } from '@/components/sections'
import ShopCoffee from '@/components/sections/ShopCoffee'
import Locations from '@/components/sections/Locations'

// [[...locale]] catch-all: / → locale=undefined, /es → locale=['es']
export function generateStaticParams() {
  return [
    { locale: [] },        // English at /
    { locale: ['es'] },    // Spanish at /es
  ]
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale?: string[] }>
}) {
  const { locale: localeParam } = await params
  const locale = (localeParam?.[0] ?? routing.defaultLocale) as Locale
  setRequestLocale(locale)

  const t = await getTranslations('hero')

  const overlayMessages: OverlayMessage[] = OVERLAY_STRUCTURE.map((s, i) => {
    const beatKey = `beat${i + 1}` as 'beat1' | 'beat2' | 'beat3'
    const base = {
      id:          s.id,
      scrollStart: s.scrollStart,
      scrollPeak:  s.scrollPeak,
      scrollEnd:   s.scrollEnd,
      position:    s.position,
      headline:    t(`${beatKey}.headline`),
      subline:     t(`${beatKey}.subline`),
    }
    if (s.cta) {
      return { ...base, cta: { href: s.cta.href, label: t(`${beatKey}.cta`) } }
    }
    return base
  })

  return (
    <>
      <HeroScroll
        overlayMessages={overlayMessages}
        ariaLabel={t('ariaLabel')}
      />
      <TrustBar />
      <OriginStory />
      <ExperienceCards />
      <ShopCoffee />
      <MenuVisual />
      <Locations />
    </>
  )
}
