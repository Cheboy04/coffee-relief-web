import CanvasScrub from './CanvasScrub'
import type { BeatConfig } from './types'

type Props = { beat: BeatConfig }

function BeatText({ beat }: Props) {
  return (
    <div className="max-w-prose">
      <p className="text-label-md uppercase text-primary md:text-secondary mb-4">{beat.eyebrow}</p>
      <h3 className="font-display text-headline-md text-on-surface mb-5">{beat.headline}</h3>
      <p className="font-sans text-body-lg text-on-surface-variant">{beat.body}</p>
    </div>
  )
}

export default function OriginBeat({ beat }: Props) {
  const trackId = `beat-${beat.id}`

  return (
    <article
      id={trackId}
      className="relative flex flex-col h-beat-track-mob bg-surface md:h-beat-track md:flex-row md:items-start"
    >
      {/* Stage — full-screen sticky canvas on mobile; sticky column on desktop */}
      <div
        className={[
          'sticky top-0 h-screen w-full overflow-hidden',
          'md:h-screen md:w-canvas-col',
          beat.canvasLeft ? 'md:order-1' : 'md:order-2',
        ].join(' ')}
      >
        <CanvasScrub
          framesDir={beat.framesDir}
          frameCount={beat.frameCount}
          placeholderColor={beat.placeholderColor}
          alt={beat.imageAlt}
          scrollTrackId={trackId}
        />

        {/* Mobile-only text overlay anchored to the bottom of the sticky canvas */}
        <div className="origin-text-scrim absolute inset-x-0 bottom-0 px-5 pt-24 pb-12 md:hidden">
          <BeatText beat={beat} />
        </div>
      </div>

      {/* Desktop-only text column — scrolls beside the sticky canvas */}
      <div
        className={[
          'hidden md:flex md:flex-none md:w-text-col md:h-beat-track md:items-center md:px-16',
          beat.canvasLeft ? 'md:order-2' : 'md:order-1',
        ].join(' ')}
      >
        <BeatText beat={beat} />
      </div>
    </article>
  )
}
