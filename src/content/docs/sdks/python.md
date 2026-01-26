---
title: Python SDK
description: Python client library for SolidRusT AI
---

:::note[Coming Soon]
The official `solidrust-ai` Python package is under development.
:::

In the meantime, use the OpenAI Python SDK with our API.

## Installation

```bash
pip install openai
```

## Quick Start

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

# Chat completion
response = client.chat.completions.create(
    model="vllm-primary",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is Python?"}
    ]
)

print(response.choices[0].message.content)
```

## Async Support

```python
from openai import AsyncOpenAI
import asyncio

client = AsyncOpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

async def main():
    response = await client.chat.completions.create(
        model="vllm-primary",
        messages=[{"role": "user", "content": "Hello!"}]
    )
    print(response.choices[0].message.content)

asyncio.run(main())
```

## Streaming

```python
stream = client.chat.completions.create(
    model="vllm-primary",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## Embeddings

```python
response = client.embeddings.create(
    model="bge-m3",
    input="Text to embed"
)

embedding = response.data[0].embedding
print(f"Embedding dimension: {len(embedding)}")
```

## Error Handling

```python
from openai import OpenAI, APIError, RateLimitError, AuthenticationError

try:
    response = client.chat.completions.create(
        model="vllm-primary",
        messages=[{"role": "user", "content": "Hello"}]
    )
except AuthenticationError:
    print("Invalid API key")
except RateLimitError:
    print("Rate limited - implement backoff")
except APIError as e:
    print(f"API error: {e}")
```

## Environment Configuration

```python
import os

client = OpenAI(
    api_key=os.environ.get("SOLIDRUST_API_KEY"),
    base_url=os.environ.get("SOLIDRUST_BASE_URL", "https://api.solidrust.ai/v1")
)
```

## Type Hints

The OpenAI SDK includes full type hints for IDE support:

```python
from openai import OpenAI
from openai.types.chat import ChatCompletion

client = OpenAI(...)

response: ChatCompletion = client.chat.completions.create(...)
```
