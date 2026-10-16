import type { Block } from 'payload'

import { imageSource } from '@/fields/imageSource'

export const ScrollBanner: Block = {
  slug: 'scrollBanner',
  interfaceName: 'ScrollBannerBlock',
  labels: {
    singular: 'Scroll Banner',
    plural: 'Scroll Banners',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Small label shown above the title.',
      },
      defaultValue: 'Photography',
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'The large statement. Scroll reveals it word by word.',
      },
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Shown in the corner, e.g. "Lisbon, PT".',
      },
    },
    imageSource({ name: 'image' }),
    {
      name: 'overlay',
      type: 'number',
      defaultValue: 45,
      min: 0,
      max: 90,
      admin: {
        description: 'Darken the image so the text stays legible (0–90).',
        step: 5,
      },
    },
  ],
}
