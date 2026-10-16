import type { CollectionBeforeValidateHook } from 'payload'

/**
 * Persists the object key for browser (client) uploads.
 *
 * When `clientUploads` is enabled, the browser uploads the original file to
 * UploadThing and sends back a signed receipt whose verified context carries
 * the storage `key`. The cloud-storage plugin skips re-uploading such files
 * (they already live in storage) and therefore never writes `data._key`, which
 * leaves the document's `url` empty. Copy the key onto the document so the
 * plugin's URL generation can resolve the CDN location.
 */
export const setClientUploadKey: CollectionBeforeValidateHook = ({ data, req }) => {
  const file = req?.file as { clientUploadContext?: { key?: unknown } } | undefined
  const key = file?.clientUploadContext?.key

  if (typeof key === 'string' && key.length > 0) {
    return { ...(data ?? {}), _key: key } as typeof data
  }

  return data
}
