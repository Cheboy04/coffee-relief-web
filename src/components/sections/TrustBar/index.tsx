import TrustItem from './TrustItem'
import { TRUST_ITEMS } from './data'

export default function TrustBar() {
  const srText = TRUST_ITEMS.map((i) => i.label).join(' · ')

  return (
    <section aria-label="Por qué Coffee Relief" className="bg-surface-low py-5 md:py-5">
      {/* Accessible text — rendered once for screen readers, not visible */}
      <p className="sr-only">{srText}</p>

      {/* Marquee wrapper — overflow hidden clips the animation */}
      <div className="overflow-hidden" aria-hidden="true">
        {/*
          Two identical <ul> side-by-side, each with pr-12 (= gap-x-12) so
          every group width = 5 items + 5 gaps. translateX(-50%) lands exactly
          at the start of the second group → seamless infinite loop.
        */}
        <div className="inline-flex animate-trust-scroll hover:[animation-play-state:paused]">
          {[0, 1, 2].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center gap-x-12 pr-12">
              {TRUST_ITEMS.map((item) => (
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
