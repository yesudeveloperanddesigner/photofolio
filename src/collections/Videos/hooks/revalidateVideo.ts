import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

const revalidateVideoPaths = () => {
  // Videos can render anywhere, but the home page and layout are the common cases.
  revalidatePath('/')
  revalidatePath('/', 'layout')
}

export const revalidateVideoChange: CollectionAfterChangeHook = ({ req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating pages affected by a video change')
    revalidateVideoPaths()
  }
}

export const revalidateVideoDelete: CollectionAfterDeleteHook = ({ req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating pages affected by a video delete')
    revalidateVideoPaths()
  }
}
