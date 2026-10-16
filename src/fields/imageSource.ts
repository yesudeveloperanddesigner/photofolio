import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

type ImageSourceType = (options?: {
  name?: string
  required?: boolean
  overrides?: Partial<GroupField>
}) => Field

/**
 * A single image that can come from either the media library or an external URL.
 * External URLs are handy for placeholders while real photography is not uploaded yet.
 */
export const imageSource: ImageSourceType = ({
  name = 'image',
  required = false,
  overrides = {},
} = {}) => {
  const result: GroupField = {
    name,
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        name: 'media',
        type: 'upload',
        admin: {
          description: 'Pick an image from the media library.',
        },
        relationTo: 'media',
      },
      {
        name: 'url',
        type: 'text',
        admin: {
          description:
            'External image URL. Used when no media is selected (e.g. a placeholder).',
        },
      },
      {
        name: 'alt',
        type: 'text',
        admin: {
          description: 'Describes the image for screen readers and SEO.',
        },
      },
    ],
    validate: (value) => {
      if (!required) return true

      const data = value as { media?: unknown; url?: unknown } | undefined

      return data?.media || data?.url
        ? true
        : 'Provide a media upload or an external image URL.'
    },
  }

  return deepMerge(result, overrides)
}
