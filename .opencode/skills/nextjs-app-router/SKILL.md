---
name: nextjs-app-router
description: Use when building or modifying Next.js App Router code in this repo — streaming UI, React Server Components, Server Actions, route handlers, Suspense/loading states, or wiring AGENTS.md context into prompts. Triggers on "server action", "route handler", "app/page.tsx", "RSC", "streaming", "use client", "generateMetadata", or "revalidate".
---

# Next.js App Router (this project)

Stack: **Next.js 16.3.3** App Router, **React 19.2.6**, TypeScript 5.7, Payload CMS 3.90.2 on PostgreSQL.
Source lives under `src/app/` with route groups `(frontend)` and `(payload)`.

## Streaming UI management

- Prefer React Server Components by default. Add `"use client"` only at the
  smallest leaf that needs state, effects, or browser APIs.
- Wrap slow data reads in `<Suspense fallback={...}>` so the shell streams
  immediately. Provide a `loading.tsx` per segment for route-level streaming.
- Use `next/dynamic` with `ssr: false` for client-only heavy widgets.
- For AI/chat responses, stream with a `ReadableStream` from a route handler
  and consume it on the client — do not buffer the whole response first.
- Keep server-only code (secrets, DB, Payload Local API) out of client
  components. Never import `payload` into a `"use client"` file.

## Server Actions

- Put actions in files with `"use server"` at the top; keep them in
  `src/app/**/actions.ts` or colocated `actions.ts`.
- Always validate input (zod or manual) before touching Payload or the DB.
- After a mutation call `revalidatePath()` / `revalidateTag()` so RSC data
  refreshes — never rely on manual client state sync.
- Return serializable values only; throw or return a typed error shape for the
  client to render with `useActionState`.
- Authenticate inside the action. Actions are public HTTP endpoints; do not
  assume a logged-in user.

## Route handlers

- Use `export async function GET/POST(request: Request)` in `route.ts`.
- Set `export const runtime = "nodejs"` when you need Payload, `pg`, or Node
  APIs; use `"edge"` only when there are no Node-only dependencies.
- Return `Response.json(...)` with correct status codes; stream with
  `new Response(stream)` and `Content-Type: text/event-stream` for SSE.

## AGENTS.md / context retrieval prompting

- `AGENTS.md` (and files under `docs/`) is the source of truth for project
  conventions. Read it before large changes and mirror its patterns.
- When injecting repo context into a prompt, retrieve only relevant files
  rather than dumping the tree: match on task keywords, then read the hits.
- Keep retrieved context bounded. Prefer file paths + fenced excerpts over
  whole-file dumps to stay within the context budget.

## Checklist before finishing

- Run `pnpm lint` and `pnpm generate:types` if Payload types changed.
- Confirm no server-only import leaked into a client component.
- Confirm mutations revalidate the affected paths/tags.
