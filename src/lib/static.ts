import IconFingerprint from '@/components/IconFingerprint.astro'
import IconGit from '@/components/IconGit.astro'
import IconHandshake from '@/components/IconHandshake.astro'

export const navLinks = [
   { caption: 'About Me', href: '/', Icon: IconFingerprint },
   { caption: 'Open Source', href: '/open-source', Icon: IconGit },
   { caption: 'Professional Work', href: '/professional-work', Icon: IconHandshake },
]
