---
title: SDK Overview
description: Official SDKs for the SolidRusT AI API
---

We provide official SDKs to simplify integration with the SolidRusT AI API.

## Available SDKs

| Language | Package | Status |
|----------|---------|--------|
| Python | `solidrust-ai` | Coming Soon |
| JavaScript/TypeScript | `@solidrust/ai` | Coming Soon |

## Using OpenAI SDKs

Since SolidRusT AI provides an OpenAI-compatible API, you can use the official OpenAI SDKs with minimal configuration changes.

### Python (openai)

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_SOLIDRUST_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

response = client.chat.completions.create(
    model="qwen3-4b",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### JavaScript (openai)

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_SOLIDRUST_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'qwen3-4b',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

## SDK Features (Coming Soon)

Our official SDKs will provide additional features beyond OpenAI compatibility:

- **RAG Integration** - Built-in methods for the data layer API
- **Tool Calling Helpers** - Simplified function/tool calling
- **Automatic Retry** - Configurable retry logic with backoff
- **Streaming Utilities** - Helper functions for SSE handling
- **Type Definitions** - Full TypeScript support

## Contributing

SDKs are open source. Contributions welcome:

- Python SDK: Coming soon
- JavaScript SDK: Coming soon
