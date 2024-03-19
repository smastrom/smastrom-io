export function getLinkProps(url: URL, href: string) {
   return {
      href,
      ...(url.pathname === href ? { 'data-active': '' } : {}),
   }
}

export function formatNumber(num: number) {
   if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
   if (num >= 1000) return `${(num / 1000).toFixed(1)}k`

   return num.toString()
}

export function capitalizeAll(str: string) {
   return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
}

export function formatDate(date: string) {
   return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
   })
}

const WRANGLER_LOCAL_URL = 'http://127.0.0.1:8788'

export function getBaseUrl() {
   if (import.meta.env.DEV) return 'http://localhost:4321'
   return import.meta.env.CF_PAGES_URL || WRANGLER_LOCAL_URL
}

export async function useDato<Schema>(query: string) {
   type UseDatoResponse = { data: Schema; error: string | null }

   const result = { error: null, data: null }

   try {
      const res = await fetch('https://graphql.datocms.com', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: import.meta.env.DATO_TOKEN,
         },
         body: JSON.stringify({ query }),
      })

      const data = await res.json()

      if ('errors' in data) {
         throw data.errors.map((e) => e.message).join(', ')
      }

      result.data = data.data
      return result as UseDatoResponse
   } catch (error) {
      result.error = error
      return result as UseDatoResponse
   }
}
