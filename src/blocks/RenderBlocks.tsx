import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FilmReelBlock } from '@/blocks/FilmReel/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PhotographerProfileBlock } from '@/blocks/PhotographerProfile/Component'
import { PracticeBlock } from '@/blocks/Practice/Component'
import { ScrollBannerBlock } from '@/blocks/ScrollBanner/Component'
import { ScrollGalleryBlock } from '@/blocks/ScrollGallery/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  filmReel: FilmReelBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  photographerProfile: PhotographerProfileBlock,
  practice: PracticeBlock,
  scrollBanner: ScrollBannerBlock,
  scrollGallery: ScrollGalleryBlock,
}

// Blocks that should span the full width without the default vertical rhythm wrapper.
const fullBleedBlocks = new Set(['scrollBanner'])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              if (fullBleedBlocks.has(blockType)) {
                return (
                  // @ts-expect-error there may be some mismatch between the expected types here
                  <Block key={index} {...block} disableInnerContainer />
                )
              }

              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
