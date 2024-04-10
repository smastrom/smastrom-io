import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
   site: 'https://smastrom.io',
   trailingSlash: 'never',
   devToolbar: {
      enabled: false,
   },
   prefetch: {
      prefetchAll: true,
      defaultStrategy: 'viewport',
   },
   output: 'hybrid',
   adapter: cloudflare(),
})
