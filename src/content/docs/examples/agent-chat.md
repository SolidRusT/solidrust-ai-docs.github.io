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

The agent accepts messages in OpenAI-compatible format:

### curl

```bash
curl -X POST "https://api.solidrust.ai/v1/agent/chat" \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What programming languages does the platform support?"}
    ],
    "temperature": 0.7,
    "max_tokens": 1024
  }'
```

### Python

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

def agent_chat(messages: list) -> dict:
    """Send messages to the agent and get a grounded response."""
    payload = {
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1024
    }

    response = requests.post(
        f"{BASE_URL}/v1/agent/chat",
        headers={
            "X-API-Key": API_KEY,
            "Content-Type": "application/json"
        },
        json=payload
    )

    return response.json()

# Simple query
result = agent_chat([
    {"role": "user", "content": "What are the system requirements for the API?"}
])

if result.get("success"):
    print("Response:", result["response"])

    # See what tools the agent used
    if result.get("tool_calls"):
        print("\nTools used:")
        for call in result["tool_calls"]:
            print(f"  - {call['name']}: {call.get('arguments', {})}")
else:
    print("Error:", result.get("error"))
```

### JavaScript

```javascript
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.solidrust.ai';

async function agentChat(messages) {
  const payload = {
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  };

  const response = await fetch(`${BASE_URL}/v1/agent/chat`, {
    method: 'POST',
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

// Usage
const result = await agentChat([
  { role: 'user', content: 'How do I authenticate API requests?' }
]);

if (result.success) {
  console.log('Response:', result.response);

  if (result.tool_calls) {
    console.log('\nTools used:');
    result.tool_calls.forEach((call) => {
      console.log(`  - ${call.name}:`, call.arguments);
    });
  }
} else {
  console.error('Error:', result.error);
}
```

## Conversation History

Maintain context across multiple exchanges using the `messages` array:

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

class AgentConversation:
    def __init__(self, system_prompt: str = None):
        self.messages = []
        if system_prompt:
            self.messages.append({"role": "system", "content": system_prompt})

    def chat(self, message: str) -> str:
        # Add user message
        self.messages.append({"role": "user", "content": message})

        response = requests.post(
            f"{BASE_URL}/v1/agent/chat",
            headers={
                "X-API-Key": API_KEY,
                "Content-Type": "application/json"
            },
            json={
                "messages": self.messages,
                "temperature": 0.7,
                "max_tokens": 1024
            }
        )

        result = response.json()

        if result.get("success"):
            # Add assistant response to history
            self.messages.append({"role": "assistant", "content": result["response"]})
            return result["response"]
        else:
            # Remove failed user message
            self.messages.pop()
            raise Exception(result.get("error", "Unknown error"))

    def clear_history(self):
        # Keep system prompt if present
        self.messages = [m for m in self.messages if m["role"] == "system"]

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

Guide the agent's behavior using the system role in messages:

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

Alternatively, include the system prompt directly in the request:

```python
response = requests.post(
    f"{BASE_URL}/v1/agent/chat",
    headers={"X-API-Key": API_KEY, "Content-Type": "application/json"},
    json={
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What is RAG?"}
        ]
    }
)
```

## List Available Tools

Check what tools the agent has access to:

```bash
curl -X GET "https://api.solidrust.ai/v1/agent/tools" \
  -H "X-API-Key: YOUR_API_KEY"
```

```python
import requests

response = requests.get(
    "https://api.solidrust.ai/v1/agent/tools",
    headers={"X-API-Key": API_KEY}
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

## Custom Tools (Pass-Through)

Inject your own tools alongside or instead of the built-in RAG tools. Custom tools are **pass-through** - when the agent calls them, you receive the tool call details in the response for client-side execution.

### Adding Custom Tools

```python
import requests

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://api.solidrust.ai"

# Define custom tools in OpenAI format
custom_tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name, e.g. 'San Francisco'"
                    }
                },
                "required": ["location"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "send_email",
            "description": "Send an email to a recipient",
            "parameters": {
                "type": "object",
                "properties": {
                    "to": {"type": "string", "description": "Recipient email"},
                    "subject": {"type": "string", "description": "Email subject"},
                    "body": {"type": "string", "description": "Email body"}
                },
                "required": ["to", "subject", "body"]
            }
        }
    }
]

response = requests.post(
    f"{BASE_URL}/v1/agent/chat",
    headers={"X-API-Key": API_KEY, "Content-Type": "application/json"},
    json={
        "messages": [{"role": "user", "content": "What's the weather in Tokyo?"}],
        "tools": custom_tools,
        "include_builtin_tools": True  # Also include RAG tools (default)
    }
)

result = response.json()

# Handle pass-through tool calls
for call in result.get("tool_calls", []):
    if call.get("is_passthrough"):
        # Execute this tool yourself
        print(f"Execute {call['name']} with args: {call['arguments']}")
        # Your implementation here...
    else:
        # Built-in tool was executed server-side
        print(f"Server executed {call['name']}: {call['result']}")
```

### Custom Tools Only (No RAG)

Use only your custom tools without the built-in RAG tools:

```python
response = requests.post(
    f"{BASE_URL}/v1/agent/chat",
    headers={"X-API-Key": API_KEY, "Content-Type": "application/json"},
    json={
        "messages": [{"role": "user", "content": "Send an email to bob@example.com"}],
        "tools": custom_tools,
        "include_builtin_tools": False  # Only use custom tools
    }
)
```

### Tool Call Response Format

Custom tool calls include `is_passthrough: true`:

```json
{
  "success": true,
  "response": "I'll check the weather in Tokyo for you.",
  "tool_calls": [
    {
      "id": "call_abc123",
      "name": "get_weather",
      "arguments": {"location": "Tokyo"},
      "result": null,
      "is_passthrough": true
    }
  ]
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

def safe_agent_chat(messages: list) -> str:
    """Agent chat with proper error handling."""
    try:
        response = requests.post(
            f"{BASE_URL}/v1/agent/chat",
            headers={
                "X-API-Key": API_KEY,
                "Content-Type": "application/json"
            },
            json={"messages": messages},
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
