---
title: Agent Tools
description: Complete list of tools available to the AI agent with full schemas and parameters
---

The AI agent has access to six built-in tools for searching the knowledge base, storing facts, and checking system health.

## List Tools

```
GET https://api.solidrust.ai/v1/agent/tools
```

```bash
curl "https://api.solidrust.ai/v1/agent/tools" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def list_tools() -> dict:
    response = requests.get(
        f"{BASE_URL}/v1/agent/tools",
        headers={"Authorization": f"Bearer {API_KEY}"},
    )
    return response.json()

tools = list_tools()
print(f"Agent has {tools['count']} tools:\n")
for tool in tools["tools"]:
    print(f"- {tool['name']}: {tool['description']}")
    print(f"  Params: {list(tool['parameters'].get('properties', {}).keys())}\n")
```

### Response

```json
{
  "tools": [
    {
      "name": "SemanticSearchTool",
      "description": "Search the knowledge base using semantic similarity",
      "parameters": { "type": "object", "properties": { "query": { "type": "string", "description": "..." }, ... } }
    }
  ],
  "count": 6
}
```

---

## Available Tools

### 1. SemanticSearchTool

Search the knowledge base using vector similarity. Best for conceptual and "how to" queries.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ Yes | — | Natural language search query |
| `limit` | integer | No | 10 | Maximum results (1–50) |
| `min_score` | float | No | 0.5 | Minimum similarity score (0.0–1.0) |
| `sources` | string[] | No | all | Filter by source names |

**When the agent uses it:** Questions about concepts, procedures, documentation queries.

---

### 2. KnowledgeGraphTool

Query entity relationships in the Neo4j knowledge graph.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity` | string | ✅ Yes | — | Entity name to query |
| `depth` | integer | No | 1 | Traversal depth (1–5) |
| `relationship_types` | string[] | No | all | Filter by relationship types |
| `direction` | string | No | both | `outgoing`, `incoming`, or `both` |

**When the agent uses it:** Questions about relationships between concepts, entity exploration.

---

### 3. HybridSearchTool

Combined semantic + graph search with entity extraction and configurable weighting.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | ✅ Yes | — | Search query |
| `semantic_weight` | float | No | 0.7 | Weight for semantic results (0.0–1.0) |
| `graph_weight` | float | No | 0.3 | Weight for graph results (0.0–1.0) |
| `entity_boost` | string[] | No | — | Entity names to boost |
| `limit` | integer | No | 10 | Maximum results (1–50) |

**When the agent uses it:** Complex queries needing both strategies, comprehensive research.

---

### 4. MemorySearchTool

Search companion memory across all stores: vector, keyword, graph, and knowledge base.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `companion_id` | string | No | `hermes` | Companion identifier |
| `query` | string | ✅ Yes | — | What to search for in memory |
| `max_results` | integer | No | 10 | Maximum results (1–50) |
| `search_knowledge_base` | boolean | No | true | Also search the knowledge base |

**When the agent uses it:** Questions about past conversations, user preferences, stored facts.

---

### 5. MemoryStoreTool

Store a fact or memory for future recall. Facts persist across conversations.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `companion_id` | string | No | `hermes` | Companion identifier |
| `content` | string | ✅ Yes | — | Memory content (clear factual statement) |
| `importance` | integer | No | 5 | Importance score 1–10 |
| `tags` | string[] | No | [] | Categorization tags |
| `source` | string | No | `agent` | Origin: `agent`, `conversation`, `compaction`, `manual` |

**When the agent uses it:** When it learns something important that should persist.

---

### 6. MemoryStatsTool

Check the health and population of the memory system.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `companion_id` | string | No | `hermes` | Companion identifier |

**When the agent uses it:** Verifying memory system health, understanding what's stored.

---

## Using Tools in Custom Pipelines

You can call tools directly through the respective API endpoints:

| Tool | Equivalent Direct Endpoint |
|------|---------------------------|
| SemanticSearchTool | `POST /data/v1/query/semantic` |
| KnowledgeGraphTool | `POST /data/v1/query/knowledge-graph` |
| HybridSearchTool | `POST /data/v1/query/hybrid` |
| MemorySearchTool | `POST /data/v1/memory/recall` (internal) |
| MemoryStoreTool | `POST /data/v1/memory/store` (internal) |
| MemoryStatsTool | `GET /data/v1/memory/stats` (internal) |

:::note
Memory tools (`MemorySearchTool`, `MemoryStoreTool`, `MemoryStatsTool`) access the Pantheon Data Layer memory system. These endpoints are available through the agent but have separate internal-only API paths.
:::

## Related

- [Agent Chat](/api/agent-chat/) — How to use tools in agent conversations
- [Semantic Search](/api/semantic-search/) — Direct semantic search endpoint
- [Graph Traversal](/api/graph/) — Direct graph query endpoints
- [Hybrid Search](/api/hybrid-search/) — Direct hybrid search endpoint
