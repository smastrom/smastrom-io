const isActive = (url: URL, href: string) => url.pathname === href || url.pathname + '/' === href

export function getLinkProps(url: URL, href: string) {
   return {
      href,
      ...(isActive(url, href) ? { 'data-active': '' } : {}),
   }
}

export function formatNumber(num: number) {
   if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`.replace('.0', '')
   if (num >= 1000) return `${(num / 1000).toFixed(1)}k`.replace('.0', '')

   return num.toString()
}

export function capitalizeAll(str: string) {
   return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
}

export function formatDate(date: string) {
   return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
   })
}

export function addLinkAttrs(html: string) {
   return html.replace(/<a /g, '<a target="_blank" rel="nofollow noreferrer" ')
}

const WRANGLER_LOCAL_URL = 'http://127.0.0.1:8788'

export function getBaseUrl() {
   if (import.meta.env.DEV) return 'http://localhost:4321'
   return import.meta.env.CF_PAGES_URL || WRANGLER_LOCAL_URL
}
