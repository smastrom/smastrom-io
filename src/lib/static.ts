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
   '@smastrom/react-rating',
   'vue-use-active-scroll',
]
