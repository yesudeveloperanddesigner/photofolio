import type { Block } from 'payload'

export const Practice: Block = {
  slug: 'practice',
  interfaceName: 'PracticeBlock',
  labels: {
    singular: 'Practice & Contact',
    plural: 'Practice & Contact',
  },
  fields: [
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
