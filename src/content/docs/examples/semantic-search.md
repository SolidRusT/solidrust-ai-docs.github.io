---
title: Semantic Search Example
description: Build semantic search applications using the SolidRusT AI Data Layer
---

Semantic search finds documents based on meaning rather than exact keyword matches. This example shows how to use the SolidRusT AI Data Layer endpoints for various search patterns.

## Quick Start

### curl

```bash
curl -X POST "https://api.solidrust.ai/data/v1/query/semantic" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I get started with the API?",
    "limit": 5,
    "min_score": 0.5
  }'
```

### Python

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def search(query: str) -> list:
    """Simple semantic search."""
    response = requests.post(
        f"{BASE_URL}/data/v1/query/semantic",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={"query": query, "limit": 5}
    )
    return response.json()["results"]

results = search("How do I authenticate?")
for r in results:
    print(f"{r['score']:.2f}: {r['content'][:100]}...")
```

## Search Client Class

A reusable client for all data layer endpoints:

```python
import requests
from dataclasses import dataclass
from typing import Optional

@dataclass
class SearchResult:
    document_id: str
    content: str
    score: float
    source: str
    title: Optional[str] = None
    url: Optional[str] = None

class DataLayerClient:
    def __init__(self, api_key: str, base_url: str = "https://api.solidrust.ai"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        })

    def _parse_results(self, data: dict) -> list[SearchResult]:
        """Convert API response to SearchResult objects."""
        results = []
        for item in data.get("results", []):
            metadata = item.get("metadata", {})
            results.append(SearchResult(
                document_id=item.get("document_id", ""),
                content=item.get("content", ""),
                score=item.get("score", 0.0),
                source=metadata.get("source", "unknown"),
                title=metadata.get("title"),
                url=metadata.get("url")
            ))
        return results

    def semantic_search(
        self,
        query: str,
        limit: int = 10,
        min_score: float = 0.5,
        sources: list[str] = None,
        filters: dict = None
    ) -> list[SearchResult]:
        """Semantic similarity search."""
        payload = {
            "query": query,
            "limit": limit,
            "min_score": min_score
        }
        if sources:
            payload["sources"] = sources
        if filters:
            payload["filters"] = filters

        response = self.session.post(
            f"{self.base_url}/data/v1/query/semantic",
            json=payload
        )
        response.raise_for_status()
        return self._parse_results(response.json())

    def keyword_search(
        self,
        query: str,
        limit: int = 10,
        sort: str = "relevance",
        sources: list[str] = None
    ) -> list[SearchResult]:
        """Full-text keyword search."""
        payload = {
            "query": query,
            "limit": limit,
            "sort": sort
        }
        if sources:
            payload["sources"] = sources

        response = self.session.post(
            f"{self.base_url}/data/v1/query/keyword",
            json=payload
        )
        response.raise_for_status()
        return self._parse_results(response.json())

    def hybrid_search(
        self,
        query: str,
        semantic_weight: float = 0.7,
        graph_weight: float = 0.3,
        limit: int = 10,
        entity_boost: list[str] = None
    ) -> list[SearchResult]:
        """Combined semantic and knowledge graph search."""
        payload = {
            "query": query,
            "semantic_weight": semantic_weight,
            "graph_weight": graph_weight,
            "limit": limit
        }
        if entity_boost:
            payload["entity_boost"] = entity_boost

        response = self.session.post(
            f"{self.base_url}/data/v1/query/hybrid",
            json=payload
        )
        response.raise_for_status()
        return self._parse_results(response.json())

    def knowledge_graph(
        self,
        entity: str,
        relationship_types: list[str] = None,
        direction: str = "both",
        depth: int = 1,
        limit: int = 50
    ) -> dict:
        """Query knowledge graph relationships."""
        payload = {
            "entity": entity,
            "direction": direction,
            "depth": depth,
            "limit": limit
        }
        if relationship_types:
            payload["relationship_types"] = relationship_types

        response = self.session.post(
            f"{self.base_url}/data/v1/query/knowledge-graph",
            json=payload
        )
        response.raise_for_status()
        return response.json()

# Usage
client = DataLayerClient("YOUR_API_KEY")

# Semantic search
results = client.semantic_search("Python SDK usage", limit=5)
for r in results:
    print(f"[{r.score:.2f}] {r.source}: {r.content[:80]}...")

# Hybrid search with entity boosting
results = client.hybrid_search(
    "authentication best practices",
    entity_boost=["API", "OAuth"]
)

# Knowledge graph exploration
graph = client.knowledge_graph("Python", depth=2)
print(f"Found {len(graph['entities'])} related entities")
```

## JavaScript/TypeScript Client

```typescript
interface SearchResult {
  documentId: string;
  content: string;
  score: number;
  source: string;
  title?: string;
  url?: string;
}

interface GraphResult {
  entities: Array<{ name: string; type: string; properties: object }>;
  relationships: Array<{
    source: string;
    target: string;
    type: string;
  }>;
}

class DataLayerClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = 'https://api.solidrust.ai') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, body: object): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  private parseResults(data: any): SearchResult[] {
    return (data.results || []).map((item: any) => ({
      documentId: item.document_id || '',
      content: item.content || '',
      score: item.score || 0,
      source: item.metadata?.source || 'unknown',
      title: item.metadata?.title,
      url: item.metadata?.url,
    }));
  }

  async semanticSearch(
    query: string,
    options: {
      limit?: number;
      minScore?: number;
      sources?: string[];
    } = {}
  ): Promise<SearchResult[]> {
    const data = await this.fetch('/data/v1/query/semantic', {
      query,
      limit: options.limit || 10,
      min_score: options.minScore || 0.5,
      ...(options.sources && { sources: options.sources }),
    });
    return this.parseResults(data);
  }

  async hybridSearch(
    query: string,
    options: {
      semanticWeight?: number;
      graphWeight?: number;
      limit?: number;
      entityBoost?: string[];
    } = {}
  ): Promise<SearchResult[]> {
    const data = await this.fetch('/data/v1/query/hybrid', {
      query,
      semantic_weight: options.semanticWeight || 0.7,
      graph_weight: options.graphWeight || 0.3,
      limit: options.limit || 10,
      ...(options.entityBoost && { entity_boost: options.entityBoost }),
    });
    return this.parseResults(data);
  }

  async knowledgeGraph(
    entity: string,
    options: {
      relationshipTypes?: string[];
      direction?: 'incoming' | 'outgoing' | 'both';
      depth?: number;
      limit?: number;
    } = {}
  ): Promise<GraphResult> {
    return this.fetch('/data/v1/query/knowledge-graph', {
      entity,
      direction: options.direction || 'both',
      depth: options.depth || 1,
      limit: options.limit || 50,
      ...(options.relationshipTypes && {
        relationship_types: options.relationshipTypes,
      }),
    });
  }
}

// Usage
const client = new DataLayerClient('YOUR_API_KEY');

// Semantic search
const results = await client.semanticSearch('API authentication', {
  limit: 5,
  minScore: 0.6,
});

results.forEach((r) => {
  console.log(`[${r.score.toFixed(2)}] ${r.source}: ${r.content.slice(0, 80)}...`);
});

// Explore knowledge graph
const graph = await client.knowledgeGraph('Authentication', { depth: 2 });
console.log(`Found ${graph.entities.length} related entities`);
```

## Search Patterns

### Contextual Q&A Search

Search with follow-up context:

```python
def contextual_search(client: DataLayerClient, question: str, context: str = None):
    """Search that considers conversation context."""
    if context:
        # Include context in the search query for better relevance
        enhanced_query = f"{context}\n\nCurrent question: {question}"
    else:
        enhanced_query = question

    return client.hybrid_search(enhanced_query, limit=5)

# First question
results1 = contextual_search(client, "What authentication methods are supported?")

# Follow-up question (include context)
results2 = contextual_search(
    client,
    "How do I implement that?",
    context="User asked about authentication methods, specifically OAuth"
)
```

### Multi-Source Search

Search across specific sources:

```python
def search_by_category(client: DataLayerClient, query: str, category: str):
    """Search within a specific documentation category."""
    source_map = {
        "api": ["api-reference", "api-docs"],
        "guides": ["tutorials", "how-to-guides"],
        "examples": ["code-examples", "sample-apps"],
        "troubleshooting": ["faq", "errors", "debugging"]
    }

    sources = source_map.get(category, [])

    return client.semantic_search(
        query,
        sources=sources if sources else None,
        min_score=0.5
    )

# Search only in API documentation
api_results = search_by_category(client, "rate limits", "api")

# Search in troubleshooting guides
error_results = search_by_category(client, "401 unauthorized", "troubleshooting")
```

### Entity-Aware Search

Boost results related to specific entities:

```python
def entity_focused_search(client: DataLayerClient, query: str, entities: list[str]):
    """Search with entity boosting for more relevant results."""
    return client.hybrid_search(
        query,
        semantic_weight=0.6,
        graph_weight=0.4,  # Higher graph weight for entity focus
        entity_boost=entities,
        limit=10
    )

# Find Python-specific content
results = entity_focused_search(
    client,
    "how to make API requests",
    entities=["Python", "requests", "SDK"]
)

# Find authentication-related content
results = entity_focused_search(
    client,
    "secure API access",
    entities=["Authentication", "API Key", "OAuth"]
)
```

### Relationship Discovery

Use knowledge graph to find related concepts:

```python
def discover_related_topics(client: DataLayerClient, topic: str) -> dict:
    """Find topics related to the given concept."""
    # Get direct relationships
    direct = client.knowledge_graph(topic, depth=1)

    # Get extended relationships
    extended = client.knowledge_graph(topic, depth=2)

    # Categorize relationships
    related = {
        "direct_connections": [],
        "extended_connections": [],
        "relationship_types": set()
    }

    for rel in direct["relationships"]:
        related["direct_connections"].append({
            "entity": rel["target"] if rel["source"] == topic else rel["source"],
            "relationship": rel["type"]
        })
        related["relationship_types"].add(rel["type"])

    for rel in extended["relationships"]:
        if rel not in direct["relationships"]:
            related["extended_connections"].append({
                "entity": rel["target"] if rel["source"] == topic else rel["source"],
                "relationship": rel["type"]
            })

    related["relationship_types"] = list(related["relationship_types"])
    return related

# Discover what's related to "API"
related = discover_related_topics(client, "API")
print("Direct connections:", related["direct_connections"])
print("Relationship types:", related["relationship_types"])
```

## Integration with Chat Completions

Combine search results with LLM generation:

```python
from openai import OpenAI

llm = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

def answer_with_sources(client: DataLayerClient, question: str) -> dict:
    """Answer a question with cited sources."""
    # Search for relevant context
    results = client.hybrid_search(question, limit=5)

    # Build context with source tracking
    context_parts = []
    sources = []
    for i, r in enumerate(results, 1):
        context_parts.append(f"[{i}] {r.content}")
        sources.append({
            "index": i,
            "source": r.source,
            "title": r.title,
            "url": r.url,
            "score": r.score
        })

    context = "\n\n".join(context_parts)

    # Generate answer
    response = llm.chat.completions.create(
        model="vllm-primary",
        messages=[
            {
                "role": "system",
                "content": f"""Answer the question based on the provided context.
Cite sources using [1], [2], etc.

Context:
{context}

If you can't answer from the context, say so."""
            },
            {"role": "user", "content": question}
        ],
        temperature=0.3
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": sources
    }

# Usage
result = answer_with_sources(client, "How do I handle rate limiting?")
print("Answer:", result["answer"])
print("\nSources:")
for s in result["sources"]:
    print(f"  [{s['index']}] {s['source']} (score: {s['score']:.2f})")
```

## Error Handling

```python
import requests
from requests.exceptions import RequestException

class SearchError(Exception):
    """Custom error for search operations."""
    def __init__(self, message: str, status_code: int = None):
        super().__init__(message)
        self.status_code = status_code

def safe_search(client: DataLayerClient, query: str) -> list[SearchResult]:
    """Search with comprehensive error handling."""
    try:
        results = client.semantic_search(query)
        return results

    except requests.exceptions.HTTPError as e:
        status = e.response.status_code
        if status == 401:
            raise SearchError("Invalid API key", status)
        elif status == 429:
            raise SearchError("Rate limit exceeded - retry later", status)
        elif status == 400:
            raise SearchError(f"Invalid request: {e.response.text}", status)
        else:
            raise SearchError(f"API error: {status}", status)

    except requests.exceptions.Timeout:
        raise SearchError("Request timed out")

    except requests.exceptions.ConnectionError:
        raise SearchError("Could not connect to API")

    except Exception as e:
        raise SearchError(f"Unexpected error: {e}")

# Usage with error handling
try:
    results = safe_search(client, "API usage")
    for r in results:
        print(f"{r.score:.2f}: {r.content[:50]}...")
except SearchError as e:
    print(f"Search failed: {e}")
    if e.status_code == 429:
        print("Consider implementing retry with backoff")
```

## Performance Tips

1. **Set appropriate limits** - Don't retrieve more results than needed
2. **Use min_score filtering** - Filter low-quality matches at the API level
3. **Filter by sources** - Narrow search scope when you know the category
4. **Cache frequent queries** - Store common searches client-side
5. **Use hybrid search strategically** - It's more expensive but more comprehensive

## Related

- [RAG Guide](/guides/rag/) - Complete RAG implementation patterns
- [Agent Chat Example](/examples/agent-chat/) - Let the AI handle search automatically
- [Document Q&A Example](/examples/document-qa/) - Build Q&A systems
