---
title: Error Handling
description: Understanding and handling API errors
---

The SolidRusT AI API uses standard HTTP status codes and returns detailed error information in JSON format.

## Error Response Format

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

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - Key doesn't have required permissions |
| 404 | Not Found - Invalid endpoint |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Temporary outage |

## Common Errors

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

**Solution:** Check that your API key is correct and hasn't been revoked.

### Rate Limit Exceeded

```json
{
  "error": {
    "message": "Rate limit exceeded. Please retry after 60 seconds.",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
```

**Solution:** Implement exponential backoff and retry logic.

### Invalid Request

```json
{
  "error": {
    "message": "Invalid 'model' parameter: 'invalid-model'",
    "type": "invalid_request_error",
    "code": "invalid_parameter",
    "param": "model"
  }
}
```

**Solution:** Check the [Models](/api/models/) endpoint for valid model IDs.

## Handling Errors in Code

### Python

```python
from openai import OpenAI, APIError, RateLimitError

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

try:
    response = client.chat.completions.create(
        model="qwen3-4b",
        messages=[{"role": "user", "content": "Hello"}]
    )
except RateLimitError as e:
    print(f"Rate limited, retry after: {e.retry_after}")
except APIError as e:
    print(f"API error: {e.message}")
```

### JavaScript

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

try {
  const response = await client.chat.completions.create({
    model: 'qwen3-4b',
    messages: [{ role: 'user', content: 'Hello' }],
  });
} catch (error) {
  if (error instanceof OpenAI.RateLimitError) {
    console.log('Rate limited, implementing backoff...');
  } else if (error instanceof OpenAI.APIError) {
    console.log(`API Error: ${error.message}`);
  }
}
```

## Retry Strategy

For transient errors (429, 503), implement exponential backoff:

```python
import time
import random

def make_request_with_retry(max_retries=5):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(...)
        except RateLimitError:
            if attempt == max_retries - 1:
                raise
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            time.sleep(wait_time)
```
