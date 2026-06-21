---
title: Semantic Search
description: Semantic vector search across the knowledge base using Milvus embeddings
---

The semantic search endpoint performs similarity search across the knowledge base using vector embeddings. Documents are ranked by semantic similarity to your query, finding conceptually related content even when keywords don't match.

## Endpoint

```
POST https://api.solidrust.ai/data/v1/query/semantic
```

## Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ Yes | — | Natural language search query |
| `sources` | string[] | No | all | Filter results to specific source names |
| `limit` | integer | No | 10 | Maximum results (1–100) |
| `min_score` | float | No | 0.5 | Minimum similarity score threshold (0.0–1.0) |
| `filters` | object | No | — | Additional metadata key-value filters |

## Example Request

### curl

```bash
curl -X POST "https://api.solidrust.ai/data/v1/query/semantic" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I implement authentication?",
    "limit": 5,
    "min_score": 0.5
  }'
```

### Python

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def semantic_search(query: str, limit: int = 10, min_score: float = 0.5) -> dict:
    """Search the knowledge base using semantic similarity."""
    response = requests.post(
        f"{BASE_URL}/data/v1/query/semantic",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "query": query,
            "limit": limit,
            "min_score": min_score
        }
    )
    return response.json()

results = semantic_search("How do I implement authentication?")
print(f"Found {results['total']} results in {results['latency_ms']}ms")
for r in results["results"]:
    print(f"\nScore: {r['score']:.2f} — {r['metadata'].get('title', 'Untitled')}")
    print(f"  {r['content'][:150]}...")
```

### JavaScript

```javascript
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.solidrust.ai';

async function semanticSearch(query, { limit = 10, minScore = 0.5 } = {}) {
  const res = await fetch(`${BASE_URL}/data/v1/query/semantic`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, limit, min_score: minScore }),
  });
  return res.json();
}

const results = await semanticSearch('How do I implement authentication?');
console.log(`Found ${results.total} results in ${results.latency_ms}ms`);
results.results.forEach(r => {
  console.log(`  ${r.score.toFixed(2)} — ${r.metadata?.title || 'Untitled'}`);
});
```

## Example Response

```json
{
  "query": "How do I implement authentication?",
  "results": [
    {
      "id": "chunk-abc123",
      "content": "Authentication is handled via API keys...",
      "score": 0.87,
      "metadata": {
        "source": "api-docs",
        "source_id": "auth-guide",
        "title": "Authentication Guide",
        "url": "https://docs.solidrust.ai/api/overview",
        "content_type": "docs"
      }
    }
  ],
  "total": 1,
  "latency_ms": 45.2
}
```

## Filtering by Source

Narrow results to specific document sources:

```python
results = requests.post(
    f"{BASE_URL}/data/v1/query/semantic",
    headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    json={
        "query": "rate limits",
        "sources": ["api-docs", "guides"],
        "min_score": 0.6
    }
).json()
```

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Missing or invalid parameters |
| 401 | `INVALID_API_KEY` | Missing or invalid API key |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |

## Related

- [Hybrid Search](/api/hybrid-search/) — Combine semantic + knowledge graph
- [Keyword Search](/api/keyword-search/) — Full-text exact match search
- [RAG Applications Guide](/guides/rag/) — Building RAG pipelines
