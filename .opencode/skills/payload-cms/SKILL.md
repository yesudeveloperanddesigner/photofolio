---
name: payload-cms
description: Use when working with Payload CMS 3.x in this repo — defining collections/globals/fields, querying with the Local API, writing access control, or adding lifecycle hooks. Triggers on "collection", "field", "Local API", "payload.find", "access control", "hook", "beforeChange", "afterRead", "src/payload.config.ts", or "generate:types".
---

# Payload CMS 3.x (this project)

Version **3.90.2** with `@payloadcms/db-postgres`. Config is in
`src/payload.config.ts`. Collections live in `src/collections/`, fields in
`src/fields/`, hooks in `src/hooks/`, access in `src/access/`.

## Type-safe collection schemas

- Define collections with `CollectionConfig` from `payload`. Give every
  collection an explicit `slug`.
- After any schema change run `pnpm generate:types` — this regenerates
  `src/payload-types.ts`, which the whole app imports. Never hand-edit
  `payload-types.ts`.
- Import generated types with `import type { Post } from '@/payload-types'`
  rather than redeclaring shapes.
- Add `admin.useAsTitle` to the field used as the row label.
- Prefer `payload.config.ts`-level `fields` helpers over duplicating field
  definitions across collections.

## Local API querying

- Server-side, use the Local API: `const payload = await getPayload({ config })`
  then `payload.find(...)`, `payload.findByID(...)`, `payload.create(...)`.
- The Local API bypasses HTTP and access control by default. Pass
  `overrideAccess: false` and a `user` when the query should respect access.
- Use `depth: 0` for lists where relationships are not needed — deep population
  is the most common performance trap.
- Use `where` with the Payload query operators (`equals`, `in`, `exists`,
  `near`, `or`, `and`) and `limit`/`page` for pagination. Never fetch all rows
  and filter in JS.
- In Next.js Server Components, reuse a cached `getPayload` instance; do not
  call it per request inside a render loop.

## Lifecycle automation hooks

- Hook phases: field-level (`beforeValidate`, `beforeChange`, `afterChange`,
  `afterRead`), collection-level (`beforeChange`, `afterChange`, `beforeDelete`,
  `afterDelete`, `afterRead`, `beforeOperation`).
- `beforeChange` mutates `data` (e.g. derive slug, set timestamps). `afterChange`
  is for side effects (revalidate, index, emit events).
- Hooks receive `{ req, operation, data, originalDoc, previousDoc }`. Use
  `req` to access `req.payload` and `req.user` — avoid importing a new payload
  instance inside hooks.
- Keep hooks pure and fast; push slow work (embeddings, external calls) to a
  job or an `afterChange` that schedules async work. Never block the write on a
  remote API call that can fail.

## Access control

- Access functions return `boolean` or a `Where` filter. Reuse the helpers in
  `src/access/` (e.g. `authenticated`, `anyone`) instead of inlining logic.
- Set `access` per operation (`read`, `create`, `update`, `delete`) explicitly.
  Omitting it does not mean "public" in a way you should rely on.

## Checklist before finishing

- Ran `pnpm generate:types` after schema changes.
- Local API calls specify `depth` and pass `overrideAccess: false` when user
  scoping matters.
- Hooks do not create circular imports between collections.
- `pnpm lint` passes.
