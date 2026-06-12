'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import Button from '@/components/ui/Button'
import QuizQuestion from './QuizQuestion'
import { useQuizLogic } from './useQuizLogic'

export default function CoffeeQuiz() {
  const prefersReducedMotion = useReducedMotion()
  const resultRef = useRef<HTMLDivElement>(null)
  const {
    currentStep, totalSteps, currentQuestion, currentAnswer,
    isLastStep, result, answer, next, back, reset,
  } = useQuizLogic()

  // Scroll to result card on recommendation
  useEffect(() => {
    if (!result) return
    const card = document.querySelector<HTMLElement>(`[data-product-id="${result.productId}"]`)
    if (!card) return
    card.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' })
    // highlight: add ring class, remove after 3s
    card.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface')
    const id = setTimeout(() => {
      card.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface')
    }, 3000)
    return () => clearTimeout(id)
  }, [result, prefersReducedMotion])

  if (!currentQuestion && !result) return null

  return (
    <div className="bg-surface-low rounded-xl p-6 md:p-8">
      <p className="font-sans text-label-md uppercase text-secondary mb-1">Encuentra tu café</p>
      <h3 className="font-display text-headline-sm text-on-surface mb-6">
        ¿Cuál es tu café ideal?
      </h3>

      {!result ? (
        <>
          {/* Progress */}
          <div
            className="flex items-center gap-2 mb-6"
            aria-label={`Pregunta ${currentStep + 1} de ${totalSteps}`}
          >
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'block h-1.5 rounded-full transition-all duration-300',
                  i <= currentStep ? 'bg-primary w-6' : 'bg-primary/20 w-3',
                )}
              />
            ))}
            <span className="font-sans text-label-md text-on-surface-variant ml-1">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>

          {/* Question */}
          <QuizQuestion
            question={currentQuestion!}
            selectedOptionId={currentAnswer}
            onSelect={(optionId) => answer(currentQuestion!.id, optionId)}
          />

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-6">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={back}>
                Anterior
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={next}
              className={cn(!currentAnswer && 'opacity-50 pointer-events-none')}
              aria-disabled={!currentAnswer}
            >
              {isLastStep ? 'Ver mi café' : 'Siguiente'}
            </Button>
          </div>
        </>
      ) : (
        /* Result */
        <div ref={resultRef}>
          <div role="status" aria-live="polite" className="mb-6">
            <p className="font-sans text-label-md uppercase text-secondary mb-1">Tu café es</p>
            <p className="font-display text-headline-md text-on-surface">
              {result.productId === 'valle-chota' && 'Valle del Chota'}
              {result.productId === 'pichincha-2850' && 'Pichincha 2850'}
              {result.productId === 'zamora-kraft' && 'Zamora Kraft'}
            </p>
            <p className="font-sans text-body-md text-on-surface-variant mt-2">
              {result.message}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            Volver a intentar
          </Button>
        </div>
      )}
    </div>
  )
}
