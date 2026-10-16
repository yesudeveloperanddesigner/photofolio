import type { Media } from '@/payload-types'

import clsx from 'clsx'
import React from 'react'

import { getMediaUrl } from '@/utilities/getMediaUrl'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  logo?: Media | number | null | string
  logoDark?: Media | number | null | string
  logoText?: null | string
  priority?: 'auto' | 'high' | 'low'
  siteName?: null | string
}

const resolveUrl = (logo?: Media | number | null | string): string | null => {
  if (!logo || typeof logo !== 'object') return null

  return getMediaUrl(logo.url) || null
}

const resolveAlt = (logo: Media | number | null | string | undefined, fallback: string) => {
  if (logo && typeof logo === 'object' && logo.alt) return logo.alt

  return fallback
}

export const Logo = (props: Props) => {
  const {
    loading: loadingFromProps,
    priority: priorityFromProps,
    className,
    logo,
    logoDark,
    logoText,
    siteName,
  } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  const label = siteName || ''

  const lightUrl = resolveUrl(logo)
  const darkUrl = resolveUrl(logoDark)

  const imageClassName = clsx('h-8 w-auto max-w-[11rem] object-contain', className)

  if (lightUrl || darkUrl) {
    return (
      <>
        {lightUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            alt={resolveAlt(logo, label || 'Logo')}
            className={clsx(imageClassName, darkUrl && 'dark:hidden')}
            decoding="async"
            fetchPriority={priority}
            loading={loading}
            src={lightUrl}
          />
        )}
        {darkUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            alt={resolveAlt(logoDark, label || 'Logo')}
            className={clsx(imageClassName, lightUrl && 'hidden dark:block')}
            decoding="async"
            fetchPriority={priority}
            loading={loading}
            src={darkUrl}
          />
        )}
      </>
    )
  }

  const text = logoText || siteName

  if (!text) return null

  return (
    <span
      className={clsx(
        'text-lg font-medium tracking-[-0.02em] text-foreground',
        className,
      )}
    >
      {text}
    </span>
  )
}
