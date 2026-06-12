import { HeroScroll, TrustBar, OriginStory, ExperienceCards } from '@/components/sections'
import ShopCoffee from '@/components/sections/ShopCoffee'

export default function HomePage() {
  return (
    <>
      {/* Full-bleed: el hero vive detrás del navbar transparente (sin pt-navbar). */}
      <HeroScroll />
      <TrustBar />
      <OriginStory />
      <ExperienceCards />
      <ShopCoffee />
      {/* Fase 8: MenuVisual */}
    </>
  )
}
