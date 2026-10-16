import type { Block } from 'payload'

import { imageSource } from '@/fields/imageSource'

export const ScrollGallery: Block = {
  slug: 'scrollGallery',
  interfaceName: 'ScrollGalleryBlock',
  labels: {
    singular: 'Scroll Gallery',
    plural: 'Scroll Galleries',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Selected work',
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Optional large heading above the gallery.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
    },
    {
      name: 'gallery',
      type: 'relationship',
      admin: {
        description:
          'Pick a gallery from the Galleries collection. Leave empty to use individual photos or the featured gallery.',
      },
      relationTo: 'galleries',
    },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'photos',
      hasMany: true,
      admin: {
        description:
          'Pick photos directly from the Photos library. Used when no gallery is selected above and takes precedence over the inline images below.',
      },
    },
    {
      name: 'items',
      type: 'array',
      admin: {
        description:
          'Fallback inline images. Only used when no gallery or photos are available (e.g. before seeding).',
        initCollapsed: true,
      },
      fields: [
        imageSource({ name: 'image', required: true }),
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'meta',
          type: 'text',
          admin: {
            description: 'Short detail, e.g. "35mm · Lisbon · 2024".',
          },
        },
      ],
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      minRows: 1,
    },
  ],
}
