import { handle } from '@astrojs/cloudflare/handler'

type Theme = 'light' | 'dark'

function getThemeCookie(request: Request): Theme | null {
   const cookies = request.headers.get('cookie')
   if (!cookies) return null

   const match = cookies.match(/(?:^|;\s*)theme=(light|dark)/)
   return (match?.[1] as Theme) ?? null
}

export default {
   async fetch(request: Request, env: Env, ctx: ExecutionContext) {
      const response = await handle(request, env, ctx)

      const theme = getThemeCookie(request)

      if (!theme || !response.headers.get('content-type')?.includes('text/html')) {
         return response
      }

      const isDark = theme === 'dark'

      return new HTMLRewriter()
         .on('html', {
            element(el) {
               el.setAttribute('data-theme', theme)
            },
         })
         .on('#theme_switch', {
            element(el) {
               el.setAttribute('aria-checked', `${isDark}`)
               el.setAttribute('aria-label', isDark ? 'Disable dark mode' : 'Enable dark mode')
            },
         })
         .on(isDark ? '#theme_moon_icon' : '#theme_sun_icon', {
            element(el) {
               el.setAttribute('style', 'display:none')
            },
         })
         .transform(response)
   },
} satisfies ExportedHandler
