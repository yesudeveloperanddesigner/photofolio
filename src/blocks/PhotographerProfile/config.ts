import type { Block } from 'payload'

import { imageSource } from '@/fields/imageSource'

export const PhotographerProfile: Block = {
  slug: 'photographerProfile',
  interfaceName: 'PhotographerProfileBlock',
  labels: {
    singular: 'Photographer Profile',
    plural: 'Photographer Profiles',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'About',
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'A short statement about the photographer.',
      },
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'One or two paragraphs of description.',
      },
    },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'photos',
      hasMany: true,
      admin: {
        description:
          'Pick photos from the Photos library for the masonry cluster. Takes precedence over the inline images below.',
      },
    },
    {
      name: 'images',
      type: 'array',
      admin: {
        description:
          'Fallback inline images used only when no photos are selected above (e.g. before the library is filled).',
        initCollapsed: true,
      },
      fields: [imageSource({ name: 'image', required: true })],
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
    },
  ],
}
