import { GITHUB_PAT } from 'astro:env/server'

import { capitalizeAll, getPackageTitle, getUnscopedPackageName } from '@/lib/utils'

import type {
   NpmSearchApiResponse,
   NpmDownloadApiResponse,
   PackageSlug,
   MyNpmPackage,
   MyMacPackage,
   GitHubRepositoryApiResponse,
   GitHubReleaseApiResponse,
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

function githubHeaders(username: string) {
   return {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_PAT}`,
      'User-Agent': username,
   }
}

interface GetNpmPackagesResponse {
   data: MyNpmPackage[]
   error: string | null
}

export async function getNpmPackages(
   npmUsername: string,
   packages: PackageSlug[]
): Promise<GetNpmPackagesResponse> {
   if (packages.length === 0) return { data: [], error: null }

   try {
      const result = packages.reduce(
         (acc, pkg) => {
            acc[pkg] = {
               type: 'npm',
               title: getPackageTitle(pkg),
               npm_url: `https://www.npmjs.com/package/${pkg}`,
            } as MyNpmPackage

            return acc
         },
         {} as Record<PackageSlug, MyNpmPackage>
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
               { headers: githubHeaders(npmUsername) }
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

      return { data: null as unknown as MyNpmPackage[], error: (err as Error).message }
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

export async function getNpmDownloadsStats(
   npmUsername: string
): Promise<GetNpmDownloadsStatsResponse> {
   try {
      const res = await cachedFetch(
         `https://registry.npmjs.org/-/v1/search?text=author:${npmUsername}&size=250`
      )

      if (!res.ok) throw new Error(await res.text())

      const searchData = (await res.json()) as NpmSearchApiResponse

      const userPackages = searchData.objects.filter(
         (pkg) => pkg.package.publisher.username === npmUsername
      )

      const totalDownloads = await Promise.all(
         userPackages.map(async (pkg) => {
            const dlRes = await cachedFetch(
               `https://api.npmjs.org/downloads/point/2000-01-01:2100-12-31/${pkg.package.name}`
            )

            if (!dlRes.ok) throw new Error(await dlRes.text())

            const data = (await dlRes.json()) as NpmDownloadApiResponse
            return data.downloads
         })
      )

      const responseData: NpmDownloadsStats = {
         total: totalDownloads.reduce((sum, dl) => sum + dl, 0),
         weekly: userPackages.reduce((sum, pkg) => sum + pkg.downloads.weekly, 0),
         monthly: userPackages.reduce((sum, pkg) => sum + pkg.downloads.monthly, 0),
      }

      return { error: null, data: responseData }
   } catch (err) {
      console.error(err)

      return {
         error: (err as Error).message,
         data: null as unknown as NpmDownloadsStats,
      }
   }
}

interface GetMacPackagesResponse {
   data: MyMacPackage[]
   error: string | null
}

export async function getMacPackages(
   githubUsername: string,
   repos: string[]
): Promise<GetMacPackagesResponse> {
   if (repos.length === 0) return { data: [], error: null }

   try {
      const packages = await Promise.all(
         repos.map(async (repo) => {
            const headers = githubHeaders(githubUsername)

            const [repoRes, releasesRes] = await Promise.all([
               cachedFetch(`https://api.github.com/repos/${githubUsername}/${repo}`, { headers }),
               // TODO: Add pagination if a repo exceeds 100 releases
               cachedFetch(
                  `https://api.github.com/repos/${githubUsername}/${repo}/releases?per_page=100`,
                  { headers }
               ),
            ])

            if (!repoRes.ok) throw new Error(await repoRes.text())
            if (!releasesRes.ok) throw new Error(await releasesRes.text())

            const repoData = (await repoRes.json()) as GitHubRepositoryApiResponse
            const releasesData = (await releasesRes.json()) as GitHubReleaseApiResponse[]

            const totalDownloads = releasesData.reduce(
               (sum, release) =>
                  sum +
                  release.assets
                     .filter((asset) => asset.name.endsWith('.dmg'))
                     .reduce((s, asset) => s + asset.download_count, 0),
               0
            )

            return {
               type: 'mac' as const,
               title: capitalizeAll(repo),
               total_downloads: totalDownloads,
               stargazers_count: repoData.stargazers_count,
               description: repoData.description.replace(/:[^:]+: /, ''),
               created_at: repoData.created_at,
               demo_url: repoData.homepage || null,
               github_url: repoData.html_url,
            } satisfies MyMacPackage
         })
      )

      return {
         data: packages.sort((a, b) => b.stargazers_count - a.stargazers_count),
         error: null,
      }
   } catch (err) {
      console.error(err)

      return { data: null as unknown as MyMacPackage[], error: (err as Error).message }
   }
}
