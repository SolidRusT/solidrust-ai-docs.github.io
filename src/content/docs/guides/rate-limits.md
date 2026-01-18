---
title: Rate Limits
description: Understanding and working with API rate limits
---

Rate limits protect the API from abuse and ensure fair usage across all users. The SolidRusT AI API enforces rate limits at the Artemis Gateway and PAM Platform levels.

## Current Limits

:::note[Limits by Tier]
Rate limits vary by subscription tier. Upgrade at [console.solidrust.ai](https://console.solidrust.ai) for higher limits.
:::

| Tier | Requests/min | Requests/hour | Requests/day | Tokens/min |
|------|-------------|---------------|--------------|------------|
| Free | 10 | 100 | 500 | 10,000 |
| Basic | 60 | 1,000 | 10,000 | 100,000 |
| Pro | 300 | 5,000 | 50,000 | 500,000 |
| Enterprise | Custom | Custom | Custom | Custom |

### Token Limits

| Parameter | Limit |
|-----------|-------|
| Max tokens per request | 4,096 |
| Max context window | 4,096 tokens (Qwen3-4B) |
| Max concurrent connections | 5 (Free), 20 (Basic), 100 (Pro) |

## Rate Limit Headers

Every API response includes rate limit information in the headers:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704067260
X-RateLimit-Window: 60
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed in the current window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when the limit resets |
| `X-RateLimit-Window` | Window duration in seconds |

## Handling Rate Limits

### HTTP 429 Response

When rate limited, you'll receive HTTP 429 with this format:

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

The response includes a `Retry-After` header indicating how long to wait:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704067260
```

## Retry Strategies

### Exponential Backoff (Recommended)

The best approach is exponential backoff with jitter:

```python
import time
import random
from openai import OpenAI, RateLimitError

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

def make_request_with_retry(messages, max_retries=5, base_delay=1):
    """Make a request with exponential backoff retry logic."""
    for attempt in range(max_retries):
        try:
            return client.chat.completions.create(
                model="vllm-primary",
                messages=messages
            )
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            
            # Use Retry-After header if available
            retry_after = getattr(e, 'retry_after', None)
            if retry_after:
                wait_time = retry_after
            else:
                # Exponential backoff with jitter
                wait_time = (base_delay * (2 ** attempt)) + random.uniform(0, 1)
            
            print(f"Rate limited (attempt {attempt + 1}/{max_retries}), "
                  f"waiting {wait_time:.1f}s...")
            time.sleep(wait_time)

# Usage
response = make_request_with_retry([
    {"role": "user", "content": "Hello!"}
])
```

### JavaScript/TypeScript

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

async function makeRequestWithRetry(messages, maxRetries = 5, baseDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await client.chat.completions.create({
        model: 'vllm-primary',
        messages,
      });
    } catch (error) {
      if (!(error instanceof OpenAI.RateLimitError)) {
        throw error;
      }
      
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Use Retry-After header if available
      const retryAfter = error.headers?.['retry-after'];
      const waitTime = retryAfter 
        ? parseInt(retryAfter) * 1000 
        : (baseDelay * Math.pow(2, attempt)) + Math.random() * 1000;
      
      console.log(`Rate limited (attempt ${attempt + 1}/${maxRetries}), ` +
                  `waiting ${(waitTime / 1000).toFixed(1)}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Usage
const response = await makeRequestWithRetry([
  { role: 'user', content: 'Hello!' }
]);
```

### Request Queuing

For high-volume applications, implement a request queue:

```python
import asyncio
from collections import deque
from datetime import datetime, timedelta

class RateLimitedQueue:
    def __init__(self, requests_per_minute=60):
        self.rpm = requests_per_minute
        self.request_times = deque(maxlen=requests_per_minute)
    
    async def wait_for_slot(self):
        """Wait until a rate limit slot is available."""
        while len(self.request_times) >= self.rpm:
            oldest = self.request_times[0]
            wait_until = oldest + timedelta(minutes=1)
            wait_seconds = (wait_until - datetime.now()).total_seconds()
            
            if wait_seconds > 0:
                await asyncio.sleep(wait_seconds)
            
            # Remove expired entries
            cutoff = datetime.now() - timedelta(minutes=1)
            while self.request_times and self.request_times[0] < cutoff:
                self.request_times.popleft()
    
    def record_request(self):
        """Record a successful request."""
        self.request_times.append(datetime.now())

# Usage
queue = RateLimitedQueue(requests_per_minute=60)

async def make_request(messages):
    await queue.wait_for_slot()
    response = await client.chat.completions.create(
        model="vllm-primary",
        messages=messages
    )
    queue.record_request()
    return response
```

## Best Practices

:::tip[Avoiding Rate Limits]
1. **Implement request queuing** - Don't burst requests
2. **Use batch endpoints** when processing multiple items
3. **Cache responses** when appropriate (especially for identical queries)
4. **Monitor usage** via response headers
5. **Pre-fetch during low traffic** if you have predictable workloads
:::

### Monitor Your Usage

Track rate limit headers to stay ahead of limits:

```python
def make_request_with_monitoring(messages):
    response = client.chat.completions.create(
        model="vllm-primary",
        messages=messages
    )
    
    # Access rate limit headers from raw response
    remaining = response.response.headers.get('X-RateLimit-Remaining', 'unknown')
    limit = response.response.headers.get('X-RateLimit-Limit', 'unknown')
    
    if remaining != 'unknown' and int(remaining) < 10:
        print(f"Warning: Only {remaining}/{limit} requests remaining")
    
    return response
```

## Requesting Higher Limits

### Self-Service Upgrade

1. Log in to [console.solidrust.ai](https://console.solidrust.ai)
2. Navigate to **Subscription** > **Upgrade Plan**
3. Select your desired tier
4. Complete payment

### Enterprise Limits

For custom enterprise limits:
- Email: support@solidrust.ai
- Subject: "Enterprise Rate Limit Request"
- Include:
  - Expected requests per minute/hour/day
  - Use case description
  - Current tier and account email

## Related

- [Error Handling](/api/errors/) - Complete error reference including 429 responses
- [Authentication](/getting-started/authentication/) - API key management
- [API Keys](/getting-started/api-keys/) - How to generate and manage API keys
