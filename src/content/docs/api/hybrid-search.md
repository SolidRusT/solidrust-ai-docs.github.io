---
title: Hybrid Search
description: Combined semantic + knowledge graph search with entity extraction and configurable weighting
---

Hybrid search combines semantic vector similarity with knowledge graph traversal for comprehensive results. It extracts entities from your query using a dictionary-based extractor, runs both vector and graph searches, then merges, deduplicates, and re-scores results.

## Endpoint

```
POST https://api.solidrust.ai/data/v1/query/hybrid
```

## Pipeline

1. **Entity extraction** — Extract entities from the query text (dictionary-based, no LLM)
2. **Vector search** — Semantic similarity search in Milvus
3. **Graph traversal** — For each extracted entity, traverse Neo4j knowledge graph
4. **Document resolution** — Resolve graph entities to Milvus documents
5. **Merge & re-score** — Combine results with configurable weights, deduplicate, sort

## Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ Yes | — | The search query text |
| `semantic_weight` | float | No | 0.7 | Weight for semantic results (0.0–1.0) |
| `graph_weight` | float | No | 0.3 | Weight for graph results (0.0–1.0) |
| `sources` | string[] | No | all | Filter results to specific sources |
| `entity_boost` | string[] | No | — | Entity names to boost in results |
| `limit` | integer | No | 10 | Maximum results (1–100) |
| `use_entity_extraction` | boolean | No | true | Extract entities from query text |
| `game` | string | No | — | Game domain for extraction (e.g. `eve`) |
| `use_graph` | boolean | No | true | Enable Neo4j graph traversal |
| `graph_depth` | integer | No | 2 | Max graph traversal depth (1–5) |

## Example Request

### curl

```bash
curl -X POST "https://api.solidrust.ai/data/v1/query/hybrid" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Python SDK authentication",
    "semantic_weight": 0.7,
    "graph_weight": 0.3,
    "use_graph": true,
    "graph_depth": 2,
    "limit": 10
  }'
```

### Python

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def hybrid_search(
    query: str,
    semantic_weight: float = 0.7,
    graph_weight: float = 0.3,
    entity_boost: list[str] | None = None,
    game: str | None = None,
    limit: int = 10,
) -> dict:
    """Combined semantic and knowledge graph search."""
    payload = {
        "query": query,
        "semantic_weight": semantic_weight,
        "graph_weight": graph_weight,
        "limit": limit,
    }
    if entity_boost:
        payload["entity_boost"] = entity_boost
    if game:
        payload["game"] = game
        payload["use_entity_extraction"] = True

    response = requests.post(
        f"{BASE_URL}/data/v1/query/hybrid",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
    )
    return response.json()

results = hybrid_search(
    query="How to use Python SDK for embeddings",
    semantic_weight=0.7,
    graph_weight=0.3,
    entity_boost=["Python", "embeddings"],
)

print(f"Found {results['total']} results (vector={results['vector_count']}, graph={results['graph_count']})")
for r in results["results"]:
    print(f"\nScore: {r['score']:.2f} [{r['origin']}]")
    print(f"  {r['title']}")
    print(f"  {r['content'][:150]}...")
```

### JavaScript

```javascript
async function hybridSearch(query, options = {}) {
  const payload = {
    query,
    semantic_weight: options.semanticWeight ?? 0.7,
    graph_weight: options.graphWeight ?? 0.3,
    limit: options.limit ?? 10,
  };
  if (options.entityBoost) payload.entity_boost = options.entityBoost;
  if (options.game) { payload.game = options.game; payload.use_entity_extraction = true; }

  const res = await fetch(`${BASE_URL}/data/v1/query/hybrid`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

## Example Response

```json
{
  "query": "Python SDK authentication",
  "entities_found": ["Python", "authentication"],
  "results": [
    {
      "id": "chunk-xyz",
      "title": "Python SDK Authentication",
      "content": "The Python SDK supports authentication via API key...",
      "source": "api-docs",
      "source_id": "python-auth",
      "content_type": "docs",
      "url": "https://docs.solidrust.ai/sdks/python",
      "score": 0.92,
      "origin": "both"
    }
  ],
  "total": 1,
  "vector_count": 3,
  "graph_count": 2,
  "merged_count": 1,
  "latency_ms": 128.5
}
```

## Tuning Weighting

| Use Case | semantic_weight | graph_weight | Why |
|----------|-----------------|--------------|-----|
| Concept questions | 0.9 | 0.1 | Semantic understanding matters most |
| Entity exploration | 0.3 | 0.7 | Graph relationships reveal connections |
| Balanced (default) | 0.7 | 0.3 | Good general-purpose mix |
| Code/API questions | 0.8 | 0.2 | Prefer semantic match for technical content |

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Missing or invalid parameters |
| 401 | `INVALID_API_KEY` | Missing or invalid API key |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 500 | `internal_error` | Search pipeline failure |

## Related

- [Graph Traversal](/api/graph/) — Direct graph traversal queries
- [Semantic Search](/api/semantic-search/) — Vector-only search
- [Knowledge Graph](/api/knowledge-graph/) — Entity relationship queries
- [RAG Applications Guide](/guides/rag/) — Building RAG pipelines
