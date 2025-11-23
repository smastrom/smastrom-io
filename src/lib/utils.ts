import type { HTMLAttributes } from 'astro/types'

const isActive = (pathname: string, href: string) =>
   pathname === href || pathname + '/' === href || pathname === href + '/'

export function getLinkProps(pathname: string, href: string) {
   return {
      href,
      ...(isActive(pathname, href) ? { 'aria-current': 'page' } : {}),
   } as HTMLAttributes<'a'>
}

export function getExtLinkAttrs(href: string, label: string) {
   return {
      href,
      rel: 'noreferrer',
      target: '_blank',
      'aria-label': label,
      title: label,
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

// https://stackoverflow.com/a/69661174
export function stripEmoji(text: string) {
   return text.replace(
      /(?![*#0-9]+)[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]/gu,
      ''
   )
}
