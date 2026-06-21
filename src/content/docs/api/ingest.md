---
title: Document Ingestion
description: Ingest documents into the knowledge base with idempotent duplicate detection
---

Ingestion endpoints add documents to the SolidRusT AI knowledge base. Documents are automatically chunked, embedded via Qwen3-Embedding, and stored in Milvus for semantic search. Entity extraction runs in the background for knowledge graph enrichment.

## Idempotency

All ingestion is **idempotent** — submitting the same document multiple times is safe. The system detects duplicates via:

- **Content hash**: SHA-256 of document content detects exact duplicates
- **Source ID**: Same `source` + `source_id` combination is treated as an update/duplicate

If a duplicate is detected, the endpoint returns `"status": "duplicate"` without re-ingesting.

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data/v1/ingest/document` | POST | Ingest a single document |
| `/data/v1/ingest/batch` | POST | Ingest multiple documents |

---

## Single Document Ingestion

```
POST /data/v1/ingest/document
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | ✅ Yes | Full document text to ingest |
| `metadata.source` | string | ✅ Yes | Source identifier (e.g. `manual`, `wikipedia`, `eve_sde`) |
| `metadata.title` | string | ✅ Yes | Document title |
| `metadata.source_id` | string | No | Unique ID for deduplication |
| `metadata.url` | string | No | Source URL |
| `metadata.content_type` | string | No | Content category (e.g. `article`, `game_item`) |
| `metadata.tags` | string[] | No | Categorization tags |
| `metadata.custom` | object | No | Arbitrary custom metadata |

### Example

```bash
curl -X POST "https://api.solidrust.ai/data/v1/ingest/document" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Rate limits are enforced at 100 requests per second per customer...",
    "metadata": {
      "source": "manual",
      "source_id": "rate-limits-guide-v1",
      "title": "Rate Limiting Guide",
      "url": "https://docs.solidrust.ai/guides/rate-limits",
      "content_type": "docs",
      "tags": ["api", "rate-limits", "guide"]
    }
  }'
```

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def ingest_document(content: str, title: str, source: str, **kwargs) -> dict:
    """Ingest a single document into the knowledge base."""
    response = requests.post(
        f"{BASE_URL}/data/v1/ingest/document",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "content": content,
            "metadata": {
                "source": source,
                "title": title,
                **kwargs,
            },
        },
    )
    return response.json()

result = ingest_document(
    content="Rate limits are enforced at 100 requests per second...",
    title="Rate Limiting Guide",
    source="manual",
    source_id="rate-limits-guide-v1",
    url="https://docs.solidrust.ai/guides/rate-limits",
    content_type="docs",
    tags=["api", "rate-limits"],
)

print(f"Status: {result['status']}")
print(f"Document ID: {result['document_id']}")
print(f"Chunks created: {result['chunks_created']}")
```

### Response

**Success:**
```json
{
  "document_id": "chunk-1a2b3c",
  "chunks_created": 3,
  "status": "success",
  "message": "Entity extraction scheduled in background"
}
```

**Duplicate:**
```json
{
  "document_id": "chunk-prev-id",
  "chunks_created": 0,
  "status": "duplicate",
  "message": "Duplicate detected via content_hash"
}
```

---

## Batch Ingestion

```
POST /data/v1/ingest/batch
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `documents` | object[] | ✅ Yes | Array of documents, each with `content` and `metadata` (same as single ingest) |

### Example

```python
def ingest_batch(documents: list[dict]) -> dict:
    """Ingest multiple documents in one request."""
    response = requests.post(
        f"{BASE_URL}/data/v1/ingest/batch",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={"documents": documents},
    )
    return response.json()

docs = [
    {
        "content": "API keys are obtained from the console...",
        "metadata": {
            "source": "manual",
            "source_id": "api-keys-guide",
            "title": "API Keys Guide",
            "content_type": "docs",
        },
    },
    {
        "content": "Embeddings are 1024-dimensional vectors...",
        "metadata": {
            "source": "manual",
            "source_id": "embeddings-guide",
            "title": "Embeddings Guide",
            "content_type": "docs",
        },
    },
]

result = ingest_batch(docs)
print(f"Submitted: {result['total_documents']}, Success: {result['successful']}, Failed: {result['failed']}")
print(f"Total chunks: {result['total_chunks']}")

for i, r in enumerate(result["results"]):
    print(f"  Doc {i}: {r['status']} — {r['message'] or 'OK'}")
```

### Response

```json
{
  "total_documents": 2,
  "total_chunks": 6,
  "successful": 2,
  "failed": 0,
  "results": [
    {"document_id": "chunk-abc", "chunks_created": 3, "status": "success", "message": null},
    {"document_id": "chunk-def", "chunks_created": 3, "status": "success", "message": null}
  ]
}
```

## Processing Pipeline

When you ingest a document, the system:

1. **Deduplication check** — Content hash + source ID matching
2. **Chunking** — Document is split into overlapping chunks (~500 tokens)
3. **Embedding** — Each chunk gets a 1024-dimension vector via Qwen3-Embedding
4. **Milvus insert** — Chunks with embeddings are stored for semantic search
5. **MeiliSearch sync** — Chunks are indexed for keyword search
6. **Background extraction** — Entities and relationships are extracted and stored in Neo4j

Background extraction does **not** block the HTTP response — the document is searchable immediately after step 4.

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Missing required fields |
| 401 | `INVALID_API_KEY` | Missing or invalid API key |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `internal_error` | Ingestion pipeline failure |

## Related

- [Semantic Search](/api/semantic-search/) — Search the documents you ingest
- [Keyword Search](/api/keyword-search/) — Full-text search across ingested documents
- [RAG Applications Guide](/guides/rag/) — Building RAG pipelines
