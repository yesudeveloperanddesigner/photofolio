import 'dotenv/config'

import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed } from '@/endpoints/seed'

/**
 * Seeds the database with demo content (photos, gallery, pages, posts, settings).
 * Run with: pnpm exec tsx src/scripts/seed.ts
 *
 * Warning: this clears the collections listed in `src/endpoints/seed/index.ts`.
 */
const run = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
  })

  const user =
    existing.docs[0] ??
    (await payload.create({
      collection: 'users',
      data: {
        email: 'seed@example.com',
        name: 'Seed User',
        password: 'password',
      },
    }))

  const req = await createLocalReq({ user }, payload)

  await seed({ payload, req })

  payload.logger.info('Seeded database successfully!')
  process.exit(0)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
