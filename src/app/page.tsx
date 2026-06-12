import { HeroScroll, TrustBar, OriginStory, ExperienceCards } from '@/components/sections'

export default function HomePage() {
  return (
    <>
      {/* Full-bleed: el hero vive detrás del navbar transparente (sin pt-navbar). */}
      <HeroScroll />
      <TrustBar />
      <OriginStory />
      <ExperienceCards />

      {/* Fase 7: ShopCoffee + ProductCard + HeroTransition */}
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
