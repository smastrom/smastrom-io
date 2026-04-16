import { AUTHOR_NAME, AUTHOR_EMAIL, SITE_URL, LINKS, TOPICS } from '@/lib/constants'

interface Seo {
   title: string
   description: string
}

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

export function getSharedJsonLd() {
   return {
      '@context': 'https://schema.org',
      '@graph': [
         {
            '@type': 'Person',
            '@id': PERSON_ID,
            name: AUTHOR_NAME,
            givenName: 'Simone',
            jobTitle: 'Software Professional',
            url: SITE_URL,
            email: `mailto:${AUTHOR_EMAIL}`,
            image: `${SITE_URL}/icon-512.png`,
            knowsAbout: TOPICS,
            homeLocation: {
               '@type': 'Place',
               address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'IT',
               },
            },
            sameAs: Object.values(LINKS),
         },
         {
            '@type': 'WebSite',
            '@id': WEBSITE_ID,
            url: SITE_URL,
            name: `${AUTHOR_NAME} - Web Developer`,
            publisher: { '@id': PERSON_ID },
         },
      ],
   }
}

const PAGE_SCHEMAS: Record<string, (seo: Seo) => Record<string, unknown>> = {
   '/': (seo) => ({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': PERSON_ID },
   }),
   '/open-source/': (seo) => ({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/open-source/#webpage`,
      url: `${SITE_URL}/open-source/`,
      name: seo.title,
      description: seo.description,
      isPartOf: { '@id': WEBSITE_ID },
   }),
   '/contact/': (seo) => ({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      '@id': `${SITE_URL}/contact/#webpage`,
      url: `${SITE_URL}/contact/`,
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
