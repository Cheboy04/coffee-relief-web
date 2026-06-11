import OriginBeat from './OriginBeat'
import { ORIGIN_BEATS } from '@/data/originStory'

export default function OriginStory() {
  return (
    <section id="origin" aria-labelledby="origin-story-heading" className="bg-surface">
      <h2 id="origin-story-heading" className="sr-only">
        Origen de nuestro café
      </h2>
      {ORIGIN_BEATS.map((beat) => (
        <OriginBeat key={beat.id} beat={beat} />
      ))}
    </section>
  )
}
