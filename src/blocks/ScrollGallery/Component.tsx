import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type {
  Gallery,
  Photo,
  ScrollGalleryBlock as ScrollGalleryBlockProps,
} from '@/payload-types'

import { ScrollGalleryView, type ScrollGalleryItem } from './View'

type Props = ScrollGalleryBlockProps & {
  className?: string
}

type ImageEntry = {
  caption?: null | string
  id?: null | number | string
  image?: unknown
  meta?: null | string
}

const isPopulated = <T,>(value: unknown): value is T =>
  Boolean(value && typeof value === 'object')

const photoMeta = (photo: Photo): string | undefined => {
  const year = photo.shotAt ? new Date(photo.shotAt).getFullYear() : undefined

  const parts = [photo.camera, photo.location, year?.toString()].filter(Boolean)

  return parts.length > 0 ? parts.join(' · ') : undefined
}

const fromPhoto = (photo: Photo): ScrollGalleryItem => ({
  caption: photo.caption || photo.title,
  id: photo.id,
  image: photo,
  meta: photoMeta(photo),
})

const fromEntry = (entry: ImageEntry): ScrollGalleryItem => ({
  caption: entry.caption,
  id: entry.id,
  image: entry.image as ScrollGalleryItem['image'],
  meta: entry.meta,
})

const usable = (items: ScrollGalleryItem[]) => items.filter((item) => item.image)

/**
 * Resolves the gallery to display:
 * 1. an explicitly selected gallery (populated by the page query, or an id),
 * 2. otherwise the featured gallery,
 * 3. otherwise the most recently updated gallery,
 * 4. otherwise null (the block falls back to individual photos or inline items).
 */
const getGallery = cache(async (gallery: Props['gallery']): Promise<Gallery | null> => {
  if (gallery && typeof gallery === 'object') return gallery

  const payload = await getPayload({ config: configPromise })

  if (typeof gallery === 'number' || typeof gallery === 'string') {
    try {
      return await payload.findByID({ collection: 'galleries', id: gallery, depth: 2 })
    } catch {
      return null
    }
  }

  const featured = await payload.find({
    collection: 'galleries',
    depth: 2,
    limit: 1,
    sort: '-updatedAt',
    where: { featured: { equals: true } },
  })

  if (featured.docs?.length) return featured.docs[0]

  const latest = await payload.find({
    collection: 'galleries',
    depth: 2,
    limit: 1,
    sort: '-updatedAt',
  })

  return latest.docs?.[0] ?? null
})

export const ScrollGalleryBlock: React.FC<Props> = async ({
  className,
  eyebrow,
  heading,
  intro,
  items,
  gallery,
  photos,
}) => {
  const galleryDoc = await getGallery(gallery)

  const galleryPhotos = (galleryDoc?.photos || []).filter(isPopulated<Photo>)
  const galleryImages = (galleryDoc?.images || []).map((entry) => fromEntry(entry))
  const libraryPhotos = (photos || []).filter(isPopulated<Photo>)

  let resolvedItems: ScrollGalleryItem[] = []

  if (galleryPhotos.length > 0) {
    resolvedItems = galleryPhotos.map(fromPhoto)
  } else if (galleryImages.length > 0) {
    resolvedItems = galleryImages
  } else if (libraryPhotos.length > 0) {
    resolvedItems = libraryPhotos.map(fromPhoto)
  } else {
    resolvedItems = (items || []).map((entry) => fromEntry(entry))
  }

  const usableItems = usable(resolvedItems)

  if (usableItems.length === 0) return null

  return (
    <ScrollGalleryView
      className={className}
      eyebrow={eyebrow}
      heading={heading}
      intro={intro}
      items={usableItems}
    />
  )
}
