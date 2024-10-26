import { defineConfig, envField } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
   site: 'https://smastrom.io',
   trailingSlash: 'never',
   devToolbar: {
      enabled: false,
   },
   output: 'hybrid',
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
   experimental: {
      env: {
         schema: {
            DATO_TOKEN: envField.string({ context: 'client', access: 'public' }),
            GITHUB_TOKEN: envField.string({ context: 'server', access: 'secret' }),
         },
      },
   },
   vite: {
      build: {
         minify: import.meta.env.PROD,
      },
   },
})
