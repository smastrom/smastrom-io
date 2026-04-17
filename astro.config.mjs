import { defineConfig, envField } from 'astro/config'
import { loadEnv } from 'vite'

import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

import { customMedia, customMediaPlugin } from './vite/custom-media-plugin.mjs'
import { PROD_SITE_URL } from './src/lib/constants'

const {
   IS_PREVIEW
} = loadEnv(import.meta.env.MODE, process.cwd(), '')

export default defineConfig({
   site: PROD_SITE_URL,
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
   output: import.meta.env.PROD && IS_PREVIEW === 'true' ? 'server' : 'static',
   adapter: cloudflare({
      imageService: 'passthrough',
      platformProxy: {
         enabled: true,
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
         DATOCMS_READ_TOKEN: envField.string({ context: 'server', access: 'secret' }),
         IS_PREVIEW: envField.string({ context: 'client', access: 'public' }),
      },
   },
   redirects: {
      '/services': '/contact',
   },
})
