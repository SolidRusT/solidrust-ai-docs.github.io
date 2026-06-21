---
title: Agent Chat
description: Chat with a tool-enabled AI agent that has built-in RAG and memory capabilities
---

The Agent Chat endpoint provides an AI assistant that can autonomously use tools to search the knowledge base, recall past conversations, and store facts for future use.

## Endpoint

```
POST https://api.solidrust.ai/v1/agent/chat
```

## Request Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | string | ✅ Yes | — | The user's message |
| `system_prompt` | string | No | — | Custom system prompt to guide behavior |
| `history` | object[] | No | — | Previous conversation turns |
| `temperature` | number | No | 0.7 | Sampling temperature (0.0–2.0) |
| `max_tokens` | integer | No | 1024 | Maximum response tokens |

### History Format

Each history entry has `role` (`user` or `assistant`) and `content`:

```json
{
  "history": [
    {"role": "user", "content": "What is semantic search?"},
    {"role": "assistant", "content": "Semantic search finds documents by meaning..."}
  ]
}
```

## Example Request

### curl

```bash
curl -X POST "https://api.solidrust.ai/v1/agent/chat" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I implement RAG with Python?",
    "temperature": 0.3,
    "max_tokens": 1024
  }'
```

### Python

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def agent_chat(
    message: str,
    history: list[dict] | None = None,
    system_prompt: str | None = None,
    temperature: float = 0.7,
    max_tokens: int = 1024,
) -> dict:
    """Chat with the tool-enabled agent."""
    payload = {
        "message": message,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if history:
        payload["history"] = history
    if system_prompt:
        payload["system_prompt"] = system_prompt

    response = requests.post(
        f"{BASE_URL}/v1/agent/chat",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json=payload,
    )
    return response.json()

result = agent_chat("How do I implement RAG with Python?")

if result["success"]:
    print(f"Agent: {result['response']}")

    if result.get("tool_calls"):
        print("\nTools used:")
        for call in result["tool_calls"]:
            print(f"  - {call['tool']}")
else:
    print(f"Error: {result.get('error')}")
```

### JavaScript

```javascript
async function agentChat(message, options = {}) {
  const payload = {
    message,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 1024,
  };
  if (options.history) payload.history = options.history;
  if (options.systemPrompt) payload.system_prompt = options.systemPrompt;

  const res = await fetch(`${BASE_URL}/v1/agent/chat`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

## Example Response

```json
{
  "success": true,
  "response": "To implement RAG with Python, you can use the SolidRusT AI API. First, search the knowledge base with hybrid search, then pass the results as context to the chat completions endpoint...",
  "tool_calls": [
    {
      "tool": "HybridSearchTool",
      "arguments": {"query": "Python RAG implementation", "limit": 5},
      "result": {"total": 3, "results": [...]}
    },
    {
      "tool": "KnowledgeGraphTool",
      "arguments": {"entity": "RAG", "depth": 1},
      "result": {"entities": [...], "relationships": [...]}
    }
  ]
}
```

## Multi-Turn Conversations

Maintain context by passing previous turns:

```python
conversation = []

def chat_with_history(message: str, system_prompt: str = None) -> str:
    result = agent_chat(
        message=message,
        history=conversation,
        system_prompt=system_prompt,
    )

    if result["success"]:
        conversation.append({"role": "user", "content": message})
        conversation.append({"role": "assistant", "content": result["response"]})
        return result["response"]

    return f"Error: {result.get('error')}"

# Multi-turn
print(chat_with_history("What is semantic search?"))
print(chat_with_history("How is it different from keyword search?"))
print(chat_with_history("Show me a code example"))
```

## Custom System Prompts

```python
system_prompt = """
You are a knowledgeable API documentation assistant.
Always cite sources from the knowledge base.
Provide code examples in Python when possible.
Keep responses concise and developer-friendly.
If you don't know, say so honestly.
"""

result = agent_chat(
    message="How do I authenticate API requests?",
    system_prompt=system_prompt,
    temperature=0.3,
)
```

## Available Tools

The agent has access to these built-in tools:

| Tool | Description |
|------|-------------|
| **SemanticSearchTool** | Vector similarity search across the knowledge base |
| **KnowledgeGraphTool** | Entity relationship queries in Neo4j |
| **HybridSearchTool** | Combined semantic + graph search with entity extraction |
| **MemorySearchTool** | Search companion memory (vector + keyword + graph + KB) |
| **MemoryStoreTool** | Store important facts for future recall |
| **MemoryStatsTool** | Check memory system health and population |

See [Agent Tools](/api/agent-tools/) for complete tool schemas and parameters.

## Agent Health

```
GET /v1/agent/health
```

```bash
curl "https://api.solidrust.ai/v1/agent/health" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

| Status | Meaning |
|--------|---------|
| `healthy` | All providers reachable |
| `degraded` | One provider down, fallback active |
| `unhealthy` | No providers available |

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Missing or invalid parameters |
| 401 | `INVALID_API_KEY` | Missing or invalid API key |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many requests |
| 503 | `service_unavailable` | No LLM provider available |

## Agent vs Direct Endpoints

| Approach | Best For | Control |
|----------|----------|----------|
| **Agent Chat** | Users who want automatic tool selection | Agent decides which search strategy to use |
| **Direct RAG** | Developers building custom pipelines | You control search parameters and strategy |

## Related

- [Agent Tools](/api/agent-tools/) — Complete tool schemas and how to use them
- [Chat Completions](/api/chat-completions/) — Direct LLM chat without tools
- [RAG Applications Guide](/guides/rag/) — Building RAG pipelines manually
