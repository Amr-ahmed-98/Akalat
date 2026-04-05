// src/middleware.ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always', // always show /ar or /en in the URL
})

export const config = {
  // match all paths except Next.js internals and static files
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
}