import { defineConfig, envField } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

import { SITE_URL } from './src/lib/constants'

export default defineConfig({
   site: SITE_URL,
   output: 'static',
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
   prefetch: {
      prefetchAll: true,
      defaultStrategy: 'viewport',
   },
   adapter: cloudflare({
      imageService: 'passthrough',
      platformProxy: {
         enabled: true,
      },
   }),
   integrations: [sitemap()],
   env: {
      schema: {
         DATO_TOKEN: envField.string({ context: 'client', access: 'public' }),
         GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      },
   },
   vite: {
      build: {
         minify: import.meta.env.PROD,
      },
   },
})
