import { DATOCMS_READ_TOKEN } from 'astro:env/server'

import { isBlock, type Document as Dast } from 'datocms-structured-text-utils'
import { render } from 'datocms-structured-text-to-html-string'
import { isPreviewEnvironment } from './env'

import type { JSX } from 'astro/jsx-runtime'
import type { BlockProperties } from './types'

export async function useDato<Schema>(query: string) {
   type DatoResponse = { data: Schema; errors?: { message: string }[] }
   type OurResponse = { data: Schema; error: string | null }

   const result = { error: null, data: null } as OurResponse

   try {
      const res = await fetch('https://graphql.datocms.com', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: DATOCMS_READ_TOKEN,
            'X-Api-Version': '3',
            'X-Environment': isPreviewEnvironment() ? 'preview' : 'main',
         },
         body: JSON.stringify({ query }),
      })

      if (!res.ok) {
         throw `DatoCMS request failed with ${res.status}: ${res.statusText} - ${await res.text()}`
      }

      // Dato returns 200 on GraphQL requests errors

      const json = (await res.json()) as DatoResponse

      if ('errors' in json) {
         throw json.errors!.map((e) => e.message).join(', ')
      }

      result.data = json.data
      return result
   } catch (error) {
      result.error = error as string
      return result
   }
}

export function StructuredText<T extends BlockProperties>(
   response: {
      value: Dast
      blocks: T[]
   },
   renderers: {
      [key: string]: (block: T) => JSX.Element
      content: (html: any) => string // TS cries with (html: string)
   }
) {
   const nodes = response.value.document.children

   return nodes.map((node) => {
      if (isBlock(node)) {
         const currBlock = response.blocks.find((b) => b.id === node.item)
         if (!currBlock) return null

         const blockName = currBlock.__typename
         if (blockName in renderers) return renderers[blockName](currBlock)
      } else {
         return renderers.content(render(node)) // Fragment cannot be used outside of Astro components
      }
   })
}
