'use client'

import { cn } from '@/lib/utils/cn'
import type { QuizQuestion as QuizQuestionType } from './types'

interface QuizQuestionProps {
  question: QuizQuestionType
  selectedOptionId: string | undefined
  onSelect: (optionId: string) => void
}

export default function QuizQuestion({ question, selectedOptionId, onSelect }: QuizQuestionProps) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="font-display text-headline-sm text-on-surface mb-4 w-full">
        {question.question}
      </legend>
      <div className="flex flex-col gap-2">
        {question.options.map((option) => {
          const inputId = `quiz-${question.id}-${option.id}`
          const isSelected = option.id === selectedOptionId
          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className={cn(
                'flex items-center gap-3 cursor-pointer rounded-lg px-4 py-3',
                'font-sans text-body-md border transition-colors duration-150',
                isSelected
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface border-primary/10 text-on-surface hover:border-primary/30 hover:bg-surface-low',
              )}
            >
              <input
                id={inputId}
                type="radio"
                name={`quiz-${question.id}`}
                value={option.id}
                checked={isSelected}
                onChange={() => onSelect(option.id)}
                className="sr-only"
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
