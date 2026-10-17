import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidateVideoChange, revalidateVideoDelete } from './Videos/hooks/revalidateVideo'
import { setClientUploadKey } from '../utilities/setClientUploadKey'
import { uploadthingThumbnail } from '../utilities/uploadthingThumbnail'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * The dedicated video library. Short clips are uploaded here (MP4/WebM) and
 * referenced by layout blocks such as the film reel, so editors can swap the
 * footage without touching code or external URLs.
 */
export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    group: 'Content',
    description: 'Upload short video clips here. Page blocks pick from this library.',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeValidate: [setClientUploadKey],
    afterChange: [revalidateVideoChange],
    afterDelete: [revalidateVideoDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'A short name for this clip, e.g. "The first look".',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional description shown with the clip.',
      },
    },
    {
      name: 'capturedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'd MMM yyy',
        },
        description: 'When the clip was captured.',
        position: 'sidebar',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/videos'),
    // Video files have no thumbnail size; show the file icon in the admin.
    adminThumbnail: uploadthingThumbnail,
    mimeTypes: ['video/mp4', 'video/webm', 'video/x-m4v', 'video/quicktime'],
  },
}
