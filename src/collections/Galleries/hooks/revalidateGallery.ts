import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Gallery } from '../../../payload-types'

export const revalidateGalleryChange: CollectionAfterChangeHook<Gallery> = ({
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating pages affected by a gallery change')

    // Galleries render on the home page and can be featured anywhere.
    revalidatePath('/')
    revalidatePath('/', 'layout')
  }
}

export const revalidateGalleryDelete: CollectionAfterDeleteHook<Gallery> = ({
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating pages affected by a gallery delete')

    revalidatePath('/')
    revalidatePath('/', 'layout')
  }
}
