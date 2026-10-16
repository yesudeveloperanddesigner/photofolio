import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { imageSource } from '@/fields/imageSource'
import { revalidateGalleryChange, revalidateGalleryDelete } from './Galleries/hooks/revalidateGallery'

export const Galleries: CollectionConfig = {
  slug: 'galleries',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGalleryChange],
    afterDelete: [revalidateGalleryDelete],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'featured', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      index: true,
      admin: {
        description: 'Optional short identifier, e.g. "selected-work".',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Use this gallery as the default one shown where a block has no gallery selected.',
      },
    },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'photos',
      hasMany: true,
      admin: {
        description:
          'Pick photos from the Photos library. These are shown in the gallery, in the order selected and take precedence over the inline images below.',
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
    },
  ],
}
