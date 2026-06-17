import type { QuizQuestion } from './types'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'momento',
    options: [
      { id: 'manana',     scores: { suave: 2, medio: 1, intenso: 0 } },
      { id: 'media',      scores: { suave: 1, medio: 2, intenso: 1 } },
      { id: 'almuerzo',   scores: { suave: 0, medio: 1, intenso: 2 } },
      { id: 'cualquiera', scores: { suave: 1, medio: 2, intenso: 1 } },
    ],
  },
  {
    id: 'caracter',
    options: [
      { id: 'delicado',    scores: { suave: 2, medio: 1, intenso: 0 } },
      { id: 'equilibrado', scores: { suave: 1, medio: 2, intenso: 1 } },
      { id: 'potente',     scores: { suave: 0, medio: 1, intenso: 2 } },
    ],
  },
  {
    id: 'metodo',
    options: [
      { id: 'filtro',    scores: { suave: 2, medio: 1, intenso: 0 } },
      { id: 'prensa',    scores: { suave: 1, medio: 2, intenso: 1 } },
      { id: 'espresso',  scores: { suave: 0, medio: 1, intenso: 2 } },
      { id: 'cafeteria', scores: { suave: 1, medio: 2, intenso: 1 } },
    ],
  },
]
