---
title: RAG Applications
description: Build retrieval-augmented generation applications with SolidRusT AI
---

Retrieval-Augmented Generation (RAG) combines document retrieval with AI generation to provide accurate, context-aware responses.

## Overview

RAG enhances LLM responses by:

1. **Retrieving** relevant documents from a knowledge base
2. **Augmenting** the prompt with retrieved context
3. **Generating** responses grounded in the retrieved information

## SolidRusT AI Data Layer

The SolidRusT AI platform includes a built-in data layer with multiple query types:

| Endpoint | Description | Best For |
|----------|-------------|----------|
| `POST /data/v1/query/semantic` | Vector similarity search | Finding conceptually similar content |
| `POST /data/v1/query/keyword` | Full-text keyword search | Exact term matching |
| `POST /data/v1/query/hybrid` | Combined semantic + knowledge graph | Complex queries needing both approaches |
| `POST /data/v1/query/knowledge-graph` | Entity relationship traversal | Exploring connections between concepts |

## Semantic Search

Find documents based on meaning, not just keywords.

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

# Search for relevant documents
results = semantic_search("How do I implement authentication?")

print(f"Found {results['total']} results in {results['latency_ms']}ms")
for result in results["results"]:
    print(f"\nScore: {result['score']:.2f}")
    print(f"Source: {result['metadata'].get('source', 'unknown')}")
    print(f"Content: {result['content'][:200]}...")
```

### JavaScript

```javascript
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.solidrust.ai';

async function semanticSearch(query, limit = 10, minScore = 0.5) {
  const response = await fetch(`${BASE_URL}/data/v1/query/semantic`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      limit,
      min_score: minScore,
    }),
  });
  return response.json();
}

// Usage
const results = await semanticSearch('How do I implement authentication?');
console.log(`Found ${results.total} results in ${results.latency_ms}ms`);

results.results.forEach((result) => {
  console.log(`\nScore: ${result.score.toFixed(2)}`);
  console.log(`Source: ${result.metadata?.source || 'unknown'}`);
  console.log(`Content: ${result.content.substring(0, 200)}...`);
});
```

### Filtering by Source

Narrow results to specific document sources:

```python
results = requests.post(
    f"{BASE_URL}/data/v1/query/semantic",
    headers={"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"},
    json={
        "query": "API rate limits",
        "sources": ["api-docs", "guides"],  # Only search these sources
        "limit": 10,
        "min_score": 0.6
    }
).json()
```

## Keyword Search

Traditional full-text search with typo tolerance.

### curl

```bash
curl -X POST "https://api.solidrust.ai/data/v1/query/keyword" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "rate limit 429",
    "limit": 10,
    "sort": "relevance"
  }'
```

### Python

```python
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
            "sort": sort  # "relevance" or "date"
        }
    )
    return response.json()

# Search for exact terms
results = keyword_search("rate limit 429 error")

for result in results["results"]:
    print(f"Title: {result['metadata'].get('title', 'Untitled')}")
    print(f"Content: {result['content'][:200]}...")
```

## Hybrid Search

Combines semantic similarity with knowledge graph relationships for comprehensive results.

### curl

```bash
curl -X POST "https://api.solidrust.ai/data/v1/query/hybrid" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Python SDK authentication",
    "semantic_weight": 0.7,
    "graph_weight": 0.3,
    "limit": 10
  }'
```

### Python

```python
def hybrid_search(
    query: str,
    semantic_weight: float = 0.7,
    graph_weight: float = 0.3,
    entity_boost: list = None,
    limit: int = 10
) -> dict:
    """Combined semantic and knowledge graph search."""
    payload = {
        "query": query,
        "semantic_weight": semantic_weight,
        "graph_weight": graph_weight,
        "limit": limit
    }

    if entity_boost:
        payload["entity_boost"] = entity_boost

    response = requests.post(
        f"{BASE_URL}/data/v1/query/hybrid",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json=payload
    )
    return response.json()

# Balance semantic and graph results
results = hybrid_search(
    query="How to use Python SDK for embeddings",
    semantic_weight=0.7,  # 70% semantic similarity
    graph_weight=0.3,     # 30% knowledge graph
    entity_boost=["Python", "embeddings"]  # Boost these entities
)

for result in results["results"]:
    print(f"Score: {result['score']:.2f} - {result['content'][:100]}...")
```

## Knowledge Graph Queries

Explore entity relationships in the knowledge base.

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
def knowledge_graph_query(
    entity: str,
    relationship_types: list = None,
    direction: str = "both",
    depth: int = 1,
    limit: int = 50
) -> dict:
    """Query entity relationships in the knowledge graph."""
    payload = {
        "entity": entity,
        "direction": direction,  # "outgoing", "incoming", or "both"
        "depth": depth,          # How many hops to traverse (1-5)
        "limit": limit
    }

    if relationship_types:
        payload["relationship_types"] = relationship_types

    response = requests.post(
        f"{BASE_URL}/data/v1/query/knowledge-graph",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json=payload
    )
    return response.json()

# Find all entities related to "Authentication"
result = knowledge_graph_query(
    entity="Authentication",
    direction="both",
    depth=2
)

print(f"Found {len(result['entities'])} entities")
print(f"Found {len(result['relationships'])} relationships")

# Print entities
print("\nEntities:")
for entity in result["entities"]:
    print(f"  - {entity['name']} ({entity['type']})")

# Print relationships
print("\nRelationships:")
for rel in result["relationships"]:
    print(f"  {rel['source']} --[{rel['type']}]--> {rel['target']}")
```

### JavaScript

```javascript
async function knowledgeGraphQuery(entity, options = {}) {
  const payload = {
    entity,
    direction: options.direction || 'both',
    depth: options.depth || 1,
    limit: options.limit || 50,
  };

  if (options.relationshipTypes) {
    payload.relationship_types = options.relationshipTypes;
  }

  const response = await fetch(`${BASE_URL}/data/v1/query/knowledge-graph`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return response.json();
}

// Find related concepts
const result = await knowledgeGraphQuery('API', {
  relationshipTypes: ['uses', 'related_to'],
  depth: 2,
});

console.log('Related entities:');
result.entities.forEach((e) => console.log(`  - ${e.name} (${e.type})`));
```

## Complete RAG Pattern

Combine retrieval with generation:

```python
from openai import OpenAI
import requests

# Initialize clients
llm = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def rag_answer(question: str) -> str:
    """Answer a question using RAG."""

    # 1. Search for relevant context using hybrid search
    search_results = requests.post(
        f"{BASE_URL}/data/v1/query/hybrid",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "query": question,
            "semantic_weight": 0.7,
            "graph_weight": 0.3,
            "limit": 5
        }
    ).json()

    # 2. Build context from retrieved documents
    context_parts = []
    for result in search_results.get("results", []):
        source = result.get("metadata", {}).get("source", "unknown")
        content = result["content"]
        context_parts.append(f"[Source: {source}]\n{content}")

    context = "\n\n---\n\n".join(context_parts)

    # 3. Generate answer with context
    response = llm.chat.completions.create(
        model="vllm-primary",
        messages=[
            {
                "role": "system",
                "content": f"""Answer questions based on the following context. Cite sources when possible.

{context}

If the answer is not in the context, say "I don't have that information in my knowledge base."""
            },
            {"role": "user", "content": question}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content

# Usage
answer = rag_answer("How do I authenticate API requests?")
print(answer)
```

## Choosing the Right Search Type

| Search Type | Use When |
|-------------|----------|
| **Semantic** | Questions about concepts, "how to" queries |
| **Keyword** | Searching for specific terms, error codes, exact phrases |
| **Hybrid** | Complex queries that benefit from both approaches |
| **Knowledge Graph** | Exploring relationships, finding connected concepts |

## Best Practices

### Chunking

- Keep chunks between 256-512 tokens
- Use overlap for better context continuity
- Consider semantic chunking for natural boundaries

### Retrieval

- Experiment with the number of retrieved documents (3-10)
- Use metadata filtering when available
- Consider hybrid search for better recall

### Prompting

- Clearly separate context from instructions
- Instruct the model to cite sources
- Handle cases where context doesn't contain the answer

### Performance

- Set appropriate `min_score` thresholds to filter low-quality matches
- Use `limit` to control result set size
- Cache frequent queries when appropriate

## Related

- [Agent Chat Example](/examples/agent-chat/) - Let the AI handle RAG automatically
- [Semantic Search Example](/examples/semantic-search/) - Detailed semantic search patterns
- [Embeddings API](/api/embeddings/) - Create embeddings for your documents
- [Document Q&A Example](/examples/document-qa/) - Complete RAG implementation with vector stores
