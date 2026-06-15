import { HeroScroll, TrustBar, OriginStory, ExperienceCards, MenuVisual } from '@/components/sections'
import ShopCoffee from '@/components/sections/ShopCoffee'
import Locations from '@/components/sections/Locations'

export default function HomePage() {
  return (
    <>
      {/* Full-bleed: el hero vive detrás del navbar transparente (sin pt-navbar). */}
      <HeroScroll />
      <TrustBar />
      <OriginStory />
      <ExperienceCards />
      <ShopCoffee />
      <MenuVisual />
      <Locations />
    </>
  )
}
