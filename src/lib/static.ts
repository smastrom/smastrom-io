import IconFingerprint from '@/components/icons/IconFingerprint.astro'
import IconGit from '@/components/icons/IconGit.astro'
import IconHandshake from '@/components/icons/IconHandshake.astro'

export const navLinks = [
   { caption: 'About Me', href: '/', Icon: IconFingerprint },
   { caption: 'Open Source', href: '/open-source', Icon: IconGit },
   { caption: 'Professional Work', href: '/professional-work', Icon: IconHandshake },
]

export const packages = [
   'notivue',
   'vue-collapsed',
   'vue-use-active-scroll',
   '@smastrom/react-rating',
]

export const jsonLdKnowsAbout = [
   'Vite',
   'Vue.js',
   'Nuxt',
   'Astro',
   'Cloudflare',
   'Supabase',
   'Directus',
   'Storyblok',
]
