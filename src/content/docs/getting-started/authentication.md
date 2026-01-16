---
title: Authentication
description: Authenticate requests to the SolidRusT AI API
---

All API requests require authentication using an API key.

## Getting an API Key

1. Sign up at [console.solidrust.ai](https://console.solidrust.ai)
2. Navigate to **API Keys** in the dashboard
3. Click **Create New Key**
4. Copy and securely store your API key

:::caution
Your API key is shown only once. Store it securely - you'll need to generate a new one if lost.
:::

## Using Your API Key

Include your API key in the `Authorization` header of every request:

```http
Authorization: Bearer YOUR_API_KEY
```

### Example

```bash
curl https://artemis.hq.solidrust.net/v1/chat/completions \
  -H "Authorization: Bearer sk_live_abc123..." \
  -H "Content-Type: application/json" \
  -d '{"model": "qwen3-4b", "messages": [{"role": "user", "content": "Hi"}]}'
```

## API Key Security

:::tip[Best Practices]
- Never commit API keys to version control
- Use environment variables in your applications
- Rotate keys periodically
- Use separate keys for development and production
:::

### Environment Variables

**Python:**
```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("SOLIDRUST_API_KEY"),
    base_url="https://artemis.hq.solidrust.net/v1"
)
```

**Node.js:**
```javascript
const client = new OpenAI({
  apiKey: process.env.SOLIDRUST_API_KEY,
  baseURL: 'https://artemis.hq.solidrust.net/v1',
});
```

## Rate Limits

API keys have rate limits based on your subscription tier. See [Rate Limits](/guides/rate-limits/) for details.

## Next Steps

- [API Overview](/api/overview/) - Explore available endpoints
- [Python SDK](/sdks/python/) - Use our official SDK
