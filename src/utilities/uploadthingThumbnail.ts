/**
 * UploadThing serves every stored object from a public CDN keyed by its
 * `_key`. Payload's built-in `thumbnailURL` field still generates a local
 * `/api/<collection>/file/...` path, so supply the CDN URL for admin
 * thumbnails when the storage plugin is active.
 */
export const uploadthingThumbnail = ({ doc }: { doc: Record<string, unknown> }): string => {
  const sizes = doc?.sizes as
    | Record<string, { _key?: string; url?: string } | undefined>
    | undefined
  const size = sizes?.thumbnail

  if (size?._key) return `https://utfs.io/f/${size._key}`
  if (size?.url) return size.url

  return ''
}
