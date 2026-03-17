import { defineConfig, envField } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

import { SITE_URL } from './src/lib/constants'

const customMedia = {
   '--mobile-to': '(max-width: 475px)',
   '--mobile-from': '(min-width: 476px)',
   '--tablet-to': '(max-width: 910px)',
   '--tablet-from': '(min-width: 911px)',
   '--laptop-to': '(max-width: 1366px)',
   '--laptop-from': '(min-width: 1367px)',
   '--desktop-to': '(max-width: 1920px)',
   '--desktop-from': '(min-width: 1921px)',
   '--menu-shift-to': '(max-width: 1100px)',
   '--menu-shift-from': '(min-width: 1101px)',
   '--article-container-to': '(max-width: 1240px)',
   '--article-container-from': '(min-width: 1241px)',
}

export default defineConfig({
   site: SITE_URL,
   devToolbar: {
      enabled: false,
   },
   image: {
      remotePatterns: [
         {
            protocol: 'https',
         },
      ],
   },
   prefetch: import.meta.env.DEV
      ? false
      : {
           prefetchAll: true,
           defaultStrategy: 'viewport',
        },
   adapter: cloudflare(),
   integrations: [sitemap()],
   env: {
      schema: {
         DATO_TOKEN: envField.string({ context: 'client', access: 'public' }),
         GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret' }),
         IS_PREVIEW: envField.string({ context: 'client', access: 'public' }),
      },
   },
   vite: {
      css: {
         transformer: 'lightningcss',
      },
      build: {
         minify: import.meta.env.PROD,
         cssMinify: 'lightningcss',
         target: 'esnext',
      },
      plugins: [
         // Workaround for https://github.com/parcel-bundler/lightningcss/discussions/742
         {
            name: 'custom-media',
            enforce: 'pre',
            transform(code, id) {
               if (!id.includes('.css') && !id.includes('.astro')) return
               let result = code
               for (const [name, value] of Object.entries(customMedia)) {
                  result = result.replaceAll(`(${name})`, value)
               }
               if (result === code) return
               return { code: result, map: null }
            },
         },
      ],
   },
   experimental: {
      queuedRendering: {
         enabled: true,
      },
   },
})
