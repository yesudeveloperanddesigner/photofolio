'use client'

import NextImage from 'next/image'
import React from 'react'

import type { Media, Photo } from '@/payload-types'

import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

export type PortfolioImageDoc = Media | Photo

/**
 * An image can be provided in three shapes:
 * - an `imageSource` group `{ media, url, alt }` (inline upload or external URL),
 * - a `Media`/`Photo` document (from an upload collection), or
 * - `null`/`undefined`.
 */
export type PortfolioImageValue =
  | {
      alt?: string | null
      media?: Media | number | string | null
      url?: string | null
    }
  | PortfolioImageDoc
  | null
  | undefined

type Props = {
  fill?: boolean
  image?: PortfolioImageValue
  imgClassName?: string
  priority?: boolean
  sizes?: string
  width?: number
  height?: number
}

const isDoc = (value: unknown): value is PortfolioImageDoc => {
  return Boolean(value && typeof value === 'object' && 'url' in (value as object) && !('media' in (value as object)))
}

/**
 * Renders an image that may come from the media library, the photos library or
 * an external URL. When `fill` is used the parent must be positioned (`relative`)
 * and clipped.
 */
export const PortfolioImage: React.FC<Props> = ({
  fill,
  image,
  imgClassName,
  priority,
  sizes,
  width,
  height,
}) => {
  if (!image) return null

  let src = ''
  let alt = ''
  let resolvedWidth = width
  let resolvedHeight = height

  if (isDoc(image)) {
    src = getMediaUrl(image.url)
    if (image.width) resolvedWidth = resolvedWidth ?? image.width
    if (image.height) resolvedHeight = resolvedHeight ?? image.height
    if (image.alt) alt = image.alt
  } else {
    alt = image.alt || ''

    if (image.media && typeof image.media === 'object') {
      const media = image.media as Media
      src = getMediaUrl(media.url)
      if (media.width) resolvedWidth = resolvedWidth ?? media.width
      if (media.height) resolvedHeight = resolvedHeight ?? media.height
      if (media.alt) alt = media.alt
    } else if (image.url) {
      src = image.url
    }
  }

  if (!src) return null

  if (fill) {
    return (
      <NextImage
        alt={alt}
        className={cn('h-full w-full object-cover', imgClassName)}
        fill
        priority={priority}
        quality={100}
        sizes={sizes ?? '100vw'}
        src={src}
      />
    )
  }

  return (
    <NextImage
      alt={alt}
      className={cn(imgClassName)}
      height={resolvedHeight ?? 1200}
      priority={priority}
      quality={100}
      sizes={sizes}
      src={src}
      width={resolvedWidth ?? 1600}
    />
  )
}
