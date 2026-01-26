---
title: Streaming Responses
description: Real-time streaming with Server-Sent Events
---

Streaming allows you to receive responses incrementally as they're generated, improving perceived latency.

## Enabling Streaming

Set `stream: true` in your request:

```json
{
  "model": "vllm-primary",
  "messages": [{"role": "user", "content": "Tell me a story"}],
  "stream": true
}
```

## Response Format

Streaming responses use Server-Sent Events (SSE):

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890,"model":"vllm-primary","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890,"model":"vllm-primary","choices":[{"index":0,"delta":{"content":"Once"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1234567890,"model":"vllm-primary","choices":[{"index":0,"delta":{"content":" upon"},"finish_reason":null}]}

data: [DONE]
```

## Python Implementation

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

stream = client.chat.completions.create(
    model="vllm-primary",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)

print()  # Newline at end
```

### Async Streaming

```python
from openai import AsyncOpenAI
import asyncio

client = AsyncOpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

async def stream_response():
    stream = await client.chat.completions.create(
        model="vllm-primary",
        messages=[{"role": "user", "content": "Tell me a story"}],
        stream=True
    )

    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)

asyncio.run(stream_response())
```

## JavaScript Implementation

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'vllm-primary',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}
```

## Web Browser (fetch)

```javascript
const response = await fetch('https://api.solidrust.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: JSON.stringify({
    model: 'vllm-primary',
    messages: [{ role: 'user', content: 'Tell me a story' }],
    stream: true,
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const text = decoder.decode(value);
  const lines = text.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ') && line !== 'data: [DONE]') {
      const data = JSON.parse(line.slice(6));
      const content = data.choices[0]?.delta?.content;
      if (content) {
        console.log(content);
      }
    }
  }
}
```

## Tips

:::tip[Best Practices]
- Use streaming for long responses to improve UX
- Handle connection drops gracefully
- Consider buffering for word-by-word display
:::
