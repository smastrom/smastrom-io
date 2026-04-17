import { AUTHOR_NAME, AUTHOR_EMAIL, PROD_SITE_URL } from '@/lib/constants'
import { USER_LINKS, TOPICS } from '@/lib/static'

interface Seo {
   title: string
   description: string
}

const PERSON_ID = `${PROD_SITE_URL}/#person`
const WEBSITE_ID = `${PROD_SITE_URL}/#website`

export function getSharedJsonLd() {
   return {
      '@context': 'https://schema.org',
      '@graph': [
         {
            '@type': 'Person',
            '@id': PERSON_ID,
            name: AUTHOR_NAME,
            givenName: 'Simone',
            jobTitle: 'Software Developer',
            url: PROD_SITE_URL,
            email: `mailto:${AUTHOR_EMAIL}`,
            image: `${PROD_SITE_URL}/brand/icon-512.png`,
            knowsAbout: TOPICS,
            homeLocation: {
               '@type': 'Place',
               address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'IT',
               },
            },
            sameAs: Object.values(USER_LINKS),
         },
         {
            '@type': 'WebSite',
            '@id': WEBSITE_ID,
            url: PROD_SITE_URL,
            name: `${AUTHOR_NAME} - Software Developer`,
            publisher: { '@id': PERSON_ID },
         },
      ],
   }
}

const PAGE_SCHEMAS: Record<string, (seo: Seo) => Record<string, unknown>> = {
   '/': (seo) => ({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${PROD_SITE_URL}/#webpage`,
      url: PROD_SITE_URL,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': PERSON_ID },
   }),
   '/open-source/': (seo) => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${PROD_SITE_URL}/open-source/#webpage`,
      url: `${PROD_SITE_URL}/open-source/`,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': WEBSITE_ID },
   }),
   '/contact/': (seo) => ({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `${PROD_SITE_URL}/contact/#webpage`,
      url: `${PROD_SITE_URL}/contact/`,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: { '@id': PERSON_ID },
   }),
}

export function getPageJsonLd(pathname: string, seo: Seo) {
   const normalized = pathname === '/' ? '/' : `${pathname.replace(/\/$/, '')}/`
   return PAGE_SCHEMAS[normalized]?.(seo) ?? null
}
