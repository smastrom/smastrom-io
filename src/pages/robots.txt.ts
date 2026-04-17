import { PROD_HOSTNAME, PROD_SITE_URL } from '../lib/constants'

import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = ({ request }) => {
   const host = request.headers.get('host')

   let responseText = 'User-agent: *\nDisallow: /'

   if (host === PROD_HOSTNAME) {
      responseText = `User-agent: *\nAllow: /\nSitemap: ${PROD_SITE_URL}/sitemap-index.xml`
   }

   return new Response(responseText, {
      headers: { 'Content-Type': 'text/plain' },
   })
}
