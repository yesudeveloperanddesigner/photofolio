import React from 'react'

import type { FilmReelBlock as FilmReelBlockProps } from '@/payload-types'

import { FilmReelBlock } from './Component'

type Props = FilmReelBlockProps & {
  className?: string
}

export const FilmReel: React.FC<Props> = ({
  className,
  eyebrow,
  heading,
  description,
  videos,
  ...rest
}) => {
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
