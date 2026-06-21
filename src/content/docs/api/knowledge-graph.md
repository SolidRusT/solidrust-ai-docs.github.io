---
title: Knowledge Graph
description: Legacy entity relationship queries in the knowledge graph (Neo4j)
---

Queries the knowledge graph for entities and their relationships. Supports configurable traversal depth, direction, and relationship type filtering.

:::note
For richer graph capabilities including entity search and document resolution, see the newer [Graph Traversal](/api/graph/) endpoints.
:::

## Endpoint

```
POST https://api.solidrust.ai/data/v1/query/knowledge-graph
```

## Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity` | string | ✅ Yes | — | Entity name to query relationships for |
| `relationship_types` | string[] | No | all | Filter by relationship types |
| `direction` | string | No | `both` | Traversal direction: `outgoing`, `incoming`, `both` |
| `depth` | integer | No | 2 | Graph traversal depth (1–5) |
| `limit` | integer | No | 50 | Maximum results |

## Example Request

### curl

```bash
curl -X POST "https://api.solidrust.ai/data/v1/query/knowledge-graph" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entity": "Python",
    "relationship_types": ["uses", "implements", "related_to"],
    "direction": "both",
    "depth": 2,
    "limit": 50
  }'
```

### Python

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def knowledge_graph_query(
    entity: str,
    relationship_types: list[str] | None = None,
    direction: str = "both",
    depth: int = 2,
    limit: int = 50,
) -> dict:
    """Query entity relationships in the knowledge graph."""
    payload = {
        "entity": entity,
        "direction": direction,
        "depth": depth,
        "limit": limit,
    }
    if relationship_types:
        payload["relationship_types"] = relationship_types

    response = requests.post(
        f"{BASE_URL}/data/v1/query/knowledge-graph",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
    )
    return response.json()

result = knowledge_graph_query(
    entity="Authentication",
    direction="both",
    depth=2,
)

print(f"Found {len(result['entities'])} entities and {len(result['relationships'])} relationships")
for entity in result["entities"]:
    print(f"  {entity['name']} ({entity['entity_type']})")
for rel in result["relationships"]:
    print(f"  {rel['source']} —[{rel['relationship_type']}]→ {rel['target']}")
```

### JavaScript

```javascript
async function knowledgeGraphQuery(entity, options = {}) {
  const payload = {
    entity,
    direction: options.direction || 'both',
    depth: options.depth || 2,
    limit: options.limit || 50,
  };
  if (options.relationshipTypes) payload.relationship_types = options.relationshipTypes;

  const res = await fetch(`${BASE_URL}/data/v1/query/knowledge-graph`, {
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
  "entity": "Python",
  "entities": [
    {
      "id": "node-123",
      "name": "FastAPI",
      "entity_type": "framework",
      "properties": { "description": "Web framework for building APIs" }
    }
  ],
  "relationships": [
    {
      "source": "Python",
      "target": "FastAPI",
      "relationship_type": "has_framework",
      "properties": {}
    }
  ],
  "latency_ms": 23.4
}
```

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Missing or invalid parameters |
| 401 | `INVALID_API_KEY` | Missing or invalid API key |
| 503 | `service_unavailable` | Knowledge graph not enabled |

## Related

- [Graph Traversal](/api/graph/) — Newer graph endpoints with entity search and document resolution
- [Hybrid Search](/api/hybrid-search/) — Automatic graph + vector combination
- [Semantic Search](/api/semantic-search/) — Vector similarity search
