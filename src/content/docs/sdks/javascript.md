---
title: JavaScript/TypeScript SDK
description: JavaScript and TypeScript client library for SolidRusT AI
---

:::note[Coming Soon]
The official `@solidrust/ai` npm package is under development.
:::

In the meantime, use the OpenAI JavaScript SDK with our API.

## Installation

```bash
npm install openai
# or
yarn add openai
# or
pnpm add openai
```

## Quick Start

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://artemis.hq.solidrust.net/v1',
});

const response = await client.chat.completions.create({
  model: 'qwen3-4b',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is JavaScript?' }
  ],
});

console.log(response.choices[0].message.content);
```

## Streaming

```typescript
const stream = await client.chat.completions.create({
  model: 'qwen3-4b',
  messages: [{ role: 'user', content: 'Tell me a story' }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

## Embeddings

```typescript
const response = await client.embeddings.create({
  model: 'bge-m3',
  input: 'Text to embed',
});

const embedding = response.data[0].embedding;
console.log(`Embedding dimension: ${embedding.length}`);
```

## Error Handling

```typescript
import OpenAI from 'openai';

try {
  const response = await client.chat.completions.create({
    model: 'qwen3-4b',
    messages: [{ role: 'user', content: 'Hello' }],
  });
} catch (error) {
  if (error instanceof OpenAI.AuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof OpenAI.RateLimitError) {
    console.log('Rate limited - implement backoff');
  } else if (error instanceof OpenAI.APIError) {
    console.log(`API error: ${error.message}`);
  }
}
```

## TypeScript Types

Full TypeScript support with proper types:

```typescript
import OpenAI from 'openai';
import type { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources/chat';

const messages: ChatCompletionMessageParam[] = [
  { role: 'user', content: 'Hello!' }
];

const response: ChatCompletion = await client.chat.completions.create({
  model: 'qwen3-4b',
  messages,
});
```

## Browser Usage

The OpenAI SDK works in browsers, but **never expose your API key in client-side code**.

Use a backend proxy:

```typescript
// Backend (Node.js)
app.post('/api/chat', async (req, res) => {
  const response = await client.chat.completions.create({
    model: 'qwen3-4b',
    messages: req.body.messages,
  });
  res.json(response);
});

// Frontend
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
});
```

## Environment Variables

```typescript
const client = new OpenAI({
  apiKey: process.env.SOLIDRUST_API_KEY,
  baseURL: process.env.SOLIDRUST_BASE_URL || 'https://artemis.hq.solidrust.net/v1',
});
```
