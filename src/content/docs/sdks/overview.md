---
title: SDK Overview
description: How to call the SolidRusT AI API from Python, JavaScript, and curl
---

There is **no** first-party `solidrust-ai` / `@solidrust/ai` package today.
Those names were "Coming Soon" with no issue and no roadmap item. That is
fixed: they are tracked as Later work.

| Language | What you use now | First-party SDK |
|----------|------------------|-----------------|
| Python | Official `openai` SDK | [#1](https://poseidon.hq.solidrust.net:30008/shaun/solidrust-ai-docs.github.io/issues/1) |
| JavaScript/TypeScript | Official `openai` SDK | [#2](https://poseidon.hq.solidrust.net:30008/shaun/solidrust-ai-docs.github.io/issues/2) |
| curl | HTTPS | — |

## Using the OpenAI SDKs

OpenAI-compatible chat and embeddings. Change the base URL. Data-layer
(` /data/v1/... `) is a separate REST surface — not in the OpenAI client.

### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_SOLIDRUST_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

response = client.chat.completions.create(
    model="vllm-primary",  # Gemma 4 12B IT QAT
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### JavaScript

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_SOLIDRUST_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'vllm-primary', // Gemma 4 12B IT QAT
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

See [SDK Usage](/sdks/usage/) for streaming, embeddings, and curl.
