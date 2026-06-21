---
title: Keyword Search
description: Full-text keyword search with typo tolerance via MeiliSearch
---

Keyword search performs full-text search across the knowledge base with typo tolerance and configurable sorting. Useful when searching for specific terms, error codes, or exact phrases.

## Endpoint

```
POST https://api.solidrust.ai/data/v1/query/keyword
```

## Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ Yes | — | The keyword search query |
| `limit` | integer | No | 10 | Maximum results (1–100) |
| `offset` | integer | No | 0 | Pagination offset |
| `sources` | string[] | No | all | Filter by source names |
| `content_type` | string | No | — | Filter by content type |
| `sort` | string | No | `relevance` | Sort order: `relevance` or `date` |

## Example Request

### curl

```bash
curl -X POST "https://api.solidrust.ai/data/v1/query/keyword" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "rate limit 429 error",
    "limit": 10,
    "sort": "relevance"
  }'
```

### Python

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def keyword_search(query: str, limit: int = 10, sort: str = "relevance") -> dict:
    """Full-text keyword search with typo tolerance."""
    response = requests.post(
        f"{BASE_URL}/data/v1/query/keyword",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "query": query,
            "limit": limit,
            "sort": sort
        }
    )
    return response.json()

results = keyword_search("rate limit 429 error")
print(f"Found {results['total']} results in {results['latency_ms']}ms")
for r in results["results"]:
    print(f"  {r['metadata'].get('title', 'Untitled')}")
    print(f"  {r['content'][:150]}...\n")
```

### JavaScript

```javascript
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.solidrust.ai';

async function keywordSearch(query, { limit = 10, sort = 'relevance' } = {}) {
  const res = await fetch(`${BASE_URL}/data/v1/query/keyword`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, limit, sort }),
  });
  return res.json();
}

const results = await keywordSearch('rate limit 429 error');
console.log(`Found ${results.total} results`);
results.results.forEach(r => {
  console.log(`  ${r.metadata?.title || 'Untitled'}`);
});
```

## Pagination

Use `offset` with `limit` for paginated results:

```python
page_1 = keyword_search("embeddings", limit=10, offset=0)
page_2 = keyword_search("embeddings", limit=10, offset=10)
```

## Sorting

| Sort Mode | Description |
|-----------|-------------|
| `relevance` | Ranked by keyword match relevance (default) |
| `date` | Sorted by document creation date |

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Missing or invalid parameters |
| 401 | `INVALID_API_KEY` | Missing or invalid API key |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |

## Related

- [Semantic Search](/api/semantic-search/) — Vector similarity search
- [Hybrid Search](/api/hybrid-search/) — Combined search with graph traversal
- [RAG Applications Guide](/guides/rag/) — Building RAG pipelines
