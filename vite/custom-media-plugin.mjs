export const customMedia = {
   '--mobile-to': '(max-width: 475px)',
   '--mobile-from': '(min-width: 476px)',
   '--tablet-to': '(max-width: 910px)',
   '--tablet-from': '(min-width: 911px)',
   '--laptop-to': '(max-width: 1366px)',
   '--laptop-from': '(min-width: 1367px)',
   '--desktop-to': '(max-width: 1920px)',
   '--desktop-from': '(min-width: 1921px)',
   '--menu-shift-to': '(max-width: 1100px)',
   '--menu-shift-from': '(min-width: 1101px)',
   '--article-container-to': '(max-width: 1240px)',
   '--article-container-from': '(min-width: 1241px)',
}

/**
 * Vite plugin that inlines CSS custom media queries like `@media (--tablet-to)`.
 * Workaround for https://github.com/parcel-bundler/lightningcss/discussions/742
 */
export function customMediaPlugin(media = customMedia) {
   return {
      name: 'custom-media',
      enforce: 'pre',
      transform(code, id) {
         if (!id.includes('.css') && !id.includes('.astro')) return
         let result = code
         for (const [name, value] of Object.entries(media)) {
            result = result.replaceAll(`(${name})`, value)
         }
         if (result === code) return
         return { code: result, map: null }
      },
   }
}
