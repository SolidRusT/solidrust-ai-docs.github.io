---
title: API Overview
description: Overview of the SolidRusT AI API endpoints
---

The SolidRusT AI API provides OpenAI-compatible endpoints for AI inference.

## Base URL

```
https://artemis.hq.solidrust.net/v1
```

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/chat/completions` | POST | Generate chat completions |
| `/v1/embeddings` | POST | Create text embeddings |
| `/v1/models` | GET | List available models |
| `/data/query` | POST | Query the RAG data layer |

## Request Format

All requests must include:

- `Content-Type: application/json` header
- `Authorization: Bearer YOUR_API_KEY` header
- JSON request body (for POST requests)

### Example Request

```bash
curl https://artemis.hq.solidrust.net/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "qwen3-4b",
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

:::note[Coming Soon]
Interactive API documentation with OpenAPI/Swagger UI will be available here.
:::

Download the OpenAPI spec: [openapi.yaml](/api/openapi.yaml) (placeholder)

## Rate Limiting

See [Rate Limits](/guides/rate-limits/) for information about request limits.
