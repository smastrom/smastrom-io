import { GITHUB_TOKEN } from 'astro:env/server'

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

// NOTO: This will only work for packages which have the same scope and name on both NPM and GitHub.

const USERNAME = 'smastrom'

const removeScope = (pkg: string) => (pkg.startsWith('@') ? pkg.split('/')[1] : pkg)

export async function getPackages(packages: string[]): Promise<StatsResponse> {
   try {
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
            const res = await fetch(
               `https://api.github.com/repos/${USERNAME}/${removeScope(pkg)}`,
               {
                  headers: {
                     Accept: 'application/vnd.github+json',
                     Authorization: `Bearer ${GITHUB_TOKEN}`,
                     'User-Agent': USERNAME,
                  },
               }
            )

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

      return {
         data: Object.values(result),
         error: null,
      }
   } catch (err) {
      console.error(err)

      return {
         data: null,
         error: err.message,
      }
   }
}

/**
 * Get total NPM downloads for all packages published by an user.
 */
export async function getTotalDownloads() {
   try {
      const res = await fetch(
         `https://registry.npmjs.org/-/v1/search?text=author:${USERNAME}&size=250`
      )

      if (!res.ok) throw new Error(await res.text())

      const data = await res.json()

      const pkgs = data.objects
         .filter((pkg) => pkg.package.publisher.username === USERNAME)
         .map((pkg) => pkg.package.name)

      const requests = pkgs.map(async (pkg) => {
         const res = await fetch(
            `https://api.npmjs.org/downloads/point/2000-01-01:2100-12-31/${pkg}`
         )

         if (!res.ok) throw new Error(await res.text())

         const data = await res.json()

         return {
            name: pkg,
            downloads: data.downloads,
         }
      })

      const downloads = await Promise.all(requests)

      return {
         error: null,
         data: downloads.reduce((acc, pkg) => acc + pkg.downloads, 0),
      }
   } catch (err) {
      console.error(err)

      return {
         error: err.message,
         data: null,
      }
   }
}
