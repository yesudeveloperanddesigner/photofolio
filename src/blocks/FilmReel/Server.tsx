import React from 'react'
import { getPayload } from 'payload'

import type { FilmReelBlock as FilmReelBlockProps } from '@/payload-types'
import configPromise from '@payload-config'

import { FilmReelBlock } from './Component'

type Props = FilmReelBlockProps & {
  className?: string
}

export const FilmReel: React.FC<Props> = async ({
  className,
  eyebrow,
  heading,
  description,
  source,
  videos,
  ...rest
}) => {
  const shouldUseLibrary = source !== 'manual'

  if (shouldUseLibrary) {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'videos',
      depth: 0,
      limit: 24,
      sort: '-createdAt',
    })

    const libraryVideos = docs.map((video) => {
      let meta: string | null | undefined
      if (video.capturedAt) {
        const date = new Date(video.capturedAt)
        if (!Number.isNaN(date.getTime())) {
          meta = date.getFullYear().toString()
        }
      }

      return {
        id: video.id,
        media: video as any,
        url: null,
        label: video.title || null,
        meta: meta || null,
      }
    })

    return (
      <FilmReelBlock
        {...rest}
        className={className}
        eyebrow={eyebrow}
        heading={heading}
        description={description}
        videos={libraryVideos as any}
      />
    )
  }

  return (
    <FilmReelBlock
      {...rest}
      className={className}
      eyebrow={eyebrow}
      heading={heading}
      description={description}
      videos={videos || []}
    />
  )
}
