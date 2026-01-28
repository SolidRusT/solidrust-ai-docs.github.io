---
title: API Overview
description: Overview of the SolidRusT AI API endpoints
---

The SolidRusT AI API provides OpenAI-compatible endpoints for AI inference.

## Base URL

```
https://api.solidrust.ai/v1
```

## Available Endpoints

### Chat & Inference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/chat/completions` | POST | Generate chat completions |
| `/v1/embeddings` | POST | Create text embeddings |
| `/v1/models` | GET | List available models |

### Agent (Tool-Augmented Chat)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/agent/chat` | POST | Chat with built-in RAG tools + custom tools |
| `/v1/agent/tools` | GET | List available tool schemas |
| `/v1/agent/health` | GET | Agent health check |

### Data Layer (RAG)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/data/v1/query/semantic` | POST | Semantic vector search |
| `/data/v1/query/hybrid` | POST | Combined semantic + knowledge graph |
| `/data/v1/query/knowledge-graph` | POST | Entity relationship queries |
| `/data/v1/ingest/document` | POST | Ingest single document |
| `/data/v1/ingest/batch` | POST | Batch document ingestion |

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

## OpenAPI Specification

Interactive API documentation is available:

- **Swagger UI**: [api.solidrust.ai/data/docs](https://api.solidrust.ai/data/docs)
- **ReDoc**: [api.solidrust.ai/data/redoc](https://api.solidrust.ai/data/redoc)
- **OpenAPI JSON**: [api.solidrust.ai/data/openapi.json](https://api.solidrust.ai/data/openapi.json)

These endpoints document the Data Layer API (RAG, agent, ingestion). The chat completions and embeddings endpoints follow the standard [OpenAI API specification](https://platform.openai.com/docs/api-reference).

## Rate Limiting

See [Rate Limits](/guides/rate-limits/) for information about request limits.
