---
title: Quick Start
description: Make your first API call to SolidRusT AI
---

Get up and running with the SolidRusT AI API in under 5 minutes.

## Prerequisites

- An API key from [console.solidrust.ai](https://console.solidrust.ai)
- A tool to make HTTP requests (curl, Python, JavaScript, etc.)

## Your First Request

### Using curl

```bash
curl https://api.solidrust.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "qwen3-4b",
    "messages": [
      {"role": "user", "content": "Hello! What can you help me with?"}
    ]
  }'
```

### Using Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

response = client.chat.completions.create(
    model="qwen3-4b",
    messages=[
        {"role": "user", "content": "Hello! What can you help me with?"}
    ]
)

print(response.choices[0].message.content)
```

### Using JavaScript

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'qwen3-4b',
  messages: [
    { role: 'user', content: 'Hello! What can you help me with?' }
  ],
});

console.log(response.choices[0].message.content);
```

## Next Steps

- [Authentication](/getting-started/authentication/) - Secure your API key
- [Chat Completions](/api/chat-completions/) - Full API reference
- [Streaming](/guides/streaming/) - Real-time response streaming
