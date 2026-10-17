import type { Block, Validate } from 'payload'

// A clip needs either a Videos library upload or an external MP4 URL.
const validateVideoSource: Validate = (value, { siblingData }) => {
  const sibling = siblingData as { media?: unknown } | undefined

  return sibling?.media || value
    ? true
    : 'Provide a video from the library or an external MP4 URL.'
}

export const FilmReel: Block = {
  slug: 'filmReel',
  interfaceName: 'FilmReelBlock',
  labels: {
    singular: 'Film Reel',
    plural: 'Film Reels',
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'On commission',
    },
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'A short statement about the work shown in the reel.',
      },
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'One short paragraph shown next to the film strip.',
      },
    },
    {
      name: 'videos',
      type: 'array',
      admin: {
        description:
          'Short clips threaded through the film strip. Upload a clip to the Videos library and pick it, or paste a direct MP4 URL.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          admin: {
            description:
              'Pick a clip from the Videos library. Takes precedence over the external URL below.',
          },
          relationTo: 'videos',
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description:
              'External MP4 URL, used when no video is selected above (e.g. https://assets.mixkit.co/videos/5218/5218-720.mp4).',
          },
          validate: validateVideoSource,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Short caption printed on the frame, e.g. "The first look".',
          },
        },
        {
          name: 'meta',
          type: 'text',
          admin: {
            description: 'Small detail, e.g. "Sintra · 2024".',
          },
        },
      ],
      labels: {
        singular: 'Clip',
        plural: 'Clips',
      },
      minRows: 1,
    },
  ],
}
