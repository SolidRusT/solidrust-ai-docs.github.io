---
title: API Overview
description: Overview of the SolidRusT AI API endpoints
---

The SolidRusT AI API provides OpenAI-compatible endpoints for AI inference, RAG (Retrieval-Augmented Generation), document ingestion, and tool-enabled agent interactions.

## Base URL

```
https://api.solidrust.ai
```

## Available Endpoints

### Chat & Inference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/chat/completions` | POST | Generate chat completions (OpenAI-compatible) |
| `/v1/embeddings` | POST | Create text embeddings (`Qwen/Qwen3-Embedding-0.6B`, 1024-dim) |
| `/v1/models` | GET | List available models |

### Agent (Tool-Augmented Chat)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/agent/chat` | POST | Chat with built-in RAG + memory tools |
| `/v1/agent/tools` | GET | List all available tool schemas (6 tools) |
| `/v1/agent/health` | GET | Agent and LLM provider health check |

### RAG — Search

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data/v1/query/semantic` | POST | Semantic vector search |
| `/data/v1/query/keyword` | POST | Full-text keyword search (MeiliSearch) |
| `/data/v1/query/hybrid` | POST | Combined semantic + graph with entity extraction |
| `/data/v1/query/knowledge-graph` | POST | Entity relationship queries (legacy) |

### RAG — Graph Traversal

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data/v1/query/graph` | POST | Traverse graph from an entity |
| `/data/v1/query/graph/search` | POST | Search entities by name |
| `/data/v1/query/graph/entity/{name}` | GET | Get entity by exact name |
| `/data/v1/query/graph/documents` | POST | Graph traversal + Milvus document resolution |

### Ingestion

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data/v1/ingest/document` | POST | Ingest single document (idempotent) |
| `/data/v1/ingest/batch` | POST | Batch document ingestion (idempotent) |

### Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data/v1/sources` | GET | List available data sources |
| `/data/v1/stats` | GET | Knowledge base statistics |

## Request Format

All requests must include:

- `Content-Type: application/json` header
- `Authorization: Bearer YOUR_API_KEY` header
- JSON request body (for POST requests)

### Example Request

```bash
curl https://api.solidrust.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "vllm-primary",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## Response Format

All responses are JSON objects. Successful responses include the requested data. Error responses follow a standard format:

```json
{
  "error": {
    "message": "Description of the error",
    "type": "error_type",
    "code": "error_code"
  }
}
```

## API Reference

Interactive API documentation is available:

- **Swagger UI**: [api.solidrust.ai/data/docs](https://api.solidrust.ai/data/docs)
- **ReDoc**: [api.solidrust.ai/data/redoc](https://api.solidrust.ai/data/redoc)
- **OpenAPI Reference**: [docs.solidrust.ai/api-reference/](/api-reference/)

These provide the Data Layer API specification (RAG, agent, ingestion, graph). The chat completions and embeddings endpoints follow the standard [OpenAI API specification](https://platform.openai.com/docs/api-reference).

## Rate Limiting

See [Rate Limits](/guides/rate-limits/) for information about request limits.

## See Also

- [Changelog](/changelog/) — API changes and version history
- [Getting Started](/getting-started/introduction/) — Quick start guide
- [SDK Overview](/sdks/overview/) — Client library documentation
