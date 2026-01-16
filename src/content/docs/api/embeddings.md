---
title: Embeddings
description: Create vector embeddings for semantic search and RAG
---

Generate vector embeddings from input text using our embedding models.

## Endpoint

```http
POST /v1/embeddings
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | Model ID to use (e.g., `bge-m3`) |
| `input` | string/array | Yes | Text to embed (string or array of strings) |
| `encoding_format` | string | No | `float` (default) or `base64` |

## Example Request

### Single Input

```bash
curl https://api.solidrust.ai/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "bge-m3",
    "input": "What is semantic search?"
  }'
```

### Batch Input

```bash
curl https://api.solidrust.ai/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "bge-m3",
    "input": [
      "First document to embed",
      "Second document to embed",
      "Third document to embed"
    ]
  }'
```

## Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [0.0023, -0.0047, 0.0112, ...]
    }
  ],
  "model": "bge-m3",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
```

## Embedding Dimensions

| Model | Dimensions | Description |
|-------|------------|-------------|
| `bge-m3` | 1024 | Multilingual, high-quality embeddings |

## Use Cases

- **Semantic Search** - Find similar documents by meaning
- **RAG Applications** - Retrieve relevant context for LLM prompts
- **Clustering** - Group related content together
- **Classification** - Use embeddings as features for ML models

## Best Practices

:::tip[Optimization Tips]
- Batch multiple inputs in a single request for efficiency
- Precompute and cache embeddings for static content
- Use the same model for queries and documents
:::

## Related

- [RAG Guide](/guides/rag/) - Building retrieval-augmented generation systems
- [Document Q&A Example](/examples/document-qa/) - Complete RAG implementation
