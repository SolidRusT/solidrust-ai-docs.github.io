---
title: Rate Limits
description: Understanding and working with API rate limits
---

Rate limits protect the API from abuse and ensure fair usage across all users.

## Current Limits

:::note[Limits by Tier]
Rate limits vary by subscription tier. Contact support for higher limits.
:::

| Tier | Requests/min | Tokens/min |
|------|-------------|------------|
| Free | 10 | 10,000 |
| Basic | 60 | 100,000 |
| Pro | 300 | 500,000 |
| Enterprise | Custom | Custom |

## Rate Limit Headers

Every response includes rate limit information:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704067260
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per minute |
| `X-RateLimit-Remaining` | Requests remaining in window |
| `X-RateLimit-Reset` | Unix timestamp when limit resets |

## Handling Rate Limits

### Response Code

When rate limited, you'll receive HTTP 429:

```json
{
  "error": {
    "message": "Rate limit exceeded. Please retry after 60 seconds.",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
```

### Retry-After Header

```http
Retry-After: 30
```

## Retry Strategy

Implement exponential backoff:

```python
import time
import random
from openai import OpenAI, RateLimitError

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

def make_request_with_retry(messages, max_retries=5):
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model="qwen3-4b",
                messages=messages
            )
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise

            # Exponential backoff with jitter
            wait_time = (2 ** attempt) + random.uniform(0, 1)
            print(f"Rate limited, waiting {wait_time:.1f}s...")
            time.sleep(wait_time)
```

### JavaScript

```javascript
async function makeRequestWithRetry(messages, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.chat.completions.create({
        model: 'qwen3-4b',
        messages,
      });
    } catch (error) {
      if (error instanceof OpenAI.RateLimitError) {
        if (attempt === maxRetries - 1) throw error;

        const waitTime = Math.pow(2, attempt) + Math.random();
        console.log(`Rate limited, waiting ${waitTime.toFixed(1)}s...`);
        await new Promise(r => setTimeout(r, waitTime * 1000));
      } else {
        throw error;
      }
    }
  }
}
```

## Best Practices

:::tip[Avoiding Rate Limits]
- Implement request queuing
- Use batch endpoints when available
- Cache responses when appropriate
- Monitor your usage via response headers
:::

## Requesting Higher Limits

For higher rate limits:

1. Upgrade your subscription tier at [console.solidrust.ai](https://console.solidrust.ai)
2. Contact support for enterprise needs

## Related

- [Error Handling](/api/errors/) - Complete error reference
- [Authentication](/getting-started/authentication/) - API key management
