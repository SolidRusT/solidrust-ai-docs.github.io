---
title: Error Handling
description: Understanding and handling API errors from Artemis Gateway
---

The SolidRusT AI API (served via Artemis Gateway and LiteLLM proxy) uses standard HTTP status codes and returns detailed error information in JSON format compatible with the OpenAI API specification.

## Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "message": "Human-readable error description",
    "type": "error_type",
    "code": "error_code",
    "param": "parameter_name"
  }
}
```

## HTTP Status Codes

| Code | Description | Retry? |
|------|-------------|--------|
| 200 | Success | N/A |
| 400 | Bad Request - Invalid parameters | No |
| 401 | Unauthorized - Invalid or missing API key | No |
| 403 | Forbidden - Key doesn't have required permissions | No |
| 404 | Not Found - Invalid endpoint | No |
| 422 | Unprocessable Entity - Valid JSON but invalid content | No |
| 429 | Too Many Requests - Rate limit exceeded | Yes |
| 500 | Internal Server Error | Yes |
| 502 | Bad Gateway - Upstream service unavailable | Yes |
| 503 | Service Unavailable - Temporary outage | Yes |
| 504 | Gateway Timeout - Request took too long | Yes |

## Authentication Errors (401)

### Invalid API Key

```json
{
  "error": {
    "message": "Invalid API key provided",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

**Cause:** The API key is malformed, revoked, or doesn't exist.

**Solution:** 
1. Verify your API key at [console.solidrust.ai](https://console.solidrust.ai)
2. Check the key hasn't been revoked
3. Ensure no extra whitespace or characters

### Missing Authorization Header

```json
{
  "error": {
    "message": "Missing Authorization header",
    "type": "authentication_error",
    "code": "missing_auth_header"
  }
}
```

**Solution:** Include the `Authorization: Bearer YOUR_API_KEY` header in your request.

## Validation Errors (400/422)

### Invalid Model Name

```json
{
  "error": {
    "message": "Model 'invalid-model' not found. Available models: qwen3-4b, vllm-primary",
    "type": "invalid_request_error",
    "code": "model_not_found",
    "param": "model"
  }
}
```

**Solution:** Use a valid model ID. Check [Models](/api/models/) for available options. Recommended: `vllm-primary` (alias that routes to the current best model).

### Missing Required Field

```json
{
  "error": {
    "message": "Missing required field: 'messages'",
    "type": "invalid_request_error",
    "code": "missing_field",
    "param": "messages"
  }
}
```

### Invalid Parameter Type

```json
{
  "error": {
    "message": "Invalid type for 'temperature': expected float, got string",
    "type": "invalid_request_error",
    "code": "invalid_type",
    "param": "temperature"
  }
}
```

## Rate Limit Errors (429)

```json
{
  "error": {
    "message": "Rate limit exceeded. Please retry after 60 seconds.",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
```

**Headers included:**
```http
Retry-After: 60
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704067260
```

**Solution:** Implement exponential backoff. See [Rate Limits](/guides/rate-limits/) for details.

## Server Errors (500/502/503/504)

### vLLM Unavailable (Failover Active)

```json
{
  "error": {
    "message": "Primary model temporarily unavailable, request routed to fallback",
    "type": "server_error",
    "code": "failover_active"
  }
}
```

:::caution[Failover Behavior]
When vLLM is unavailable, chat completion requests automatically fail over to Claude Haiku via LiteLLM. During failover:
- Response quality may differ slightly
- Model name in response will indicate the fallback model
- Pricing may vary (Claude Haiku rates apply)
:::

### Internal Server Error

```json
{
  "error": {
    "message": "An internal error occurred. Please try again.",
    "type": "server_error",
    "code": "internal_error"
  }
}
```

### Gateway Timeout

```json
{
  "error": {
    "message": "Request timed out. Consider reducing max_tokens or prompt length.",
    "type": "server_error",
    "code": "timeout"
  }
}
```

## Handling Errors in Code

### Python

```python
from openai import OpenAI, APIError, RateLimitError, AuthenticationError, BadRequestError
import time
import random

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

def make_request_with_retry(messages, max_retries=5):
    """Make a request with exponential backoff retry logic."""
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model="vllm-primary",
                messages=messages
            )
        except AuthenticationError as e:
            # Don't retry auth errors - fix the API key
            print(f"Authentication failed: {e.message}")
            raise
        except BadRequestError as e:
            # Don't retry validation errors - fix the request
            print(f"Invalid request: {e.message}")
            raise
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            # Use Retry-After header if available
            wait_time = getattr(e, 'retry_after', None) or (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limited, waiting {wait_time:.1f}s...")
            time.sleep(wait_time)
        except APIError as e:
            # Retry server errors with exponential backoff
            if e.status_code in [500, 502, 503, 504]:
                if attempt == max_retries - 1:
                    raise
                wait_time = (2 ** attempt) + random.uniform(0, 1)
                print(f"Server error ({e.status_code}), retrying in {wait_time:.1f}s...")
                time.sleep(wait_time)
            else:
                raise

# Usage
try:
    response = make_request_with_retry([
        {"role": "user", "content": "Hello!"}
    ])
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Request failed: {e}")
```

### JavaScript/TypeScript

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

async function makeRequestWithRetry(messages, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.chat.completions.create({
        model: 'vllm-primary',
        messages,
      });
    } catch (error) {
      // Don't retry authentication or validation errors
      if (error instanceof OpenAI.AuthenticationError) {
        console.error('Authentication failed:', error.message);
        throw error;
      }
      if (error instanceof OpenAI.BadRequestError) {
        console.error('Invalid request:', error.message);
        throw error;
      }

      // Retry rate limits with backoff
      if (error instanceof OpenAI.RateLimitError) {
        if (attempt === maxRetries - 1) throw error;
        
        const retryAfter = error.headers?.['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) : Math.pow(2, attempt) + Math.random();
        console.log(`Rate limited, waiting ${waitTime.toFixed(1)}s...`);
        await new Promise(r => setTimeout(r, waitTime * 1000));
        continue;
      }

      // Retry server errors
      if (error instanceof OpenAI.APIError && [500, 502, 503, 504].includes(error.status)) {
        if (attempt === maxRetries - 1) throw error;
        
        const waitTime = Math.pow(2, attempt) + Math.random();
        console.log(`Server error (${error.status}), retrying in ${waitTime.toFixed(1)}s...`);
        await new Promise(r => setTimeout(r, waitTime * 1000));
        continue;
      }

      throw error;
    }
  }
}

// Usage
try {
  const response = await makeRequestWithRetry([
    { role: 'user', content: 'Hello!' }
  ]);
  console.log(response.choices[0].message.content);
} catch (error) {
  console.error('Request failed:', error.message);
}
```

## Failover Architecture

The SolidRusT AI platform includes automatic failover for high availability:

```
Request → Artemis Gateway → LiteLLM Proxy → vLLM (primary)
                                         ↓ (if unavailable)
                                    Claude Haiku (fallback)
```

### What Triggers Failover

- vLLM pod is scaling or restarting
- GPU maintenance window
- Model loading in progress
- Unexpected vLLM crash

### Detecting Failover in Responses

Check the `model` field in the response:

```python
response = client.chat.completions.create(...)
if 'claude' in response.model.lower():
    print("Note: Response served by fallback model")
```

### Failover Considerations

| Aspect | vLLM (Primary) | Claude Haiku (Fallback) |
|--------|----------------|------------------------|
| Latency | Lower (~50ms TTFB) | Higher (~200ms TTFB) |
| Cost | Free tier included | Metered usage |
| Context | 4K tokens | 200K tokens |
| Capabilities | Qwen3-4B | Claude Haiku |

## Related

- [Rate Limits](/guides/rate-limits/) - Detailed rate limit information
- [Authentication](/getting-started/authentication/) - API key management
- [Models](/api/models/) - Available models and capabilities
