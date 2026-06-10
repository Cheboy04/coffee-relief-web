'use client'

import type { TransitionState, UseHeroTransitionParams } from './types'

const TRANSITION_START = 0.9 // la funda empieza a encoger
const TRANSITION_SETTLE = 0.97 // la card destino ya tomó el relevo

/**
 * Deriva el estado de la transición a partir del progreso de scroll.
 * Es estado derivado puro (se computa en render, sin efecto ni setState):
 * solo activo en modo 'scrub'. La animación visual la ejecuta GSAP
 * (useHeroScrub); este hook expone el estado para que la UI haga el relevo
 * declarativo (placeholder → ProductCard en la Fase 7).
 */
export function useHeroTransition({ progress, enabled }: UseHeroTransitionParams): TransitionState {
  if (!enabled) return { active: false, settled: false }
  return {
    active: progress >= TRANSITION_START,
    settled: progress >= TRANSITION_SETTLE,
  }
}
