import { defineConfig, envField } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

import { SITE_URL } from './src/lib/constants'
import { customMedia, customMediaPlugin } from './vite/custom-media-plugin.mjs'

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
   adapter: cloudflare({
      imageService: 'passthrough',
      platformProxy: {
         enabled: true,
      },
      workerEntryPoint: {
         path: 'src/worker.ts',
      },
   }),
   integrations: [sitemap()],
   vite: {
      css: {
         transformer: 'lightningcss',
      },
      build: {
         minify: import.meta.env.PROD,
      },
      plugins: [
         // Workaround for https://github.com/parcel-bundler/lightningcss/discussions/742
         customMediaPlugin(customMedia),
      ],
   },
   env: {
      schema: {
         GITHUB_PAT: envField.string({ context: 'server', access: 'secret' }),
         DATOCMS_READ_ONLY_TOKEN: envField.string({ context: 'client', access: 'public' }),
         IS_PREVIEW: envField.string({ context: 'client', access: 'public' }),
      },
   },
   redirects: {
      '/services': '/contact',
   },
})
