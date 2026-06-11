import { HeroScroll, TrustBar, OriginStory } from '@/components/sections'

export default function HomePage() {
  return (
    <>
      {/* Full-bleed: el hero vive detrás del navbar transparente (sin pt-navbar). */}
      <HeroScroll />
      <TrustBar />
      <OriginStory />

      {/* PHASE 6+: ExperienceCards, ShopCoffee, ProductCard, etc. */}
      <section id="shop" className="bg-surface py-section px-5 md:px-16">
        <div className="mx-auto max-w-content">
          <p className="font-sans text-body-md text-on-surface-variant">
            Sección Tienda — se construye en las próximas fases.
          </p>
        </div>
      </section>
    </>
  )
}
