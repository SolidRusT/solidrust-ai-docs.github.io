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
curl https://api.solidrust.ai/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "vllm-primary",
      "object": "model",
      "created": 1704067200,
      "owned_by": "solidrust",
      "permission": [],
      "root": "vllm-primary",
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

| Model ID | Description | Context Length | Best For |
|----------|-------------|----------------|----------|
| `vllm-primary` | Recommended alias (currently Qwen3-4B) | 8192 | All chat tasks - use this |
| `qwen3-4b` | Direct model reference | 8192 | When you need a specific model |

:::tip[Use vllm-primary]
Always use `vllm-primary` in your code. This alias automatically routes to our best available model and ensures your integration survives model upgrades without code changes.
:::

### Embedding Models

| Model ID | Dimensions | Max Input | Best For |
|----------|------------|-----------|----------|
| `bge-m3` | 1024 | 8192 tokens | Semantic search, RAG |

## Model Selection

- **Chat completions**: Use `vllm-primary`
- **Embeddings**: Use `bge-m3`

## Failover Behavior

When local GPU infrastructure is unavailable, requests automatically route to cloud providers:

| Primary | Failover Chain |
|---------|----------------|
| `vllm-primary` | OpenAI GPT-4o-mini → Claude Haiku |

This ensures high availability while maintaining API compatibility. You can detect failover by checking the `model` field in responses - it will indicate which model actually served the request.
