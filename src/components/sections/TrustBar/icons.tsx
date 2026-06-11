type IconProps = { className?: string }

const base = { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export function VolcanicIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M9 2 L5 10 H13 Z" stroke="currentColor" />
      <path d="M6 10 L3 16 H15 L12 10" stroke="currentColor" />
      <path d="M7 7 Q9 5 11 7" stroke="currentColor" />
    </svg>
  )
}

export function ProducerIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M9 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" stroke="currentColor" />
      <path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" />
      <path d="M12 10l2 2-2 2" stroke="currentColor" />
    </svg>
  )
}

export function RoastedIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M9 14c-3 0-5-1.5-5-4 0-3 2-5 5-5s5 2 5 5c0 2.5-2 4-5 4Z" stroke="currentColor" />
      <path d="M7 5 Q9 2 11 5" stroke="currentColor" />
      <path d="M9 3 V1" stroke="currentColor" />
    </svg>
  )
}

export function ShippingIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="1" y="5" width="12" height="9" rx="1" stroke="currentColor" />
      <path d="M13 8h2.5L17 11v3h-4V8Z" stroke="currentColor" />
      <circle cx="4.5" cy="14.5" r="1.5" stroke="currentColor" />
      <circle cx="13.5" cy="14.5" r="1.5" stroke="currentColor" />
    </svg>
  )
}

export function EcoIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M9 16 C9 16 4 12 4 7a5 5 0 0 1 10 0c0 5-5 9-5 9Z" stroke="currentColor" />
      <path d="M9 10 V16" stroke="currentColor" />
      <path d="M9 10 Q11 8 13 9" stroke="currentColor" />
      <path d="M9 12 Q7 11 6 12" stroke="currentColor" />
    </svg>
  )
}
