'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { EXPERIENCE_CARDS } from '@/data/experienceCards'
import ExperienceCard from './ExperienceCard'

export default function ExperienceCardsGrid() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="px-5 md:px-16 mx-auto max-w-content">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {EXPERIENCE_CARDS.map((card, index) => (
          <motion.div
            key={card.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{
              duration: 0.5,
              delay: prefersReducedMotion ? 0 : index * 0.1,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            <ExperienceCard data={card} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
