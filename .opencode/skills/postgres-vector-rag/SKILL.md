---
name: postgres-vector-rag
description: Use when adding vector search or RAG to this project — pgvector indexes, embedding columns in Payload/PostgreSQL, similarity queries, or semantic search endpoints. Triggers on "pgvector", "embedding", "vector", "RAG", "similarity", "cosine distance", "semantic search", "chunking", or "retrieval".
---

# PostgreSQL vector store & RAG (this project)

Database is **PostgreSQL** via `@payloadcms/db-postgres`. There is no vector
store yet — this skill covers adding pgvector-based retrieval cleanly on top of
the existing Payload schema.

## Setup

- Enable the extension once: `CREATE EXTENSION IF NOT EXISTS vector;` (run via a
  migration or `pnpm payload migrate`).
- Store embeddings in a dedicated table (or a `vector` column on an existing
  table) rather than abusing JSON fields. Keep the embedding dimension and the
  model that produced it in the same row so re-embedding is detectable.
- Keep chunk text, source reference (`collection` + `docId`), chunk index, and
  model/version alongside the vector. You will need them for citations and for
  invalidating stale embeddings.
- Never commit raw connection strings. Read `DATABASE_URI` from the environment.

## Indexing

- pgvector index types: **HNSW** (`vector_cosine_ops`) for best recall/latency
  tradeoff, **IVFFlat** when write volume is high and you can tune `lists`.
- Match the operator class to the distance operator you query with:
  `vector_cosine_ops` → `<=>`, `vector_l2_ops` → `<->`, `vector_ip_ops` → `<#>`.
- Set HNSW `m` and `ef_construction`, and tune `hnsw.ef_search` per query.
- Add a normal B-tree index on source columns (`collection`, `docId`) so
  filtered retrieval stays fast.

## Semantic search logic

- Query pattern:
  `SELECT ..., embedding <=> $1 AS distance FROM chunks ORDER BY embedding <=> $1 LIMIT $2`.
- Apply metadata filters (collection, tenant, published) in the `WHERE` clause,
  not after fetching.
- Convert distance to a normalized score (`1 - distance` for cosine) before
  thresholding. Always set a minimum score; do not return low-relevance chunks.
- Optionally combine lexical (`tsvector` full-text) and vector results with
  Reciprocal Rank Fusion for hybrid search.

## Ingest pipeline

1. Extract text from the Payload document.
2. Chunk on semantic boundaries, with overlap; store `chunkIndex` and offsets.
3. Embed in batches; respect rate limits and retry with backoff.
4. Upsert by `(collection, docId, chunkIndex, model)` so re-indexing is
   idempotent.
5. Trigger ingestion from a Payload `afterChange` hook, but do the work async —
   never embed synchronously inside the request that saved the doc.

## Checklist before finishing

- Extension, table, and HNSW index created via a committed migration.
- Query uses the index operator class that matches its distance operator.
- Filters are in SQL, not post-filtering.
- Ingestion is idempotent and runs off the write path.
