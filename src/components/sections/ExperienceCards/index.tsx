import ExperienceCardsGrid from './ExperienceCardsGrid'

export default function ExperienceCards() {
  return (
    <section
      id="experiencias"
      aria-labelledby="experiencias-heading"
      className="bg-surface py-section"
    >
      <h2 id="experiencias-heading" className="sr-only">
        Nuestras experiencias
      </h2>
      <ExperienceCardsGrid />
    </section>
  )
}
