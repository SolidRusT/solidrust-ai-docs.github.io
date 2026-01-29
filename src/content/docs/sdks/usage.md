---
title: SDK Usage Guide
description: Complete examples for using SolidRusT AI API with Python, JavaScript, and cURL
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

This guide provides complete working examples for integrating the SolidRusT AI API into your applications. Since our API is OpenAI-compatible, you can use the official OpenAI SDKs with a custom base URL.

## Configuration

| Setting | Value |
|---------|-------|
| **Base URL** | `https://api.solidrust.ai/v1` |
| **Chat Model** | `vllm-primary` |
| **Embeddings Model** | `bge-m3` |
| **API Keys** | [console.solidrust.ai](https://console.solidrust.ai) |

## Installation

<Tabs>
  <TabItem label="Python">
```bash
pip install openai
```
  </TabItem>
  <TabItem label="JavaScript">
```bash
npm install openai
# or
yarn add openai
# or
pnpm add openai
```
  </TabItem>
  <TabItem label="cURL">
```bash
# cURL is pre-installed on most systems
# No additional installation required
```
  </TabItem>
</Tabs>

## Client Setup

<Tabs>
  <TabItem label="Python">
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)
```
  </TabItem>
  <TabItem label="JavaScript">
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});
```
  </TabItem>
  <TabItem label="cURL">
```bash
# Set your API key as an environment variable
export SOLIDRUST_API_KEY="YOUR_API_KEY"
```
  </TabItem>
</Tabs>

---

## Basic Chat Completion

Send a message and receive a complete response.

<Tabs>
  <TabItem label="Python">
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

response = client.chat.completions.create(
    model="vllm-primary",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ]
)

print(response.choices[0].message.content)
```
  </TabItem>
  <TabItem label="JavaScript">
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'vllm-primary',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' }
  ],
});

console.log(response.choices[0].message.content);
```
  </TabItem>
  <TabItem label="cURL">
```bash
curl https://api.solidrust.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SOLIDRUST_API_KEY" \
  -d '{
    "model": "vllm-primary",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ]
  }'
```
  </TabItem>
</Tabs>

### Example Response

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1706124800,
  "model": "vllm-primary",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 8,
    "total_tokens": 33
  }
}
```

---

## Streaming Responses

Receive tokens as they are generated for a more responsive user experience.

<Tabs>
  <TabItem label="Python">
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

stream = client.chat.completions.create(
    model="vllm-primary",
    messages=[
        {"role": "user", "content": "Write a short poem about the ocean."}
    ],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)

print()  # Newline at end
```

**Async version:**

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
        messages=[{"role": "user", "content": "Write a short poem about the ocean."}],
        stream=True
    )

    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)

asyncio.run(stream_response())
```
  </TabItem>
  <TabItem label="JavaScript">
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'vllm-primary',
  messages: [
    { role: 'user', content: 'Write a short poem about the ocean.' }
  ],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}
```

**Browser fetch version:**

```typescript
const response = await fetch('https://api.solidrust.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: JSON.stringify({
    model: 'vllm-primary',
    messages: [{ role: 'user', content: 'Write a short poem about the ocean.' }],
    stream: true,
  }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const text = decoder.decode(value);
  for (const line of text.split('\n')) {
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
  </TabItem>
  <TabItem label="cURL">
```bash
curl https://api.solidrust.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SOLIDRUST_API_KEY" \
  -N \
  -d '{
    "model": "vllm-primary",
    "messages": [
      {"role": "user", "content": "Write a short poem about the ocean."}
    ],
    "stream": true
  }'
```

The `-N` flag disables buffering so you see tokens as they arrive.
  </TabItem>
</Tabs>

### Streaming Response Format

Each chunk arrives as a Server-Sent Event:

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":" ocean"},"finish_reason":null}]}

data: [DONE]
```

---

## Embeddings

Generate vector embeddings for semantic search, similarity matching, and RAG applications.

<Tabs>
  <TabItem label="Python">
```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

# Single text embedding
response = client.embeddings.create(
    model="bge-m3",
    input="The quick brown fox jumps over the lazy dog."
)

embedding = response.data[0].embedding
print(f"Embedding dimension: {len(embedding)}")
print(f"First 5 values: {embedding[:5]}")

# Multiple texts at once
response = client.embeddings.create(
    model="bge-m3",
    input=[
        "First document text",
        "Second document text",
        "Third document text"
    ]
)

for i, item in enumerate(response.data):
    print(f"Document {i}: {len(item.embedding)} dimensions")
```
  </TabItem>
  <TabItem label="JavaScript">
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

// Single text embedding
const response = await client.embeddings.create({
  model: 'bge-m3',
  input: 'The quick brown fox jumps over the lazy dog.',
});

const embedding = response.data[0].embedding;
console.log(`Embedding dimension: ${embedding.length}`);
console.log(`First 5 values: ${embedding.slice(0, 5)}`);

// Multiple texts at once
const batchResponse = await client.embeddings.create({
  model: 'bge-m3',
  input: [
    'First document text',
    'Second document text',
    'Third document text'
  ],
});

batchResponse.data.forEach((item, i) => {
  console.log(`Document ${i}: ${item.embedding.length} dimensions`);
});
```
  </TabItem>
  <TabItem label="cURL">
```bash
# Single text embedding
curl https://api.solidrust.ai/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SOLIDRUST_API_KEY" \
  -d '{
    "model": "bge-m3",
    "input": "The quick brown fox jumps over the lazy dog."
  }'

# Multiple texts at once
curl https://api.solidrust.ai/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SOLIDRUST_API_KEY" \
  -d '{
    "model": "bge-m3",
    "input": [
      "First document text",
      "Second document text",
      "Third document text"
    ]
  }'
```
  </TabItem>
</Tabs>

### Example Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [0.0123, -0.0456, 0.0789, ...]
    }
  ],
  "model": "bge-m3",
  "usage": {
    "prompt_tokens": 10,
    "total_tokens": 10
  }
}
```

:::tip[Embedding Uses]
The `bge-m3` model produces 1024-dimensional embeddings, ideal for:
- Semantic search
- Document similarity
- Clustering
- RAG (Retrieval-Augmented Generation)
:::

---

## Environment Variables

For production use, store your API key in environment variables rather than hardcoding it.

<Tabs>
  <TabItem label="Python">
```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("SOLIDRUST_API_KEY"),
    base_url=os.environ.get("SOLIDRUST_BASE_URL", "https://api.solidrust.ai/v1")
)
```

**.env file:**
```bash
SOLIDRUST_API_KEY=your_api_key_here
SOLIDRUST_BASE_URL=https://api.solidrust.ai/v1
```
  </TabItem>
  <TabItem label="JavaScript">
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SOLIDRUST_API_KEY,
  baseURL: process.env.SOLIDRUST_BASE_URL || 'https://api.solidrust.ai/v1',
});
```

**.env file:**
```bash
SOLIDRUST_API_KEY=your_api_key_here
SOLIDRUST_BASE_URL=https://api.solidrust.ai/v1
```
  </TabItem>
  <TabItem label="cURL">
```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export SOLIDRUST_API_KEY="your_api_key_here"

# Then use in commands
curl https://api.solidrust.ai/v1/chat/completions \
  -H "Authorization: Bearer $SOLIDRUST_API_KEY" \
  ...
```
  </TabItem>
</Tabs>

---

## Error Handling

Handle API errors gracefully in your application.

<Tabs>
  <TabItem label="Python">
```python
from openai import OpenAI, APIError, RateLimitError, AuthenticationError

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

try:
    response = client.chat.completions.create(
        model="vllm-primary",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response.choices[0].message.content)
except AuthenticationError:
    print("Invalid API key. Get one at console.solidrust.ai")
except RateLimitError:
    print("Rate limit exceeded. Please retry after a short delay.")
except APIError as e:
    print(f"API error: {e.status_code} - {e.message}")
except Exception as e:
    print(f"Unexpected error: {e}")
```
  </TabItem>
  <TabItem label="JavaScript">
```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

try {
  const response = await client.chat.completions.create({
    model: 'vllm-primary',
    messages: [{ role: 'user', content: 'Hello!' }],
  });
  console.log(response.choices[0].message.content);
} catch (error) {
  if (error instanceof OpenAI.AuthenticationError) {
    console.log('Invalid API key. Get one at console.solidrust.ai');
  } else if (error instanceof OpenAI.RateLimitError) {
    console.log('Rate limit exceeded. Please retry after a short delay.');
  } else if (error instanceof OpenAI.APIError) {
    console.log(`API error: ${error.status} - ${error.message}`);
  } else {
    console.log(`Unexpected error: ${error}`);
  }
}
```
  </TabItem>
  <TabItem label="cURL">
```bash
# Check HTTP status code in response
response=$(curl -s -w "\n%{http_code}" \
  https://api.solidrust.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SOLIDRUST_API_KEY" \
  -d '{
    "model": "vllm-primary",
    "messages": [{"role": "user", "content": "Hello!"}]
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

case $http_code in
  200) echo "Success: $body" ;;
  401) echo "Invalid API key" ;;
  429) echo "Rate limited - retry later" ;;
  500) echo "Server error - retry later" ;;
  *) echo "Error $http_code: $body" ;;
esac
```
  </TabItem>
</Tabs>

---

## Next Steps

- [API Reference](/api/overview/) - Complete endpoint documentation
- [RAG Guide](/guides/rag/) - Build retrieval-augmented generation apps
- [Rate Limits](/guides/rate-limits/) - Understand usage limits
- [Examples](/examples/chatbot/) - Full application examples
