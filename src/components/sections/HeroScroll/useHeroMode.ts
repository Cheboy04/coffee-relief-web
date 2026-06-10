'use client'

import { useEffect, useState } from 'react'
import type { HeroMode } from './types'

interface NavigatorConnection {
  saveData?: boolean
}

/**
 * Resuelve el modo de ejecución en cliente.
 * SSR siempre devuelve 'static' → markup estable, sin hydration mismatch.
 * Tras montar, escucha cambios de breakpoint y de prefers-reduced-motion.
 */
export function useHeroMode(): HeroMode {
  const [mode, setMode] = useState<HeroMode>('static')

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)')

    const resolve = () => {
      const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection
      const saveData = connection?.saveData === true

      if (saveData || !motionOk.matches) {
        setMode('static')
        return
      }
      setMode(desktop.matches ? 'scrub' : 'loop')
    }

    resolve()
    desktop.addEventListener('change', resolve)
    motionOk.addEventListener('change', resolve)
    return () => {
      desktop.removeEventListener('change', resolve)
      motionOk.removeEventListener('change', resolve)
    }
  }, [])

  return mode
}
