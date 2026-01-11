import IconFingerprint from '@/components/icons/IconFingerprint.astro'
import IconGit from '@/components/icons/IconGit.astro'
import IconHandshake from '@/components/icons/IconHandshake.astro'

export const NAV_LINKS = [
   { caption: 'About Me', href: '/', Icon: IconFingerprint },
   { caption: 'Open Source', href: '/open-source', Icon: IconGit },
   { caption: 'Services', href: '/services', Icon: IconHandshake },
]
