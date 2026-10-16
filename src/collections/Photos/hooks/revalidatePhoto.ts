import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

const revalidatePhotoPaths = () => {
  // Photos can render anywhere, but the home page and layout are the common cases.
  revalidatePath('/')
  revalidatePath('/', 'layout')
}

export const revalidatePhotoChange: CollectionAfterChangeHook = ({ req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating pages affected by a photo change')
    revalidatePhotoPaths()
  }
}

export const revalidatePhotoDelete: CollectionAfterDeleteHook = ({ req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating pages affected by a photo delete')
    revalidatePhotoPaths()
  }
}
