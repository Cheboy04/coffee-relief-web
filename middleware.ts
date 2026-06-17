import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all pathnames except for static files and Next.js internals
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
}
