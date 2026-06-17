'use client'

import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'framer-motion'
import { EXPERIENCE_CARDS } from '@/data/experienceCards'
import ExperienceCard from './ExperienceCard'

type CardKey = 'cafeteria' | 'tienda' | 'tasting' | 'brunch'

export default function ExperienceCardsGrid() {
  const t = useTranslations('experienceCards')
  const prefersReducedMotion = useReducedMotion()

  const translatedCards = EXPERIENCE_CARDS.map((card) => {
    const key = card.id as CardKey
    return {
      ...card,
      title:    t(`${key}.title`),
      eyebrow:  t(`${key}.eyebrow`),
      summary:  t(`${key}.summary`),
      imageAlt: t(`${key}.imageAlt`),
      ctaFront: { ...card.ctaFront, label: t(`${key}.ctaFront`) },
      ctaBack:  { ...card.ctaBack,  label: t(`${key}.ctaBack`) },
    }
  })

  return (
    <div className="px-5 md:px-16 mx-auto max-w-content">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {translatedCards.map((card, index) => (
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
