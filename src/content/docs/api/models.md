---
title: Models
description: List available models on the SolidRusT AI platform
---

Retrieve information about available models.

Live IDs below were verified against the cluster on 2026-09-04
(`vllm.lab.hq.solidrust.net` and `embeddings.lab.hq.solidrust.net`).

## List Models

```http
GET /v1/models
```

### Example Request

```bash
curl https://api.solidrust.ai/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

Chat completions are served by the vLLM chat deployment. Embeddings are a
**separate** vLLM process — `GET /v1/models` on the chat base URL lists the
chat alias. The embeddings model id is what `/v1/embeddings` expects.

### Chat response (live)

```json
{
  "object": "list",
  "data": [
    {
      "id": "vllm-primary",
      "object": "model",
      "owned_by": "vllm",
      "root": "google/gemma-4-12B-it-qat-w4a16-ct",
      "parent": null,
      "max_model_len": 16384
    }
  ]
}
```

## Available Models

### Chat Models

| Model ID | Currently serving | Context | Best For |
|----------|-------------------|---------|----------|
| `vllm-primary` | Gemma 4 12B IT QAT (`google/gemma-4-12B-it-qat-w4a16-ct`) | 16384 | All chat tasks — use this alias |

:::tip[Use vllm-primary]
Always use `vllm-primary` in your code. The alias is the public contract.
The weights behind it change; your code should not.
:::

There is **no** public `qwen3-4b` id. That model is gone.

### Embedding Models

| Model ID | Dimensions | Max input | Best For |
|----------|------------|-----------|----------|
| `Qwen/Qwen3-Embedding-0.6B` | 1024 | 32768 tokens | Semantic search, RAG |

There is **no** public `bge-m3` id. The embedding service lists
`Qwen/Qwen3-Embedding-0.6B` only.

## Model Selection

- **Chat completions**: `vllm-primary`
- **Embeddings**: `Qwen/Qwen3-Embedding-0.6B`

## Failover

`POST /v1/chat/completions` goes Artemis → vLLM. LiteLLM is retired.

The **agent** endpoint (`POST /v1/agent/chat`) has a separate provider chain:
local `vllm-primary`, then OpenRouter (`openrouter/auto`) if the data-layer
agent health check says vLLM is down. That failover does **not** apply to
plain `/v1/chat/completions`.
