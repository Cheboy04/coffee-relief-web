import { getTranslations } from 'next-intl/server'
import TrustItem from './TrustItem'
import { TRUST_ITEMS } from './data'

export default async function TrustBar() {
  const t = await getTranslations('trustBar')

  const translatedItems = TRUST_ITEMS.map((item) => ({
    ...item,
    label: t(item.id as 'volcanic' | 'producer' | 'roasted' | 'shipping' | 'eco'),
  }))

  const srText = translatedItems.map((i) => i.label).join(' · ')

  return (
    <section aria-label={srText} className="bg-surface-low py-5 md:py-5">
      {/* Accessible text — rendered once for screen readers, not visible */}
      <p className="sr-only">{srText}</p>

      {/* Marquee wrapper — overflow hidden clips the animation */}
      <div className="overflow-hidden" aria-hidden="true">
        <div className="inline-flex animate-trust-scroll hover:[animation-play-state:paused]">
          {[0, 1, 2].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center gap-x-12 pr-12">
              {translatedItems.map((item) => (
                <TrustItem
                  key={`${item.id}-${copy}`}
                  item={item}
                  instanceKey={`${item.id}-${copy}`}
                />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
