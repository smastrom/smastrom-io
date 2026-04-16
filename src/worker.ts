import type { SSRManifest } from 'astro'

import { App } from 'astro/app'
import { handle } from '@astrojs/cloudflare/handler'

function getThemeFromCookie(request: Request): string | null {
   const cookie = request.headers.get('cookie')
   if (!cookie) return null

   const match = cookie.match(/(?:^|;\s*)theme=(light|dark)/)
   return match ? match[1] : null
}

export function createExports(manifest: SSRManifest) {
   const app = new App(manifest)

   return {
      default: {
         async fetch(request, env, ctx) {
            // @ts-expect-error - request is not typed correctly
            const response = await handle(manifest, app, request, env, ctx)
            const contentType = response.headers.get('content-type')

            if (!contentType?.includes('text/html')) return response

            const theme = getThemeFromCookie(request)
            console.log('theme', theme)
            if (!theme) return response

            return new HTMLRewriter()
               .on('html[data-theme]', {
                  element(el) {
          
                     el.setAttribute('data-theme', theme)
                  },
               })
               .transform(response)
         },
      } satisfies ExportedHandler,
   }
}
