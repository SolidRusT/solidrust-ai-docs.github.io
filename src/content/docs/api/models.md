---
title: Models
description: List available models on the SolidRusT AI platform
---

Retrieve information about available models.

## List Models

```http
GET /v1/models
```

### Example Request

```bash
curl https://artemis.hq.solidrust.net/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "qwen3-4b",
      "object": "model",
      "created": 1704067200,
      "owned_by": "solidrust",
      "permission": [],
      "root": "qwen3-4b",
      "parent": null
    },
    {
      "id": "bge-m3",
      "object": "model",
      "created": 1704067200,
      "owned_by": "solidrust",
      "permission": [],
      "root": "bge-m3",
      "parent": null
    }
  ]
}
```

## Available Models

### Chat Models

| Model ID | Parameters | Context Length | Best For |
|----------|------------|----------------|----------|
| `qwen3-4b` | 4B | 8192 | General chat, coding, reasoning |

### Embedding Models

| Model ID | Dimensions | Max Input | Best For |
|----------|------------|-----------|----------|
| `bge-m3` | 1024 | 8192 tokens | Semantic search, RAG |

## Model Selection

:::tip[Choosing a Model]
- For general chat and completion tasks, use `qwen3-4b`
- For creating embeddings, use `bge-m3`
:::

## Failover Behavior

When local GPU infrastructure is unavailable, requests automatically route to:

| Primary | Failover |
|---------|----------|
| `qwen3-4b` | Claude Haiku |

This ensures high availability while maintaining API compatibility.
