import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
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
      blockType: 'scrollGallery',
      eyebrow: 'Selected work',
      heading: 'A walk through the archive.',
      intro:
        'A rotating selection of personal and commissioned series. Scroll to move through the frames.',
      items: [
        {
          image: {
            alt: 'Coastal cliffs in fog',
            url: 'https://picsum.photos/seed/elena-01/1200/1600?grayscale',
          },
          caption: 'Quiet Coast',
          meta: '35mm · 2024',
        },
        {
          image: {
            alt: 'Portrait in window light',
            url: 'https://picsum.photos/seed/elena-02/1200/1600?grayscale',
          },
          caption: 'Ana, at home',
          meta: '50mm · 2024',
        },
        {
          image: {
            alt: 'Empty street at dawn',
            url: 'https://picsum.photos/seed/elena-03/1200/1600?grayscale',
          },
          caption: 'Before the City Wakes',
          meta: '28mm · 2023',
        },
        {
          image: {
            alt: 'Mountain ridge line',
            url: 'https://picsum.photos/seed/elena-04/1200/1600?grayscale',
          },
          caption: 'Above the Treeline',
          meta: 'Medium format · 2023',
        },
        {
          image: {
            alt: 'Still life on a table',
            url: 'https://picsum.photos/seed/elena-05/1200/1600?grayscale',
          },
          caption: 'Sunday Objects',
          meta: '85mm · 2022',
        },
        {
          image: {
            alt: 'Dancer mid-movement',
            url: 'https://picsum.photos/seed/elena-06/1200/1600?grayscale',
          },
          caption: 'Rehearsal',
          meta: '35mm · 2022',
        },
      ],
    },
    {
      blockType: 'photographerProfile',
      eyebrow: 'About',
      heading: 'I photograph the pause between moments.',
      bio: 'Elena Marchetti is a documentary and editorial photographer based in Lisbon. Her work moves between landscape, portraiture and the everyday, drawn to slow light and the small gestures that hold a story together. She works on long-term personal projects and commissions for publications, brands and cultural institutions.',
      images: [
        {
          image: {
            alt: 'Photographer at work',
            url: 'https://picsum.photos/seed/elena-studio/900/1200?grayscale',
          },
        },
        {
          image: {
            alt: 'Contact sheet detail',
            url: 'https://picsum.photos/seed/elena-contact/900/900?grayscale',
          },
        },
        {
          image: {
            alt: 'Field notes',
            url: 'https://picsum.photos/seed/elena-field/900/1125?grayscale',
          },
        },
        {
          image: {
            alt: 'Darkroom',
            url: 'https://picsum.photos/seed/elena-darkroom/900/675?grayscale',
          },
        },
        {
          image: {
            alt: 'On assignment',
            url: 'https://picsum.photos/seed/elena-assignment/900/1200?grayscale',
          },
        },
      ],
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
