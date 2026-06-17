'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils/cn'
import Button from '@/components/ui/Button'
import { PRODUCTS } from '@/data/products'
import QuizQuestion from './QuizQuestion'
import { useQuizLogic } from './useQuizLogic'
import { QUIZ_QUESTIONS } from './questions'
import type { TranslatedQuizQuestion } from './types'

export default function CoffeeQuiz() {
  const t = useTranslations('quiz')
  const prefersReducedMotion = useReducedMotion()
  const resultRef = useRef<HTMLDivElement>(null)
  const {
    currentStep, totalSteps, currentQuestion, currentAnswer,
    isLastStep, result, answer, next, back, reset,
  } = useQuizLogic()

  // Build translated questions using explicit key lookups to satisfy TypeScript
  const quizText = {
    q1: {
      question: t('q1.question'),
      options: {
        manana:     t('q1.options.manana'),
        media:      t('q1.options.media'),
        almuerzo:   t('q1.options.almuerzo'),
        cualquiera: t('q1.options.cualquiera'),
      },
    },
    q2: {
      question: t('q2.question'),
      options: {
        delicado:    t('q2.options.delicado'),
        equilibrado: t('q2.options.equilibrado'),
        potente:     t('q2.options.potente'),
      },
    },
    q3: {
      question: t('q3.question'),
      options: {
        filtro:    t('q3.options.filtro'),
        prensa:    t('q3.options.prensa'),
        espresso:  t('q3.options.espresso'),
        cafeteria: t('q3.options.cafeteria'),
      },
    },
  }

  const translatedQuestions: TranslatedQuizQuestion[] = QUIZ_QUESTIONS.map((q, i) => {
    const qKey = `q${i + 1}` as 'q1' | 'q2' | 'q3'
    const qt = quizText[qKey]
    return {
      id: q.id,
      question: qt.question,
      options: q.options.map((opt) => ({
        ...opt,
        label: (qt.options as Record<string, string>)[opt.id] ?? opt.id,
      })),
    }
  })

  const translatedCurrentQuestion = currentQuestion
    ? translatedQuestions.find((q) => q.id === currentQuestion.id)
    : undefined

  useEffect(() => {
    if (!result) return
    const card = document.querySelector<HTMLElement>(`[data-product-id="${result.productId}"]`)
    if (!card) return
    card.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' })
    card.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface')
    const id = setTimeout(() => {
      card.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'ring-offset-surface')
    }, 3000)
    return () => clearTimeout(id)
  }, [result, prefersReducedMotion])

  if (!currentQuestion && !result) return null

  return (
    <div className="bg-surface-low rounded-xl p-6 md:p-8">
      <p className="font-sans text-label-md uppercase text-secondary mb-1">{t('eyebrow')}</p>
      <h3 className="font-display text-headline-sm text-on-surface mb-6">{t('heading')}</h3>

      {!result ? (
        <>
          <div
            className="flex items-center gap-2 mb-6"
            aria-label={t('step', { current: currentStep + 1, total: totalSteps })}
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

          {translatedCurrentQuestion && (
            <QuizQuestion
              question={translatedCurrentQuestion}
              selectedOptionId={currentAnswer}
              onSelect={(optionId) => answer(currentQuestion!.id, optionId)}
            />
          )}

          <div className="flex items-center gap-3 mt-6">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={back}>
                {t('back')}
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={next}
              // Deshabilitado: tokens sólidos (no opacity) → mantiene contraste ≥4.5:1.
              // opacity-50 sobre bg-surface-low componía 3.44:1 (texto #fbf9f9 / fondo #8e857f).
              className={cn(!currentAnswer && 'pointer-events-none bg-surface-high text-on-surface-variant')}
              aria-disabled={!currentAnswer}
            >
              {isLastStep ? t('recommend') : t('next')}
            </Button>
          </div>
        </>
      ) : (
        <div ref={resultRef}>
          <div role="status" aria-live="polite" className="mb-6">
            <p className="font-sans text-label-md uppercase text-secondary mb-1">{t('resultLabel')}</p>
            <p className="font-display text-headline-md text-on-surface">
              {PRODUCTS.find((p) => p.id === result.productId)?.name ?? result.productId}
            </p>
            <p className="font-sans text-body-md text-on-surface-variant mt-2">
              {t(`results.${result.productId as 'bold' | 'immersive' | 'tropical'}.message`)}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={reset}>
            {t('retry')}
          </Button>
        </div>
      )}
    </div>
  )
}
