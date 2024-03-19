import type { APIRoute } from 'astro'

import { capitalizeAll } from '@/lib/utils'

export interface Package {
   title: string
   downloads: number
   stargazers_count: number
   description: string
   created_at: string
   demo_url: string | null
   npm_url: string
   github_url: string
}

export interface StatsResponse {
   data: Package[]
   error: string | null
}

const removeScope = (pkg: string) => (pkg.startsWith('@') ? pkg.split('/')[1] : pkg)

/**
 * NOTES:
 *
 * 1. This API as-is only works for packages which have the same scope and name in both NPM and GitHub.
 * 2. When calling the GitHub API below the username is hardcoded for simplicity, change this if you're copying the code.
 * 3. Protect the access using Cloudflare Rules or something similar
 */

export const GET: APIRoute = async ({ request }) => {
   try {
      const url = new URL(request.url)

      const packages = new URLSearchParams(url.search).get('packages').split(',')

      const result = packages.reduce(
         (acc, pkg, i) => {
            acc[i] = {
               title: capitalizeAll(removeScope(pkg)).replaceAll('-', ' '),
               npm_url: `https://www.npmjs.com/package/${pkg}`,
            } as Package
            return acc
         },
         {} as Record<string, Package>
      )

      const requests = [
         ...packages.map(async (pkg, i) => {
            const res = await fetch(
               `https://api.npmjs.org/downloads/point/2000-01-01:2100-12-31/${pkg}`
            )

            if (!res.ok) throw new Error(await res.text())

            const data = await res.json()
            result[i].downloads = data.downloads
         }),

         ...packages.map(async (pkg, i) => {
            const res = await fetch(`https://api.github.com/repos/smastrom/${removeScope(pkg)}`, {
               headers: {
                  Accept: 'application/vnd.github+json',
                  Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
                  'User-Agent': 'smastrom',
               },
            })

            if (!res.ok) throw new Error(await res.text())

            const data = await res.json()
            Object.assign(result[i], {
               demo_url: data.homepage || null,
               created_at: data.created_at,
               description: data.description.replace(/:[^:]+: /, ''),
               stargazers_count: data.stargazers_count,
               github_url: data.html_url,
            })
         }),
      ]

      await Promise.all(requests)

      return new Response(
         JSON.stringify({
            data: Object.values(result),
            error: null,
         }),
         {
            status: 200,
            headers: {
               'Content-Type': 'application/json',
            },
         }
      )
   } catch (err) {
      console.error(err)

      return new Response(JSON.stringify({ data: null, error: err.message }), {
         status: 500,
         headers: {
            'Content-Type': 'application/json',
         },
      })
   }
}
