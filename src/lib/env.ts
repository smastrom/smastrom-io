import { IS_PREVIEW } from 'astro:env/client'

export const isPreviewEnvironment = () =>
   IS_PREVIEW === 'true' || import.meta.env.IS_PREVIEW === 'true' || import.meta.env.DEV
