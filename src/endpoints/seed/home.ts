import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Gallery, Photo } from '@/payload-types'

type HomeArgs = {
  gallery: Gallery
  photos: Photo[]
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  gallery,
  photos,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'none',
    },
    meta: {
      description:
        'A minimalist portfolio for a photographer — scroll-driven galleries, an about section, skills and contact.',
      title: 'Elena Marchetti — Photographer',
    },
    title: 'Home',
    layout: [
      {
        blockName: 'Selected work',
        blockType: 'scrollGallery',
        eyebrow: 'Selected work',
        heading: 'A walk through the archive.',
        intro:
          'A rotating selection of personal and commissioned series. Scroll to move through the frames.',
        gallery: gallery.id,
      },
      {
        blockName: 'About',
        blockType: 'photographerProfile',
        eyebrow: 'About',
        heading: 'I photograph the pause between moments.',
        bio: 'Elena Marchetti is a documentary and editorial photographer based in Lisbon. Her work moves between landscape, portraiture and the everyday, drawn to slow light and the small gestures that hold a story together. She works on long-term personal projects and commissions for publications, brands and cultural institutions.',
        photos: photos.map((photo) => photo.id),
        skills: [
          { label: 'Documentary' },
          { label: 'Portraiture' },
          { label: 'Landscape' },
          { label: 'Editorial' },
          { label: 'Analog & digital' },
          { label: 'Art direction' },
        ],
        contact: {
          email: 'hello@elenamarchetti.com',
          phone: '+351 910 000 000',
          location: 'Lisbon, Portugal',
        },
        socials: [
          { platform: 'instagram', url: 'https://instagram.com' },
          { platform: 'behance', url: 'https://behance.net' },
          { platform: 'website', url: 'https://example.com' },
        ],
      },
    ],
  }
}
