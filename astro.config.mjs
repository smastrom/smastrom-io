import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

export default defineConfig({
   site: 'https://smastrom.io',
   devToolbar: {
      enabled: false,
   },
   prefetch: {
      defaultStrategy: 'viewport',
      prefetchAll: true,
   },
   output: 'server',
   adapter: cloudflare(),
})
