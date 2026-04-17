import IconFingerprint from '@/components/icons/IconFingerprint.astro'
import IconGit from '@/components/icons/IconGit.astro'
import IconHandshake from '@/components/icons/IconHandshake.astro'

export const NAV_LINKS = [
   { caption: 'About Me', href: '/', Icon: IconFingerprint },
   { caption: 'Open Source', href: '/open-source', Icon: IconGit },
   { caption: 'Connecting', href: '/contact', Icon: IconHandshake },
]

export const USER_LINKS = {
   github: 'https://github.com/smastrom',
   discord: 'https://discordapp.com/users/1174395637660401695',
}

export const DONATE_LINKS = {
   card: [
      {
         slug: 'coffee',
         label: 'BuyMeACoffee.com',
         url: 'https://buymeacoffee.com/smastrom',
      },
      {
         slug: 'paypal',
         label: 'PayPal',
         url: 'https://www.paypal.com/donate/?hosted_button_id=93WKXA68W9WQJ',
      },
   ],
   crypto: [
      {
         slug: 'crypto',
         label: 'NOWPayments',
         url: 'https://nowpayments.io/donation/smastrom',
      },
   ],
} as const

export const TOPICS = ['Web development', 'Web design']