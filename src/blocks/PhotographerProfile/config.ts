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
    {
      name: 'skills',
      type: 'array',
      admin: {
        description: 'Specialities shown as a list of tags.',
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
        singular: 'Skill',
        plural: 'Skills',
      },
    },
    {
      name: 'contact',
      type: 'group',
      admin: {
        hideGutter: true,
      },
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'location',
          type: 'text',
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'platform',
          type: 'select',
          defaultValue: 'instagram',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Behance', value: 'behance' },
            { label: 'X', value: 'x' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Vimeo', value: 'vimeo' },
            { label: 'Website', value: 'website' },
            { label: 'Other', value: 'other' },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
      labels: {
        singular: 'Social link',
        plural: 'Social links',
      },
    },
  ],
}
