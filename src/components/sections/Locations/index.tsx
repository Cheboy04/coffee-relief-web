import { getTranslations } from 'next-intl/server'
import { LOCATIONS } from '@/data/locations'
import LocationsClient from './LocationsClient'

export default async function Locations() {
  const t = await getTranslations('locations')

  return (
    <section
      id="locations"
      aria-labelledby="locations-title"
      className="bg-primary py-section px-5 lg:px-16"
    >
      <div className="max-w-content mx-auto">
        <div className="flex flex-col gap-3">
          <span className="font-sans text-label-md uppercase text-secondary-fixed-dim">
            {t('eyebrow')}
          </span>
          <h2
            id="locations-title"
            className="font-display text-headline-md text-on-primary"
          >
            {t('heading')}
          </h2>
        </div>

        <LocationsClient locations={LOCATIONS} />
      </div>
    </section>
  )
}
