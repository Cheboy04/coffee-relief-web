import CanvasScrub from './CanvasScrub'
import type { BeatConfig } from './types'

type Props = { beat: BeatConfig }

export default function OriginBeat({ beat }: Props) {
  const trackId = `beat-${beat.id}`

  return (
    <article
      id={trackId}
      className="flex flex-col h-beat-track-mob bg-surface md:h-beat-track md:flex-row md:items-start"
    >
      {/* Canvas column — sticky on desktop, normal flow on mobile */}
      <div
        className={[
          'h-beat-canvas-mob shrink-0 overflow-hidden',
          'md:h-screen md:sticky md:top-0 md:w-canvas-col',
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
      </div>

      {/* Text column — scrolls normally, vertically centered within beat track */}
      <div
        className={[
          'flex flex-1 items-center px-5 py-10',
          'md:flex-none md:w-text-col md:h-beat-track md:px-16 md:py-0',
          beat.canvasLeft ? 'md:order-2' : 'md:order-1',
        ].join(' ')}
      >
        <div className="max-w-prose">
          <p className="text-label-md uppercase text-secondary mb-4">
            {beat.eyebrow}
          </p>
          <h3 className="font-display text-headline-md text-on-surface mb-5">
            {beat.headline}
          </h3>
          <p className="font-sans text-body-lg text-on-surface-variant">
            {beat.body}
          </p>
        </div>
      </div>
    </article>
  )
}
