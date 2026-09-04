---
title: Embeddings
description: Create vector embeddings for semantic search and RAG
---

Generate vector embeddings from input text.

Live model (2026-09-04): `Qwen/Qwen3-Embedding-0.6B`, 1024 dimensions,
32768 max input tokens. Confirmed by `GET /v1/models` on the embeddings
service and by `GET /v1/stats` on the data layer (`embedding_dimension`: 1024).

## Endpoint

```http
POST /v1/embeddings
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | `Qwen/Qwen3-Embedding-0.6B` |
| `input` | string/array | Yes | Text to embed (string or array of strings) |
| `encoding_format` | string | No | `float` (default) or `base64` |

## Example Request

### Single Input

```bash
curl https://api.solidrust.ai/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "Qwen/Qwen3-Embedding-0.6B",
    "input": "What is semantic search?"
  }'
```

### Batch Input

```bash
curl https://api.solidrust.ai/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "Qwen/Qwen3-Embedding-0.6B",
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
      "embedding": [0.0023, -0.0047, 0.0112]
    }
  ],
  "model": "Qwen/Qwen3-Embedding-0.6B",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
```

## Embedding Dimensions

| Model | Dimensions | Max input |
|-------|------------|-----------|
| `Qwen/Qwen3-Embedding-0.6B` | 1024 | 32768 tokens |

`bge-m3` is not deployed. Do not send that id.

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
