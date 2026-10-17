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
      },
      {
        blockName: 'Film reel',
        blockType: 'filmReel',
        eyebrow: 'On commission',
        heading: 'Weddings, birthdays, and everything in between.',
        description:
          'Commissioned films for weddings, birthdays and gatherings — small documentaries of the day, edited to keep the feeling of the room. Thread the reel to see the work.',
        videos: [
          {
            url: 'https://assets.mixkit.co/videos/5218/5218-720.mp4',
            label: 'The newlyweds',
            meta: 'Sintra · 2024',
          },
          {
            url: 'https://assets.mixkit.co/videos/5224/5224-720.mp4',
            label: 'The bouquet walk',
            meta: 'Cascais · 2024',
          },
          {
            url: 'https://assets.mixkit.co/videos/5112/5112-720.mp4',
            label: 'Make a wish',
            meta: 'Alfama · 2023',
          },
          {
            url: 'https://assets.mixkit.co/videos/4694/4694-720.mp4',
            label: 'The birthday table',
            meta: 'Príncipe Real · 2023',
          },
          {
            url: 'https://assets.mixkit.co/videos/51541/51541-720.mp4',
            label: 'A toast to the room',
            meta: 'Lisbon · 2022',
          },
          {
            url: 'https://assets.mixkit.co/videos/4606/4606-720.mp4',
            label: 'Dance floor light',
            meta: 'Porto · 2022',
          },
        ],
      },
      {
        blockName: 'Practice & Contact',
        blockType: 'practice',
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
