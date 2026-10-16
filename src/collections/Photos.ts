import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { setClientUploadKey } from '../utilities/setClientUploadKey'
import { uploadthingThumbnail } from '../utilities/uploadthingThumbnail'
import { revalidatePhotoChange, revalidatePhotoDelete } from './Photos/hooks/revalidatePhoto'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * The dedicated photography library. Every image lives here as its own document
 * (with its own metadata) so it can be reused across galleries, blocks and pages.
 * Galleries and layout blocks reference these documents by relationship.
 */
export const Photos: CollectionConfig = {
  slug: 'photos',
  labels: {
    singular: 'Photo',
    plural: 'Photos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'orientation', 'featured', 'updatedAt'],
    group: 'Content',
    description: 'Upload photography here. Galleries and page blocks pick from this library.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeValidate: [setClientUploadKey],
    afterChange: [revalidatePhotoChange],
    afterDelete: [revalidatePhotoDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'A short name for this photo.',
      },
    },
    {
      name: 'alt',
      type: 'text',
      admin: {
        description: 'Describes the image for screen readers and SEO.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Shown with the image in galleries.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Keywords used to filter and group photographs.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
      labels: {
        singular: 'Tag',
        plural: 'Tags',
      },
    },
    {
      name: 'orientation',
      type: 'select',
      defaultValue: 'landscape',
      options: [
        { label: 'Landscape', value: 'landscape' },
        { label: 'Portrait', value: 'portrait' },
        { label: 'Square', value: 'square' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Used to lay the image out in galleries.',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'Where the photo was taken, e.g. "Lisbon, PT".',
      },
    },
    {
      name: 'shotAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyy',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'camera',
      type: 'text',
      admin: {
        description: 'Camera / lens / film, e.g. "Hasselblad 500CM · Portra 400".',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Prioritise this photo when a fallback selection is needed.',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/photos'),
    adminThumbnail: uploadthingThumbnail,
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
