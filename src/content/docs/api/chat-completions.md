---
title: Chat Completions
description: Generate AI responses using the chat completions endpoint
---

Create a chat completion with the specified model.

## Endpoint

```http
POST /v1/chat/completions
```

## Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | Model ID to use (e.g., `vllm-primary`) |
| `messages` | array | Yes | Array of message objects |
| `temperature` | number | No | Sampling temperature (0-2). Default: 1 |
| `max_tokens` | integer | No | Maximum tokens to generate |
| `stream` | boolean | No | Enable streaming responses. Default: false |
| `top_p` | number | No | Nucleus sampling parameter (0-1) |
| `stop` | string/array | No | Stop sequences |

### Message Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `role` | string | Yes | `system`, `user`, or `assistant` |
| `content` | string | Yes | The message content |

## Example Request

```bash
curl https://api.solidrust.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "vllm-primary",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is machine learning?"}
    ],
    "temperature": 0.7,
    "max_tokens": 500
  }'
```

## Response

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1704067200,
  "model": "vllm-primary",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Machine learning is a subset of artificial intelligence..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 150,
    "total_tokens": 175
  }
}
```

## Streaming

Set `stream: true` to receive responses as server-sent events (SSE).

```bash
curl https://api.solidrust.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "vllm-primary",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'
```

See [Streaming Guide](/guides/streaming/) for more details.

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Invalid request body |
| 401 | Invalid or missing API key |
| 429 | Rate limit exceeded |
| 500 | Server error |

See [Error Handling](/api/errors/) for complete error documentation.
