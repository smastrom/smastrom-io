type Seo = {
   title: string
   description: string
}

export interface CmsLayout {
   _site: { globalSeo: { siteName: string; fallbackSeo: Seo } }
   layout: { footerText: string }
}

export interface CmsIndex {
   home: {
      seo: Seo
      title: string
      sections: {
         title: string
         text: string
      }[]
   }
}

export interface CmsOpenSource {
   openSource: {
      seo: Seo
      title: string
      text: string
   }
}

export interface CmsProfessionalWork {
   professionalWork: {
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
