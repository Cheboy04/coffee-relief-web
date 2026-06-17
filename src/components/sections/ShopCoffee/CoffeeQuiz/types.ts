export interface QuizOption {
  id: string
  scores: { suave: number; medio: number; intenso: number }
}

export interface QuizQuestion {
  id: string
  options: QuizOption[]
}

export interface TranslatedQuizOption extends QuizOption {
  label: string
}

export interface TranslatedQuizQuestion {
  id: string
  question: string
  options: TranslatedQuizOption[]
}

export interface QuizResult {
  productId: string
}

export type IntensityKey = 'suave' | 'medio' | 'intenso'
