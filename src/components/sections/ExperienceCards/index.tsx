import { getTranslations } from 'next-intl/server'
import ExperienceCardsGrid from './ExperienceCardsGrid'

export default async function ExperienceCards() {
  const t = await getTranslations('experienceCards')

  return (
    <section
      id="experiencias"
      aria-labelledby="experiencias-heading"
      className="bg-surface py-section"
    >
      <h2 id="experiencias-heading" className="sr-only">
        {t('sectionLabel')}
      </h2>
      <ExperienceCardsGrid />
    </section>
  )
}
