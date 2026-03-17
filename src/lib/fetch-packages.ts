import { GITHUB_PAT } from 'astro:env/server'

import { getPackageTitle, getUnscopedPackageName } from '@/lib/utils'

import type {
   NpmSearchApiResponse,
   NpmDownloadApiResponse,
   PackageSlug,
   OurPackage,
   GitHubRepositoryApiResponse,
} from '@/lib/types'

const devCache = new Map<string, { data: unknown; ts: number }>()
const DEV_CACHE_TTL = 5 * 60 * 1000

async function cachedFetch(url: string, init?: RequestInit): Promise<Response> {
   if (!import.meta.env.DEV) return fetch(url, init)

   const cached = devCache.get(url)
   if (cached && Date.now() - cached.ts < DEV_CACHE_TTL) {
      return new Response(JSON.stringify(cached.data), { status: 200 })
   }

   const res = await fetch(url, init)
   if (res.ok) {
      const data = await res.json()
      devCache.set(url, { data, ts: Date.now() })
      return new Response(JSON.stringify(data), { status: 200 })
   }

   return res
}

interface GetPackagesResponse {
   data: OurPackage[]
   error: string | null
}

export async function getPackages(
   npmUsername: string,
   packages: PackageSlug[]
): Promise<GetPackagesResponse> {
   try {
      const result = packages.reduce(
         (acc, pkg) => {
            acc[pkg] = {
               title: getPackageTitle(pkg),
               npm_url: `https://www.npmjs.com/package/${pkg}`,
            } as OurPackage

            return acc
         },
         {} as Record<PackageSlug, OurPackage>
      )

      const requests = [
         ...packages.map(async (pkg) => {
            const res = await cachedFetch(
               `https://api.npmjs.org/downloads/point/2000-01-01:2100-12-31/${pkg}`
            )

            if (!res.ok) throw new Error(await res.text())

            const data = (await res.json()) as NpmDownloadApiResponse

            result[pkg].total_downloads = data.downloads
         }),

         ...packages.map(async (pkg) => {
            const res = await cachedFetch(
               `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(`${npmUsername} ${getUnscopedPackageName(pkg)}`)}`
            )

            if (!res.ok) throw new Error(await res.text())

            const {
               objects: [data],
            } = (await res.json()) as NpmSearchApiResponse

            result[pkg].weekly_downloads = data.downloads.weekly
            result[pkg].monthly_downloads = data.downloads.monthly
         }),

         ...packages.map(async (pkg) => {
            const res = await cachedFetch(
               `https://api.github.com/repos/${npmUsername}/${getUnscopedPackageName(pkg)}`,
               {
                  headers: {
                     Accept: 'application/vnd.github+json',
                     Authorization: `Bearer ${GITHUB_PAT}`,
                     'User-Agent': npmUsername,
                  },
               }
            )

            if (!res.ok) throw new Error(await res.text())

            const data = (await res.json()) as GitHubRepositoryApiResponse

            result[pkg].demo_url = data.homepage || null
            result[pkg].created_at = data.created_at
            result[pkg].description = data.description.replace(/:[^:]+: /, '')
            result[pkg].stargazers_count = data.stargazers_count
            result[pkg].github_url = data.html_url
         }),
      ]

      await Promise.all(requests)

      return {
         data: Object.values(result).sort((a, b) => b.stargazers_count - a.stargazers_count),
         error: null,
      }
   } catch (err) {
      console.error(err)

      return { data: null as unknown as OurPackage[], error: (err as Error).message }
   }
}

interface NpmDownloadsStats {
   total: number
   weekly: number
   monthly: number
}

interface GetNpmDownloadsStatsResponse {
   error: string | null
   data: NpmDownloadsStats
}

/**
 * Get total NPM downloads for all packages published by a specific user.
 */
async function getPkgTotalDownloads(pkgName: string): Promise<number> {
   const res = await cachedFetch(
      `https://api.npmjs.org/downloads/point/2000-01-01:2100-12-31/${pkgName}`
   )

   if (!res.ok) throw new Error(await res.text())

   const data = (await res.json()) as NpmDownloadApiResponse

   return data.downloads
}

export async function getNpmDownloadsStats(
   npmUsername: string
): Promise<GetNpmDownloadsStatsResponse> {
   try {
      const res = await cachedFetch(
         `https://registry.npmjs.org/-/v1/search?text=author:${npmUsername}&size=250`
      )

      if (!res.ok) throw new Error(await res.text())

      const searchData = (await res.json()) as NpmSearchApiResponse

      const responseData = { total: 0, weekly: 0, monthly: 0 } as NpmDownloadsStats

      for (const pkg of searchData.objects) {
         if (pkg.package.publisher.username === npmUsername) {
            responseData.total += await getPkgTotalDownloads(pkg.package.name)
            responseData.weekly += pkg.downloads.weekly
            responseData.monthly += pkg.downloads.monthly
         }
      }

      return {
         error: null,
         data: responseData,
      }
   } catch (err) {
      console.error(err)

      return {
         error: (err as Error).message,
         data: null as unknown as NpmDownloadsStats,
      }
   }
}
