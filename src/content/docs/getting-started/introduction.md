---
title: Introduction
description: Welcome to the SolidRusT AI inference platform
---

Welcome to **SolidRusT AI**, an enterprise-grade AI inference platform providing OpenAI-compatible API endpoints.

## What is SolidRusT AI?

SolidRusT AI provides a unified API for accessing large language models (LLMs) and embedding models. Our platform offers:

- **OpenAI-Compatible Endpoints** - Use existing OpenAI SDKs with minimal changes
- **Local GPU Infrastructure** - Fast inference on dedicated hardware
- **Intelligent Failover** - Automatic routing to cloud providers during maintenance
- **Data Layer Integration** - Built-in RAG capabilities for knowledge-augmented responses

## Base URL

All API requests should be made to:

```
https://artemis.hq.solidrust.net/v1
```

## Available Models

| Model | Type | Use Case |
|-------|------|----------|
| `qwen3-4b` | Chat | General-purpose chat and completion |
| `bge-m3` | Embeddings | Semantic search, RAG applications |

## Next Steps

- [Quick Start](/getting-started/quickstart/) - Get your first API call working
- [Authentication](/getting-started/authentication/) - Learn about API key management
- [API Reference](/api/overview/) - Detailed endpoint documentation
