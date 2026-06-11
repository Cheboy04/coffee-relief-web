export interface BeatConfig {
  id: string
  eyebrow: string
  headline: string
  body: string
  framesDir: string
  frameCount: number
  placeholderColor: string
  imageAlt: string
  canvasLeft: boolean
}

export interface CanvasScrubProps {
  framesDir: string
  frameCount: number
  placeholderColor: string
  alt: string
  scrollTrackId: string
}
