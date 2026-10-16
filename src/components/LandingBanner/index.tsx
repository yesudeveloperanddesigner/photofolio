import React from 'react'

import { ScrollBannerView } from '@/blocks/ScrollBanner/Component'
import { getCachedGlobal } from '@/utilities/getGlobals'

// Graceful defaults so the landing page looks intentional before content is filled in.
const fallbacks = {
  eyebrow: 'Photography · Since 2009',
  image: {
    alt: 'Wide landscape at dusk',
    url: 'https://picsum.photos/seed/elena-banner/2400/1500?grayscale',
  },
  location: 'Lisbon, Portugal',
  overlay: 45,
  subtitle:
    'Documentary and editorial photography across landscape, portraiture and the spaces in between.',
  title: 'Light, and the quiet moments it finds.',
}

/**
 * The main banner in the first section of the landing page. Its content and
 * image are owned by the Settings global so editors can change it without
 * touching the page layout.
 */
export async function LandingBanner() {
  const settings = await getCachedGlobal('settings', 1)()
  const banner = settings?.homeBanner

  return (
    <ScrollBannerView
      eyebrow={banner?.eyebrow || fallbacks.eyebrow}
      image={banner?.image && typeof banner.image === 'object' ? banner.image : fallbacks.image}
      location={banner?.location || fallbacks.location}
      overlay={typeof banner?.overlay === 'number' ? banner.overlay : fallbacks.overlay}
      subtitle={banner?.subtitle || fallbacks.subtitle}
      title={banner?.title || fallbacks.title}
    />
  )
}
