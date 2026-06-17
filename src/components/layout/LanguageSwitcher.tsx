'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: 'en' | 'es') {
    router.replace(pathname, { locale: next })
  }

  return (
    <nav aria-label="Language selector" className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => switchLocale('en')}
        aria-current={locale === 'en' ? 'true' : undefined}
        className={[
          'font-sans text-label-md uppercase tracking-wider transition-opacity duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          locale === 'en'
            ? 'text-navbar-fg'
            : 'text-navbar-fg opacity-40 hover:opacity-70',
        ].join(' ')}
      >
        EN
      </button>
      <span aria-hidden="true" className="text-navbar-fg opacity-20 select-none">|</span>
      <button
        type="button"
        onClick={() => switchLocale('es')}
        aria-current={locale === 'es' ? 'true' : undefined}
        className={[
          'font-sans text-label-md uppercase tracking-wider transition-opacity duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          locale === 'es'
            ? 'text-navbar-fg'
            : 'text-navbar-fg opacity-40 hover:opacity-70',
        ].join(' ')}
      >
        ES
      </button>
    </nav>
  )
}
