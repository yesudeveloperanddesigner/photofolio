---
name: vercel-ai-sdk
description: Use when building the AI layer with the Vercel AI SDK or OpenAI in this project — streaming chat, tool calling, prompt engineering, context budgeting, or token streaming to the UI. Triggers on "ai sdk", "streamText", "generateText", "useChat", "openai", "prompt", "completion", "model", "token", "tool call", or "context window".
---

# Vercel AI SDK / OpenAI (this project)

No AI SDK is installed yet. When adding it, use the **Vercel AI SDK** (`ai`
package) with a provider (`@ai-sdk/openai`) so streaming and tool-calling are
provider-agnostic.

## Wire-up

- Install `ai` and `@ai-sdk/openai`. Read the key from `OPENAI_API_KEY` — never
  hardcode or commit it, and never expose it to the client.
- Create a single model factory in `src/lib/ai/` (e.g. `getModel()`) so the
  model id and provider are configured in one place.
- Expose chat through a Next.js App Router route handler
  (`src/app/api/chat/route.ts`) using `streamText`, returning
  `result.toDataStreamResponse()` (or `toUIMessageStreamResponse`).
- Consume it in a `"use client"` component with `useChat` from `@ai-sdk/react`.
  Keep the client minimal; secrets stay server-side.

## Prompt engineering

- Keep system prompts versioned in code (e.g. `src/lib/ai/prompts.ts`), not
  inline strings scattered across routes.
- Give the model a clear role, explicit constraints, and output format. Prefer
  structured output (`generateObject` + a zod schema) over parsing prose.
- Ground answers in retrieved context (RAG): inject only relevant chunks and
  instruct the model to answer from them and cite sources.
- Set `temperature` deliberately: low (0–0.3) for extraction/structured tasks,
  higher for creative copy.

## Context window budgeting

- Estimate tokens before sending and cap the total. Reserve headroom for the
  response (`maxTokens`) and for tool results.
- Summarize or truncate older turns; keep the system prompt + most recent turns
  + retrieved context, in that priority order.
- Never dump whole files or tables into a prompt. Retrieve top-k relevant
  chunks and trim each to fit.
- Track usage from the SDK response (`usage.promptTokens`,
  `usage.completionTokens`) for cost monitoring.

## Token streaming

- Use `streamText` (not `generateText`) for anything user-facing; it streams
  deltas as they arrive.
- Support cancellation via `abortSignal` so a closed request stops generation.
- For tool calling, use `maxSteps` to allow multi-step loops, and stream tool
  call/result events alongside text.
- Handle errors mid-stream gracefully — surface a partial response rather than
  a blank UI, and log failures server-side.

## Checklist before finishing

- API key only read server-side from env; not present in client bundle.
- Route handler streams and supports abort.
- Prompt templates are centralized and versioned.
- Token budget is explicit (system + history + context + response).
- `pnpm lint` passes.
