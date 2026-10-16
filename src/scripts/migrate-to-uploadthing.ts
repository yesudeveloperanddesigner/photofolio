import 'dotenv/config'

import { sql } from '@payloadcms/db-postgres'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createLocalReq, getPayload } from 'payload'

/**
 * One-off backfill that re-uploads media/photos documents created before the
 * project switched to UploadThing object storage. Documents uploaded through
 * the old local storage have no `_key`, so their files are read from the local
 * `public` directory and pushed to UploadThing.
 *
 * Legacy documents must be given a temporary `_key` first. The storage plugin
 * deletes an upload collection's previous files after a successful update; a
 * legacy document has no key to delete, which would abort the re-upload.
 *
 * Run with: pnpm exec tsx src/scripts/migrate-to-uploadthing.ts
 */
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const projectRoot = path.resolve(dirname, '../..')

const placeholderKey = '__uploadthing_backfill__'

const collections = [
  { slug: 'media' as const, table: 'media', staticDir: path.resolve(projectRoot, 'public/media') },
  { slug: 'photos' as const, table: 'photos', staticDir: path.resolve(projectRoot, 'public/photos') },
]

const sizeKeyColumns = [
  'sizes_thumbnail__key',
  'sizes_square__key',
  'sizes_small__key',
  'sizes_medium__key',
  'sizes_large__key',
  'sizes_xlarge__key',
  'sizes_og__key',
]

const run = async () => {
  const payload = await getPayload({ config })

  const existingUsers = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
  })

  const req = await createLocalReq({ user: existingUsers.docs[0] }, payload)
  // Revalidation hooks require a Next.js request context and are unnecessary here.
  req.context = { ...req.context, disableRevalidate: true }

  let migrated = 0

  for (const { slug, table, staticDir } of collections) {
    const result = await payload.find({
      collection: slug,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
    })

    const legacyDocs = (
      result.docs as Array<{
        _key?: string
        filename?: string
        id: number | string
        mimeType?: string
      }>
    ).filter((doc) => !doc._key || doc._key === placeholderKey)

    if (legacyDocs.length === 0) {
      payload.logger.info(`${slug}: nothing to migrate`)
      continue
    }

    const assignments = [`"_key" = '${placeholderKey}'`]
    for (const column of sizeKeyColumns) {
      assignments.push(`"${column}" = '${placeholderKey}'`)
    }

    await payload.db.drizzle.execute(
      sql.raw(
        `UPDATE "${table}" SET ${assignments.join(', ')} WHERE "_key" IS NULL OR "_key" = '${placeholderKey}'`,
      ),
    )

    for (const doc of legacyDocs) {
      if (!doc.filename) {
        payload.logger.warn(`${slug} id=${doc.id} has no filename, skipping`)
        continue
      }

      const filePath = path.resolve(staticDir, doc.filename)

      if (!fs.existsSync(filePath)) {
        payload.logger.warn(`${slug} id=${doc.id} local file not found: ${filePath}`)
        continue
      }

      const data = fs.readFileSync(filePath)

      payload.logger.info(`Uploading ${slug} id=${doc.id} (${doc.filename})...`)

      await payload.update({
        collection: slug,
        id: doc.id,
        data: {},
        file: {
          data,
          mimetype: doc.mimeType || 'application/octet-stream',
          name: doc.filename,
          size: data.length,
        },
        req,
      })

      migrated += 1
    }
  }

  payload.logger.info(`Done. Migrated ${migrated} document(s) to UploadThing.`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
