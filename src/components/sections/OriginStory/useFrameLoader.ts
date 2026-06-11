'use client'

import { useState, useEffect } from 'react'

// frame_000000.webp naming convention (6-digit zero-padded, underscore, .webp)
function frameSrc(framesDir: string, index: number): string {
  return `${framesDir}/frame_${String(index).padStart(6, '0')}.webp`
}

export function useFrameLoader(
  framesDir: string,
  frameCount: number,
  enabled: boolean,
): HTMLImageElement[] {
  const [frames, setFrames] = useState<HTMLImageElement[]>([])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    const loaded: HTMLImageElement[] = new Array(frameCount)
    let doneCount = 0

    // Batch state updates: fire at frame 1, 25%, 50%, 75%, 100%
    const checkpoints = new Set([
      1,
      Math.ceil(frameCount * 0.25),
      Math.ceil(frameCount * 0.5),
      Math.ceil(frameCount * 0.75),
      frameCount,
    ])

    // setState called inside img callbacks (not in effect body) — satisfies react-hooks/set-state-in-effect
    const onSettled = () => {
      if (cancelled) return
      doneCount++
      if (checkpoints.has(doneCount)) {
        setFrames([...loaded])
      }
    }

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.onload = onSettled
      img.onerror = onSettled
      img.src = frameSrc(framesDir, i)
      loaded[i] = img
    }

    return () => {
      cancelled = true
    }
  }, [framesDir, frameCount, enabled])

  return frames
}
