import { prefetch as astroPrefetch } from 'astro:prefetch'

import { navLinks } from './static'

export function getLinkProps(url: URL, href: string) {
   return {
      href,
      ...(url.pathname === href ? { 'data-active': '' } : {}),
   }
}

export function prefetch() {
   navLinks.forEach((l) => {
      if (window.location.pathname !== l.href) astroPrefetch(l.href, { with: 'fetch' })
   })
}

export function formatNumber(num: number) {
   if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
   if (num >= 1000) return `${(num / 1000).toFixed(1)}k`

   return num.toString()
}

export function capitalizeAll(str: string) {
   return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
}

export function formatDate(date: string) {
   return new Date(date)
      .toLocaleDateString('en-US', {
         month: 'short',
         day: 'numeric',
         year: 'numeric',
      })
      .toLowerCase()
}

const WRANGLER_LOCAL_URL = 'http://127.0.0.1:8788'

export function getBaseUrl() {
   if (import.meta.env.DEV) return 'http://localhost:4321'
   return import.meta.env.CF_PAGES_URL || WRANGLER_LOCAL_URL
}
