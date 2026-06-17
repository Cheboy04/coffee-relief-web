'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from '@/components/ui/Button'
import LanguageSwitcher from '../LanguageSwitcher'
import { cn } from '@/lib/utils/cn'
import type { MobileMenuProps } from '../types'

const fullVariants: Variants = {
  closed: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.19, 1, 0.22, 1] },
  },
}

const reducedVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.15 } },
  open:   { opacity: 1, transition: { duration: 0.15 } },
}

const backdropVariants: Variants = {
  closed: { opacity: 0, transition: { duration: 0.2 } },
  open:   { opacity: 1, transition: { duration: 0.3 } },
}

const linkItemVariants: Variants = {
  closed: { opacity: 0, x: -16 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 + i * 0.05, duration: 0.3, ease: [0.19, 1, 0.22, 1] },
  }),
}

const reducedLinkVariants: Variants = {
  closed: { opacity: 0 },
  open:   (i: number) => ({ opacity: 1, transition: { delay: i * 0.03 } }),
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
    >
      {isOpen ? (
        <>
          <line x1={6}  y1={6}  x2={18} y2={18} />
          <line x1={18} y1={6}  x2={6}  y2={18} />
        </>
      ) : (
        <>
          <line x1={3} y1={6}  x2={21} y2={6} />
          <line x1={3} y1={12} x2={21} y2={12} />
          <line x1={3} y1={18} x2={21} y2={18} />
        </>
      )}
    </svg>
  )
}

export default function MobileMenu({ links, ctaLabel, ctaHref }: MobileMenuProps) {
  const t = useTranslations('nav')
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const overlayVariants = prefersReducedMotion ? reducedVariants : fullVariants
  const itemVariants    = prefersReducedMotion ? reducedLinkVariants : linkItemVariants

  const close = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Body scroll lock (no layout shift)
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      return
    }
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${scrollbarWidth}px`
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) close()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  // Focus first element when panel opens
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      const panel = panelRef.current
      if (!panel) return
      const first = panel.querySelector<HTMLElement>(
        'button, a, [tabindex]:not([tabindex="-1"])'
      )
      first?.focus()
    }, 50)
    return () => clearTimeout(timer)
  }, [isOpen])

  // Close on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  // Focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a, [tabindex]:not([tabindex="-1"])'
      )
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      {/* Hamburger trigger — mobile only */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          'md:hidden flex items-center justify-center w-11 h-11 -mr-2',
          'text-navbar-fg rounded',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'transition-opacity duration-200 hover:opacity-60'
        )}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        aria-label={isOpen ? t('closeMenu') : t('openMenu')}
      >
        <HamburgerIcon isOpen={isOpen} />
      </button>

      {/* Panel + backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-x-0 bottom-0 bg-primary/20 md:hidden"
              style={{ top: 'var(--navbar-height)' }}
              onClick={close}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              ref={panelRef}
              id="mobile-nav-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t('mobileMenuLabel')}
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-x-0 bg-surface border-b border-outline-variant shadow-tonal-md md:hidden"
              style={{ top: 'var(--navbar-height)' }}
              onKeyDown={handleKeyDown}
            >
              {/* Close button */}
              <div className="flex justify-end px-5 pt-5">
                <button
                  type="button"
                  onClick={close}
                  className="flex items-center justify-center w-10 h-10 text-on-surface rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:opacity-60 transition-opacity"
                  aria-label={t('closeMenuShort')}
                >
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                    <line x1={6}  y1={6}  x2={18} y2={18} />
                    <line x1={18} y1={6}  x2={6}  y2={18} />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav aria-label={t('mobileMenuLabel')}>
                <ul role="list" className="flex flex-col px-5 pb-6 list-none">
                  {links.map((link, i) => (
                    <motion.li
                      key={link.href}
                      custom={i}
                      variants={itemVariants}
                    >
                      <Link
                        href={link.href}
                        onClick={close}
                        className="block py-4 font-display text-headline-sm text-on-surface border-b border-outline-variant/50 hover:text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        {...(link.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* Language switcher + CTA */}
              <div className="px-5 pb-4">
                <LanguageSwitcher />
              </div>
              <div className="px-5 pb-8">
                <Button
                  href={ctaHref}
                  size="lg"
                  className="w-full justify-center"
                  aria-label={`${ctaLabel} — ir a la tienda online`}
                  onClick={close}
                >
                  {ctaLabel}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
