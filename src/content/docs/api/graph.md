---
title: Graph Traversal
description: Knowledge graph traversal with entity search and document resolution via Neo4j + Milvus
---

Graph traversal endpoints let you explore the knowledge graph's entity-relationship network. You can traverse from a starting entity, search for entities by name, and resolve graph-connected entities to actual searchable documents.

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data/v1/query/graph` | POST | Traverse graph from an entity |
| `/data/v1/query/graph/search` | POST | Search entities by name |
| `/data/v1/query/graph/entity/{name}` | GET | Get single entity by exact name |
| `/data/v1/query/graph/documents` | POST | Traverse + resolve entities to documents |

---

## Graph Traversal

Traverse connected entities and relationships from a starting entity.

```
POST /data/v1/query/graph
```

### Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity_name` | string | ✅ Yes | — | Starting entity name |
| `relationship_types` | string[] | No | all | Filter by relationship types |
| `direction` | string | No | `both` | Traversal direction: `in`, `out`, `both` |
| `depth` | integer | No | 2 | How many hops (1–5) |
| `limit` | integer | No | 50 | Maximum entities (1–200) |

### Example

```bash
curl -X POST "https://api.solidrust.ai/data/v1/query/graph" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "entity_name": "Nightmare",
    "relationship_types": ["requires", "has_module"],
    "direction": "both",
    "depth": 2,
    "limit": 50
  }'
```

```python
import requests

def graph_traversal(entity_name: str, depth: int = 2, rel_types: list[str] = None) -> dict:
    response = requests.post(
        f"{BASE_URL}/data/v1/query/graph",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={
            "entity_name": entity_name,
            "relationship_types": rel_types,
            "depth": depth,
            "limit": 50,
        },
    )
    return response.json()

result = graph_traversal("Nightmare", depth=2)

print(f"Found {result['total_entities']} entities, {result['total_relationships']} relationships")
for entity in result["entities_found"]:
    print(f"  {entity['name']} ({entity['entity_type']})")
for rel in result["relationships"]:
    print(f"  {rel['source_name']} —[{rel['relationship_type']}]→ {rel['target_name']}")
```

### Response

```json
{
  "entity_name": "Nightmare",
  "entities_found": [
    {"id": "node-1", "name": "Nightmare", "entity_type": "ship", "properties": {}},
    {"id": "node-2", "name": "Caldari Navy", "entity_type": "faction", "properties": {}}
  ],
  "relationships": [
    {"source_name": "Nightmare", "target_name": "Caldari Navy", "relationship_type": "requires", "properties": {}}
  ],
  "total_entities": 2,
  "total_relationships": 1
}
```

---

## Entity Search

Search for entities by name (case-insensitive contains match).

```
POST /data/v1/query/graph/search
```

### Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ Yes | — | Search text (substring match) |
| `entity_type` | string | No | — | Filter by entity type |
| `limit` | integer | No | 20 | Maximum results (1–100) |

### Example

```python
def search_entities(query: str, entity_type: str = None) -> dict:
    response = requests.post(
        f"{BASE_URL}/data/v1/query/graph/search",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={"query": query, "entity_type": entity_type, "limit": 20},
    )
    return response.json()

result = search_entities("night", entity_type="ship")
for entity in result["results"]:
    print(f"  {entity['name']} ({entity['entity_type']})")
```

---

## Get Entity by Name

Look up a single entity by exact name match.

```
GET /data/v1/query/graph/entity/{entity_name}
```

```bash
curl "https://api.solidrust.ai/data/v1/query/graph/entity/Nightmare" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Returns `null` if the entity is not found.

---

## Graph Documents (Traversal + Resolution)

The most powerful graph endpoint — traverses from an entity and resolves connected entities to Milvus documents so you can search them.

```
POST /data/v1/query/graph/documents
```

### Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity_name` | string | ✅ Yes | — | Starting entity name |
| `entity_type` | string | No | — | Optional entity type filter |
| `relationship_types` | string[] | No | all | Filter by relationship types |
| `max_depth` | integer | No | 2 | Max traversal depth (1–5) |
| `limit` | integer | No | 20 | Max documents (1–100) |
| `resolve_documents` | boolean | No | true | Resolve entities to Milvus documents |

### Example

```python
def graph_documents(entity_name: str, max_depth: int = 2, limit: int = 20) -> dict:
    response = requests.post(
        f"{BASE_URL}/data/v1/query/graph/documents",
        headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
        json={
            "entity_name": entity_name,
            "max_depth": max_depth,
            "limit": limit,
            "resolve_documents": True,
        },
    )
    return response.json()

result = graph_documents("Nightmare", max_depth=2)

print(f"Found {result['total']} documents related to '{result['entity_name']}'")
print(f"Related entities: {', '.join(result['related_entities'])}")

for doc in result["results"]:
    print(f"\n{doc['title']} (score: {doc['score']:.2f}, via: {doc['relationship']})")
    print(f"  {doc['content'][:150]}...")
```

### Response

```json
{
  "entity_name": "Nightmare",
  "entity_type": null,
  "results": [
    {
      "id": "doc-abc",
      "title": "Nightmare",
      "content": "The Nightmare is a Caldari Navy battleship...",
      "source": "eve_sde",
      "source_id": "ship_nightmare",
      "content_type": "game_item",
      "url": null,
      "score": 1.0,
      "relationship": "self",
      "related_entity": null
    }
  ],
  "related_entities": ["Caldari Navy", "Shield Extender II"],
  "total": 1
}
```

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Missing or invalid parameters |
| 401 | `INVALID_API_KEY` | Missing or invalid API key |
| 503 | `service_unavailable` | Neo4j graph store unavailable |

## Related

- [Knowledge Graph](/api/knowledge-graph/) — Legacy entity relationship queries
- [Hybrid Search](/api/hybrid-search/) — Automatic graph + vector combination
- [Semantic Search](/api/semantic-search/) — Vector-only search
