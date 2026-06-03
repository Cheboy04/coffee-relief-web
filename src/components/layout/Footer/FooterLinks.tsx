import Link from 'next/link'
import type { FooterLinksProps } from '../types'

export default function FooterLinks({ group }: FooterLinksProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-sans text-label-md uppercase tracking-wider text-white/40">
        {group.title}
      </h3>
      <ul role="list" className="flex flex-col gap-3 list-none">
        {group.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-sans text-body-md text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-fixed"
              {...(link.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
