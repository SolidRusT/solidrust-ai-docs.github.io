---
title: Introduction
description: Welcome to the SolidRusT AI inference platform
---

Welcome to **SolidRusT AI**. OpenAI-compatible inference on a 14-node
Kubernetes cluster we run ourselves — 5 of those nodes have GPUs.

## What is SolidRusT AI?

- **OpenAI-compatible endpoints** — point the official SDK at our base URL
- **Local GPU inference** — chat on vLLM (`vllm-primary`)
- **Embeddings** — dedicated vLLM serving `Qwen/Qwen3-Embedding-0.6B`
- **Data layer** — RAG, keyword, hybrid, and graph under `/data/v1/...`

## Base URL

All API requests should be made to:

```
https://api.solidrust.ai/v1
```

RAG and ingestion use the same host with a `/data` prefix:

```
https://api.solidrust.ai/data/v1
```

Keys come from [console.solidrust.ai](https://console.solidrust.ai).
Status is [status.solidrust.ai](https://status.solidrust.ai).

## Available Models

| Model | Type | Use Case |
|-------|------|----------|
| `vllm-primary` | Chat | Alias for the current chat weights (Gemma 4 12B IT QAT, 16k context) |
| `Qwen/Qwen3-Embedding-0.6B` | Embeddings | Semantic search and RAG (1024-dim) |

## Next Steps

- [Quick Start](/getting-started/quickstart/) - Get your first API call working
- [Authentication](/getting-started/authentication/) - Learn about API key management
- [API Reference](/api/overview/) - Detailed endpoint documentation
