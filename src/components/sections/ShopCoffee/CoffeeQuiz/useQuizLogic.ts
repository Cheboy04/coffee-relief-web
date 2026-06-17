'use client'

import { useState, useCallback } from 'react'
import { QUIZ_QUESTIONS } from './questions'
import type { QuizResult, IntensityKey } from './types'

const INTENSITY_TO_PRODUCT: Record<IntensityKey, string> = {
  suave:   'tropical',
  medio:   'immersive',
  intenso: 'bold',
}

function computeResult(answers: Record<string, string>): QuizResult {
  const totals: Record<IntensityKey, number> = { suave: 0, medio: 0, intenso: 0 }

  for (const question of QUIZ_QUESTIONS) {
    const selectedOptionId = answers[question.id]
    if (!selectedOptionId) continue
    const option = question.options.find((o) => o.id === selectedOptionId)
    if (!option) continue
    totals.suave   += option.scores.suave
    totals.medio   += option.scores.medio
    totals.intenso += option.scores.intenso
  }

  // Tie → medio always wins (Immersive Relief)
  let winner: IntensityKey = 'medio'
  if (totals.suave > totals.medio && totals.suave > totals.intenso) winner = 'suave'
  else if (totals.intenso > totals.medio && totals.intenso > totals.suave) winner = 'intenso'

  return { productId: INTENSITY_TO_PRODUCT[winner] }
}

export function useQuizLogic() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)

  const totalSteps = QUIZ_QUESTIONS.length
  const currentQuestion = QUIZ_QUESTIONS[currentStep]
  const isLastStep = currentStep === totalSteps - 1
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined

  const answer = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }, [])

  const next = useCallback(() => {
    if (isLastStep) {
      setResult(computeResult(answers))
    } else {
      setCurrentStep((s) => s + 1)
    }
  }, [isLastStep, answers])

  const back = useCallback(() => {
    setCurrentStep((s) => Math.max(0, s - 1))
  }, [])

  const reset = useCallback(() => {
    setCurrentStep(0)
    setAnswers({})
    setResult(null)
  }, [])

  return {
    currentStep,
    totalSteps,
    currentQuestion,
    currentAnswer,
    isLastStep,
    result,
    answer,
    next,
    back,
    reset,
  }
}
