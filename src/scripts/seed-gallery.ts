import 'dotenv/config'

import config from '@payload-config'
import { getPayload } from 'payload'

/**
 * Seeds a single featured gallery with placeholder images.
 * Run with: pnpm exec tsx src/scripts/seed-gallery.ts
 */
const images = [
  {
    alt: 'Coastal light',
    caption: 'Atlantic edge',
    meta: '35mm · Lisbon · 2024',
    url: 'https://picsum.photos/seed/gallery-atlantic/1200/1600?grayscale',
  },
  {
    alt: 'Quiet interior',
    caption: 'Morning room',
    meta: '50mm · Porto · 2024',
    url: 'https://picsum.photos/seed/gallery-interior/1200/1600?grayscale',
  },
  {
    alt: 'Street study',
    caption: 'Passing through',
    meta: '28mm · Madrid · 2023',
    url: 'https://picsum.photos/seed/gallery-street/1200/1600?grayscale',
  },
  {
    alt: 'Dune line',
    caption: 'Wind shaped',
    meta: '85mm · Comporta · 2024',
    url: 'https://picsum.photos/seed/gallery-dunes/1200/1600?grayscale',
  },
  {
    alt: 'Night harbour',
    caption: 'After hours',
    meta: '35mm · Lisbon · 2025',
    url: 'https://picsum.photos/seed/gallery-harbour/1200/1600?grayscale',
  },
]

const run = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'galleries',
    limit: 1,
    where: { slug: { equals: 'selected-work' } },
  })

  if (existing.docs.length) {
    await payload.delete({
      collection: 'galleries',
      id: existing.docs[0].id,
      context: { disableRevalidate: true },
    })
    payload.logger.info('Removed previous "selected-work" gallery')
  }

  const gallery = await payload.create({
    collection: 'galleries',
    context: { disableRevalidate: true },
    data: {
      description: 'A scroll-driven selection of recent photographs.',
      featured: true,
      images: images.map(({ alt, caption, meta, url }) => ({
        caption,
        image: { alt, url },
        meta,
      })),
      slug: 'selected-work',
      title: 'Selected Work',
    },
  })

  payload.logger.info(`Seeded gallery "${gallery.title}" (${gallery.id}) with ${images.length} images`)

  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
