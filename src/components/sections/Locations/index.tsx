import { LOCATIONS } from '@/data/locations'
import LocationsClient from './LocationsClient'

export default function Locations() {
  return (
    <section
      id="locations"
      aria-labelledby="locations-title"
      className="bg-primary py-section px-5 lg:px-16"
    >
      <div className="max-w-content mx-auto">
        <div className="flex flex-col gap-3">
          <span className="font-sans text-label-md uppercase text-secondary">
            Dónde estamos
          </span>
          <h2
            id="locations-title"
            className="font-display text-headline-md text-on-primary"
          >
            Encuéntranos
          </h2>
        </div>

        <LocationsClient locations={LOCATIONS} />
      </div>
    </section>
  )
}
