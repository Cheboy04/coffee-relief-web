export interface QuizOption {
  id: string
  label: string
  scores: { suave: number; medio: number; intenso: number }
}

export interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
}

export interface QuizResult {
  productId: string
  message: string
}

export type IntensityKey = 'suave' | 'medio' | 'intenso'
