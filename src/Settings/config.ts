import type { GlobalConfig } from 'payload'

import { revalidateSettings } from './hooks/revalidateSettings'

/**
 * Site-wide settings that editors control from the admin dashboard.
 * Everything here is read on the frontend through `getCachedGlobal('settings')`.
 */
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Settings',
    description: 'Global content for the whole website — identity, contact, SEO, banner and footer.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identity',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'Elena Marchetti',
              admin: {
                description: 'Used as the site title, in the header, footer and SEO.',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              admin: {
                description: 'A short line shown beneath the name or logo.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: {
                description: 'The default description used for SEO and social sharing.',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Logo used on light backgrounds. Falls back to the site name as text.',
              },
            },
            {
              name: 'logoDark',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Optional logo used on dark backgrounds (header/footer in dark mode).',
              },
            },
            {
              name: 'logoText',
              type: 'text',
              admin: {
                description: 'Text shown instead of a logo image, e.g. "Elena Marchetti".',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Optional favicon override.',
              },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
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
                  admin: {
                    description: 'e.g. "Lisbon, Portugal".',
                  },
                },
                {
                  name: 'address',
                  type: 'textarea',
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
                    { label: 'YouTube', value: 'youtube' },
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
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  admin: {
                    description: 'Default page title used when a page has no SEO title of its own.',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  admin: {
                    description: 'Default meta description.',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Default social sharing image (1200×630 recommended).',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Header',
          fields: [
            {
              name: 'header',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'showSearch',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Show the search icon in the header',
                },
                {
                  name: 'cta',
                  type: 'group',
                  label: 'Header call-to-action (optional)',
                  admin: {
                    hideGutter: true,
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      admin: {
                        description: 'Leave the label and URL empty to hide the button.',
                      },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      admin: {
                        description: 'Where the button links, e.g. "/contact".',
                      },
                    },
                    {
                      name: 'newTab',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Open in a new tab',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Homepage banner',
          fields: [
            {
              name: 'homeBanner',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'The full-bleed image in the first section of the landing page.',
                  },
                },
                {
                  name: 'eyebrow',
                  type: 'text',
                  defaultValue: 'Photography · Since 2009',
                },
                {
                  name: 'title',
                  type: 'text',
                  admin: {
                    description: 'The large statement. Scroll reveals it word by word.',
                  },
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
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footer',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'description',
                  type: 'textarea',
                  admin: {
                    description: 'A short blurb shown in the footer.',
                  },
                },
                {
                  name: 'copyright',
                  type: 'text',
                  admin: {
                    description: 'Copyright line. Use {year} for the current year.',
                  },
                },
                {
                  name: 'note',
                  type: 'text',
                  admin: {
                    description: 'Small print, e.g. "All photographs © the artist".',
                  },
                },
                {
                  name: 'dateTime',
                  type: 'group',
                  label: 'Date & time',
                  fields: [
                    {
                      name: 'show',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Show date & time in the footer',
                    },
                    {
                      name: 'label',
                      type: 'text',
                      defaultValue: 'Local time',
                    },
                    {
                      name: 'display',
                      type: 'select',
                      defaultValue: 'currentDate',
                      options: [
                        { label: 'Current date', value: 'currentDate' },
                        { label: 'Current time', value: 'currentTime' },
                        { label: 'Current date & time', value: 'currentDateTime' },
                        { label: 'Custom text', value: 'custom' },
                        { label: 'Hidden', value: 'none' },
                      ],
                      admin: {
                        condition: (_, siblingData) => siblingData?.show !== false,
                      },
                    },
                    {
                      name: 'customText',
                      type: 'text',
                      admin: {
                        condition: (_, siblingData) =>
                          siblingData?.show !== false && siblingData?.display === 'custom',
                        description: 'Used when "Custom text" is selected above.',
                      },
                    },
                    {
                      name: 'timezone',
                      type: 'text',
                      defaultValue: 'Europe/Lisbon',
                      admin: {
                        condition: (_, siblingData) =>
                          siblingData?.show !== false &&
                          siblingData?.display !== 'custom' &&
                          siblingData?.display !== 'none',
                        description: 'IANA time zone, e.g. "Europe/Lisbon" or "UTC".',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSettings],
  },
}
