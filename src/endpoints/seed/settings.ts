import type { Media } from '@/payload-types'

type SettingsArgs = {
  bannerImage: Media | number
  ogImage: Media | number
}

/**
 * Demo content for the Settings global. Kept in one place so the seed index
 * stays focused on orchestration.
 */
export const settingsSeed = ({ bannerImage, ogImage }: SettingsArgs) => ({
  contact: {
    email: 'hello@elenamarchetti.com',
    location: 'Lisbon, Portugal',
    phone: '+351 910 000 000',
  },
  description:
    'Documentary and editorial photography by Elena Marchetti — landscape, portraiture and the spaces in between.',
  footer: {
    copyright: '© {year} Elena Marchetti',
    dateTime: {
      display: 'currentDateTime' as const,
      label: 'Local time',
      show: true,
      timezone: 'Europe/Lisbon',
    },
    description:
      'A minimalist portfolio for a photographer working across landscape, portraiture and editorial commissions.',
    note: 'All photographs © the artist.',
  },
  header: {
    cta: {
      label: 'Get in touch',
      newTab: false,
      url: '/contact',
    },
    showSearch: true,
  },
  homeBanner: {
    eyebrow: 'Photography · Since 2009',
    image: bannerImage,
    location: 'Lisbon, Portugal',
    overlay: 45,
    subtitle:
      'Documentary and editorial photography across landscape, portraiture and the spaces in between.',
    title: 'Light, and the quiet moments it finds.',
  },
  logoText: 'Elena Marchetti',
  seo: {
    metaDescription:
      'Documentary and editorial photography by Elena Marchetti. Scroll-driven galleries, an about section, skills and contact.',
    metaTitle: 'Elena Marchetti — Photographer',
    ogImage,
  },
  siteName: 'Elena Marchetti',
  socials: [
    { platform: 'instagram' as const, url: 'https://instagram.com' },
    { platform: 'behance' as const, url: 'https://behance.net' },
    { platform: 'website' as const, url: 'https://example.com' },
  ],
  tagline: 'Documentary & editorial photographer',
})
