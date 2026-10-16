import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCachedGlobal } from './getGlobals'
import { getMediaUrl } from './getMediaUrl'

const getImageURL = (
  image?: Media | Config['db']['defaultIDType'] | null,
  fallback?: string,
) => {
  const serverUrl = getServerSideURL()

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url || image.url

    if (ogUrl) return serverUrl + getMediaUrl(ogUrl)
  }

  return fallback ? serverUrl + fallback : undefined
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const settings = await getCachedGlobal('settings', 1)()

  const siteName = settings?.siteName || 'Photography Portfolio'
  const metaTitle = settings?.seo?.metaTitle || siteName
  const description =
    doc?.meta?.description || settings?.seo?.metaDescription || settings?.description || undefined

  const ogImage =
    getImageURL(doc?.meta?.image) ||
    getImageURL(settings?.seo?.ogImage) ||
    `${getServerSideURL()}/website-template-OG.webp`

  const title = doc?.meta?.title ? `${doc.meta.title} | ${metaTitle}` : metaTitle

  return {
    description,
    openGraph: mergeOpenGraph(
      {
        description: description || '',
        images: ogImage ? [{ url: ogImage }] : undefined,
        title,
        url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
      },
      { description, imageUrl: ogImage, siteName, title },
    ),
    title,
  }
}
