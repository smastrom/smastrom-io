import type { Document } from 'datocms-structured-text-utils'

type Seo = {
   title: string
   description: string
}

export interface CmsLayout {
   _site: { globalSeo: { siteName: string; fallbackSeo: Seo } }
   layout: { footerText: string }
}

export type BlockProperties = {
   __typename: string
   id: string
}

export type ArticleImageBlock = BlockProperties & {
   image: {
      alt: string
      width: number
      height: number
      url: string
   }
}

export type IndexPage = {
   home: {
      seo: Seo
      title: string
      body: {
         value: Document
         blocks: ArticleImageBlock[]
      }
   }
}

export interface OpenSourcePage {
   openSource: {
      seo: Seo
      title: string
      text: string
   }
}

export interface ServicesPage {
   servicesPage: {
      seo: Seo
      title: string
      subtitle: string
      sections: {
         title: string
         text: string
      }[]
      services: {
         caption: string
         title: string
         image: {
            url: string
         }
         imageDescription: string
         description: string
      }[]
   }
}
