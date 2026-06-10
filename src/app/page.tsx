import { HeroScroll } from '@/components/sections'

export default function HomePage() {
  return (
    <>
      {/* Full-bleed: el hero vive detrás del navbar transparente (sin pt-navbar). */}
      <HeroScroll />

      {/* Destino del CTA y de la transición funda → card.
          PHASE 4+: TrustBar, OriginStory, ShopCoffee, ProductCard, etc. */}
      <section id="shop" className="bg-surface py-section px-5 md:px-16">
        <div className="mx-auto max-w-[1280px]">
          <p className="font-sans text-body-md text-on-surface-variant">
            Sección Tienda — se construye en las próximas fases.
          </p>
        </div>
      </section>
    </>
  )
}
