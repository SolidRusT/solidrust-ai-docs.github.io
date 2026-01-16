---
title: Agent Chat Example
description: Build AI agents with tool-calling and RAG capabilities
---

The Agent API provides an AI assistant with built-in access to RAG tools for searching the knowledge base. The agent automatically decides when to use tools like semantic search, knowledge graph queries, and hybrid search.

## Overview

The agent endpoint differs from standard chat completions:

| Feature | Chat Completions | Agent Chat |
|---------|------------------|------------|
| Endpoint | `/v1/chat/completions` | `/v1/agent/chat` |
| RAG Access | Manual (you search first) | Automatic (agent decides) |
| Tool Calling | Your responsibility | Built-in |
| Use Case | Direct LLM responses | Grounded, knowledge-based answers |

## Basic Agent Chat

### curl

```bash
curl -X POST "https://api.solidrust.ai/v1/agent/chat" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What programming languages does the platform support?",
    "temperature": 0.7,
    "max_tokens": 1024
  }'
```

### Python

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def agent_chat(message: str, history: list = None) -> dict:
    """Send a message to the agent and get a grounded response."""
    payload = {
        "message": message,
        "temperature": 0.7,
        "max_tokens": 1024
    }

    if history:
        payload["history"] = history

    response = requests.post(
        f"{BASE_URL}/v1/agent/chat",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json=payload
    )

    return response.json()

# Simple query
result = agent_chat("What are the system requirements for the API?")

if result.get("success"):
    print("Response:", result["response"])

    # See what tools the agent used
    if result.get("tool_calls"):
        print("\nTools used:")
        for call in result["tool_calls"]:
            print(f"  - {call['tool']}: {call.get('arguments', {})}")
else:
    print("Error:", result.get("error"))
```

### JavaScript

```javascript
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.solidrust.ai';

async function agentChat(message, history = null) {
  const payload = {
    message,
    temperature: 0.7,
    max_tokens: 1024,
  };

  if (history) {
    payload.history = history;
  }

  const response = await fetch(`${BASE_URL}/v1/agent/chat`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

// Usage
const result = await agentChat('How do I authenticate API requests?');

if (result.success) {
  console.log('Response:', result.response);

  if (result.tool_calls) {
    console.log('\nTools used:');
    result.tool_calls.forEach((call) => {
      console.log(`  - ${call.tool}:`, call.arguments);
    });
  }
} else {
  console.error('Error:', result.error);
}
```

## Conversation History

Maintain context across multiple exchanges:

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

class AgentConversation:
    def __init__(self, system_prompt: str = None):
        self.history = []
        self.system_prompt = system_prompt

    def chat(self, message: str) -> str:
        payload = {
            "message": message,
            "temperature": 0.7,
            "max_tokens": 1024,
            "history": self.history
        }

        if self.system_prompt:
            payload["system_prompt"] = self.system_prompt

        response = requests.post(
            f"{BASE_URL}/v1/agent/chat",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json=payload
        )

        result = response.json()

        if result.get("success"):
            # Add to history for context continuity
            self.history.append({"role": "user", "content": message})
            self.history.append({"role": "assistant", "content": result["response"]})
            return result["response"]
        else:
            raise Exception(result.get("error", "Unknown error"))

    def clear_history(self):
        self.history = []

# Multi-turn conversation
agent = AgentConversation(
    system_prompt="You are a technical support assistant. Be concise and helpful."
)

# First question
print(agent.chat("What's the rate limit for the API?"))

# Follow-up (agent has context from previous exchange)
print(agent.chat("And what happens when I exceed it?"))

# Another follow-up
print(agent.chat("How can I request a higher limit?"))
```

## Custom System Prompts

Guide the agent's behavior and focus:

```python
# Research assistant focused on technical topics
research_agent = AgentConversation(
    system_prompt="""You are a research assistant specializing in AI and machine learning.
When answering questions:
- Search the knowledge base for relevant technical documentation
- Provide specific, detailed answers with examples
- Cite sources when available
- Acknowledge limitations if information isn't available"""
)

response = research_agent.chat("Explain how the embedding model works")

# Customer support agent
support_agent = AgentConversation(
    system_prompt="""You are a friendly customer support agent.
When helping users:
- Search for relevant troubleshooting guides
- Provide step-by-step solutions
- Use simple, non-technical language
- Offer to escalate if you can't help"""
)

response = support_agent.chat("I'm getting authentication errors")
```

## List Available Tools

Check what tools the agent has access to:

```bash
curl -X GET "https://api.solidrust.ai/v1/agent/tools" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

```python
import requests

response = requests.get(
    "https://api.solidrust.ai/v1/agent/tools",
    headers={"Authorization": f"Bearer {API_KEY}"}
)

tools = response.json()
print(f"Available tools ({tools['count']}):")
for tool in tools["tools"]:
    print(f"  - {tool['name']}: {tool['description']}")
```

Example response:

```json
{
  "tools": [
    {
      "name": "semantic_search",
      "description": "Search the knowledge base using semantic similarity",
      "parameters": {
        "query": "string",
        "limit": "integer",
        "min_score": "number"
      }
    },
    {
      "name": "hybrid_search",
      "description": "Combined semantic and knowledge graph search",
      "parameters": {
        "query": "string",
        "semantic_weight": "number",
        "graph_weight": "number"
      }
    },
    {
      "name": "knowledge_graph",
      "description": "Query entity relationships",
      "parameters": {
        "entity": "string",
        "relationship_types": "array",
        "depth": "integer"
      }
    }
  ],
  "count": 3
}
```

## Understanding Tool Calls

The response includes details about which tools the agent used:

```python
result = agent_chat("What technologies integrate with the platform?")

# Examine tool usage
for call in result.get("tool_calls", []):
    print(f"Tool: {call['tool']}")
    print(f"Arguments: {call['arguments']}")
    print(f"Result preview: {str(call.get('result', {}))[:200]}...")
    print()
```

Example tool call in response:

```json
{
  "success": true,
  "response": "The platform integrates with several technologies...",
  "tool_calls": [
    {
      "tool": "semantic_search",
      "arguments": {
        "query": "platform integrations technologies",
        "limit": 5
      },
      "result": {
        "results": [
          {
            "content": "Integration documentation...",
            "score": 0.89,
            "metadata": {"source": "integrations-guide"}
          }
        ]
      }
    }
  ]
}
```

## Error Handling

```python
import requests

def safe_agent_chat(message: str) -> str:
    """Agent chat with proper error handling."""
    try:
        response = requests.post(
            f"{BASE_URL}/v1/agent/chat",
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={"message": message},
            timeout=30  # Agent calls may take longer due to tool use
        )

        # Check HTTP status
        response.raise_for_status()

        result = response.json()

        if result.get("success"):
            return result["response"]
        else:
            # Application-level error
            error_msg = result.get("error", "Unknown error")
            print(f"Agent error: {error_msg}")
            return None

    except requests.exceptions.Timeout:
        print("Request timed out - agent may be processing complex query")
        return None
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            print("Invalid API key")
        elif e.response.status_code == 429:
            print("Rate limited - wait before retrying")
        else:
            print(f"HTTP error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
```

## When to Use Agent vs Direct RAG

| Use Agent When | Use Direct RAG When |
|----------------|---------------------|
| Questions need context from multiple sources | You know exactly what to search for |
| User queries are open-ended | You need fine-grained control over retrieval |
| You want automatic tool selection | You want to minimize latency |
| Building conversational interfaces | Building search interfaces |

## Related

- [RAG Applications Guide](/guides/rag/) - Manual RAG implementation patterns
- [Semantic Search Example](/examples/semantic-search/) - Direct RAG endpoint usage
- [Chat Bot Example](/examples/chatbot/) - Standard chat completions
