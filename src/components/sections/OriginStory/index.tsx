import { getTranslations } from 'next-intl/server'
import OriginBeat from './OriginBeat'
import { ORIGIN_BEATS } from '@/data/originStory'

export default async function OriginStory() {
  const t = await getTranslations('originStory')

  const beatKeys = ['beat1', 'beat2', 'beat3', 'beat4'] as const

  const translatedBeats = ORIGIN_BEATS.map((beat, index) => {
    const key = beatKeys[index]
    return {
      ...beat,
      eyebrow:  t(`${key}.eyebrow`),
      headline: t(`${key}.headline`),
      body:     t(`${key}.body`),
      imageAlt: t(`${key}.imageAlt`),
    }
  })

  return (
    <section id="origin" aria-labelledby="origin-story-heading" className="bg-surface">
      <h2 id="origin-story-heading" className="sr-only">
        {t('sectionLabel')}
      </h2>
      {translatedBeats.map((beat) => (
        <OriginBeat key={beat.id} beat={beat} />
      ))}
    </section>
  )
}
