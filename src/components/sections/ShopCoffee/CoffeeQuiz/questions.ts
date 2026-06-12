import type { QuizQuestion } from './types'

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'momento',
    question: '¿Cuándo sueles tomar tu café?',
    options: [
      { id: 'manana',     label: 'Al despertar, antes de desayunar', scores: { suave: 2, medio: 1, intenso: 0 } },
      { id: 'media',      label: 'A media mañana con algo de comer',  scores: { suave: 1, medio: 2, intenso: 1 } },
      { id: 'almuerzo',   label: 'Después del almuerzo',              scores: { suave: 0, medio: 1, intenso: 2 } },
      { id: 'cualquiera', label: 'A cualquier hora del día',          scores: { suave: 1, medio: 2, intenso: 1 } },
    ],
  },
  {
    id: 'caracter',
    question: '¿Qué buscas en una taza?',
    options: [
      { id: 'delicado',    label: 'Algo delicado, frutal y brillante', scores: { suave: 2, medio: 1, intenso: 0 } },
      { id: 'equilibrado', label: 'Equilibrado, redondo y dulce',      scores: { suave: 1, medio: 2, intenso: 1 } },
      { id: 'potente',     label: 'Potente, con cuerpo y final largo', scores: { suave: 0, medio: 1, intenso: 2 } },
    ],
  },
  {
    id: 'metodo',
    question: '¿Cómo preparas tu café en casa?',
    options: [
      { id: 'filtro',    label: 'Pour over, Chemex o AeroPress',   scores: { suave: 2, medio: 1, intenso: 0 } },
      { id: 'prensa',    label: 'Prensa francesa o moka',          scores: { suave: 1, medio: 2, intenso: 1 } },
      { id: 'espresso',  label: 'Máquina de espresso',             scores: { suave: 0, medio: 1, intenso: 2 } },
      { id: 'cafeteria', label: 'Prefiero tomarlo en cafetería',   scores: { suave: 1, medio: 2, intenso: 1 } },
    ],
  },
]
