export function getLinkProps(url: URL, href: string) {
   return {
      href,
      ...(url.pathname === href ? { 'data-active': '' } : {}),
   }
}
