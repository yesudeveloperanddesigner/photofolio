import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

export type OpenGraphDefaults = {
  description?: string
  imageUrl?: string
  siteName?: string
  title?: string
}

export const mergeOpenGraph = (
  og?: Metadata['openGraph'],
  defaults?: OpenGraphDefaults,
): Metadata['openGraph'] => {
  const siteName = defaults?.siteName || 'Photography Portfolio'

  const base: Metadata['openGraph'] = {
    type: 'website',
    description: defaults?.description || '',
    images: [
      {
        url: defaults?.imageUrl || `${getServerSideURL()}/website-template-OG.webp`,
      },
    ],
    siteName,
    title: defaults?.title || siteName,
  }

  return {
    ...base,
    ...og,
    images: og?.images ? og.images : base.images,
  }
}
