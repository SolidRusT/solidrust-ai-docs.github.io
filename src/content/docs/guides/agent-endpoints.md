---
title: Agent Endpoints
description: Tool-enabled AI agents with built-in RAG capabilities
---

The SolidRusT AI Agent endpoints provide a powerful way to interact with an AI assistant that has built-in access to RAG (Retrieval-Augmented Generation) tools. The agent can autonomously search your knowledge base and provide grounded, accurate responses.

## Overview

Agent endpoints at `/v1/agent/*` give you:

- **Tool-enabled chat**: AI assistant with access to semantic search, knowledge graph, and hybrid search
- **Automatic RAG**: Agent decides when and how to search the knowledge base
- **Transparent tool usage**: See which tools were called and what they returned
- **Conversation history**: Maintain context across multiple turns

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/agent/chat` | POST | Chat with tool-enabled agent |
| `/v1/agent/tools` | GET | List available tools |
| `/v1/agent/health` | GET | Health check for agent service |

## Agent Chat

The most powerful endpoint - chat with an AI agent that can search your knowledge base.

### curl

```bash
curl -X POST "https://api.solidrust.ai/v1/agent/chat" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I implement RAG with Python?",
    "temperature": 0.7,
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
    history: list = None,
    system_prompt: str = None,
    temperature: float = 0.7,
    max_tokens: int = 1024
) -> dict:
    """Chat with tool-enabled agent."""
    payload = {
        "message": message,
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    
    if history:
        payload["history"] = history
    
    if system_prompt:
        payload["system_prompt"] = system_prompt
    
    response = requests.post(
        f"{BASE_URL}/v1/agent/chat",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json=payload
    )
    return response.json()

# Simple question
result = agent_chat("What are the RAG endpoints available?")

if result["success"]:
    print(f"Agent: {result['response']}")
    
    # See which tools were used
    if result.get("tool_calls"):
        print("\nTools used:")
        for tool_call in result["tool_calls"]:
            print(f"  - {tool_call['tool']}: {tool_call['arguments']}")
else:
    print(f"Error: {result.get('error')}")
```

### JavaScript

```javascript
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://api.solidrust.ai';

async function agentChat(message, options = {}) {
  const payload = {
    message,
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 1024,
  };

  if (options.history) payload.history = options.history;
  if (options.system_prompt) payload.system_prompt = options.system_prompt;

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
const result = await agentChat('How do I get started with embeddings?');

if (result.success) {
  console.log('Agent:', result.response);
  
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

Maintain context across multiple turns:

```python
conversation = []

def chat_with_history(message: str) -> str:
    """Chat with conversation history."""
    result = agent_chat(
        message=message,
        history=conversation
    )
    
    if result["success"]:
        # Update conversation history
        conversation.append({"role": "user", "content": message})
        conversation.append({"role": "assistant", "content": result["response"]})
        return result["response"]
    
    return f"Error: {result.get('error')}"

# Multi-turn conversation
print(chat_with_history("What is semantic search?"))
print(chat_with_history("How is it different from keyword search?"))  # Agent remembers context
print(chat_with_history("Show me an example"))  # Agent knows what "it" refers to
```

## Custom System Prompts

Guide the agent's behavior with custom instructions:

```python
system_prompt = """
You are a helpful AI assistant specialized in API documentation.
Always provide code examples when explaining concepts.
Keep responses concise and developer-friendly.
Cite sources from the knowledge base when available.
"""

result = agent_chat(
    message="How do I authenticate?",
    system_prompt=system_prompt,
    temperature=0.3  # Lower temperature for more focused responses
)
```

## List Available Tools

See what tools the agent can use:

### curl

```bash
curl -X GET "https://api.solidrust.ai/v1/agent/tools" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Python

```python
def list_agent_tools() -> dict:
    """Get list of available agent tools."""
    response = requests.get(
        f"{BASE_URL}/v1/agent/tools",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    return response.json()

tools = list_agent_tools()
print(f"Agent has access to {tools['count']} tools:\n")

for tool in tools["tools"]:
    print(f"- {tool['name']}: {tool['description']}")
    print(f"  Parameters: {list(tool.get('parameters', {}).keys())}\n")
```

### Response Example

```json
{
  "tools": [
    {
      "name": "SemanticSearchTool",
      "description": "Search the knowledge base using semantic similarity",
      "parameters": {
        "query": "string",
        "limit": "integer",
        "min_score": "float"
      }
    },
    {
      "name": "HybridSearchTool",
      "description": "Combined semantic and knowledge graph search",
      "parameters": {
        "query": "string",
        "semantic_weight": "float",
        "graph_weight": "float"
      }
    },
    {
      "name": "KnowledgeGraphTool",
      "description": "Query entity relationships in the knowledge graph",
      "parameters": {
        "entity": "string",
        "depth": "integer",
        "relationship_types": "array"
      }
    }
  ],
  "count": 3
}
```

## Built-in Tools

The agent has access to these RAG tools:

### SemanticSearchTool

Searches the knowledge base using vector similarity.

**When the agent uses it:**
- Questions about concepts or meanings
- "How to" queries
- Finding similar documents

**Parameters:**
- `query` (string): Search query
- `limit` (integer): Max results (default: 10)
- `min_score` (float): Minimum similarity score (default: 0.5)

### HybridSearchTool

Combines semantic search with knowledge graph relationships.

**When the agent uses it:**
- Complex queries needing multiple approaches
- Questions about relationships between concepts
- Comprehensive research questions

**Parameters:**
- `query` (string): Search query
- `semantic_weight` (float): Weight for semantic results (default: 0.7)
- `graph_weight` (float): Weight for graph results (default: 0.3)
- `entity_boost` (array): Entities to boost in ranking

### KnowledgeGraphTool

Explores entity relationships in the knowledge graph.

**When the agent uses it:**
- Questions about connections between topics
- "What is related to X?" queries
- Exploring concept networks

**Parameters:**
- `entity` (string): Starting entity name
- `depth` (integer): Traversal depth (1-5, default: 1)
- `relationship_types` (array): Filter by relationship types
- `direction` (string): "outgoing", "incoming", or "both" (default: "both")

## Health Check

Verify agent service is running:

```bash
curl -X GET "https://api.solidrust.ai/v1/agent/health" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "status": "healthy",
  "service": "agent",
  "tools_available": 3
}
```

## Agent vs Direct RAG

| Approach | Best For | Control |
|----------|----------|----------|
| **Agent Chat** | Users who want automatic RAG | Agent decides which tools to use |
| **Direct RAG endpoints** | Developers who need precise control | You choose search strategy |

### When to Use Agent Chat

- Building chatbots or Q&A systems
- Users don't need to understand RAG mechanics
- Questions require multiple search strategies
- Want automatic tool selection

### When to Use Direct RAG

- Building custom RAG pipelines
- Need precise control over search parameters
- Implementing specific retrieval strategies
- Performance-critical applications

## Error Handling

```python
def safe_agent_chat(message: str) -> str:
    """Agent chat with error handling."""
    try:
        result = agent_chat(message)
        
        if not result.get("success"):
            error = result.get("error", "Unknown error")
            return f"Agent error: {error}"
        
        return result["response"]
    
    except requests.exceptions.RequestException as e:
        return f"Network error: {str(e)}"
    except Exception as e:
        return f"Unexpected error: {str(e)}"

# Usage
response = safe_agent_chat("What are embeddings?")
print(response)
```

## Best Practices

### System Prompts

- Be specific about the agent's role and expertise
- Define response style and formatting preferences
- Include citation instructions
- Set boundaries on what topics to handle

### Temperature

- **0.0-0.3**: Focused, deterministic responses (good for factual Q&A)
- **0.4-0.7**: Balanced creativity and consistency (general use)
- **0.8-1.0**: More creative, varied responses (brainstorming)

### Max Tokens

- **512-1024**: Concise answers (good for most Q&A)
- **1024-2048**: Detailed explanations with examples
- **2048+**: Long-form content (guides, tutorials)

See [Context Limits](/guides/context-limits/) for model-specific limits.

### Conversation Management

- Trim history to recent messages (last 5-10 turns) to avoid token limits
- Summarize old context when needed
- Clear history for topic changes

### Performance

- Agent responses take longer than direct chat (tool execution overhead)
- Expect 2-5 seconds for simple queries, more for complex multi-tool queries
- Consider caching frequent questions

## Complete Example: Q&A Bot

```python
import requests
from typing import List, Dict

class AgentQABot:
    """Question-answering bot using agent endpoints."""
    
    def __init__(self, api_key: str, base_url: str = "https://api.solidrust.ai"):
        self.api_key = api_key
        self.base_url = base_url
        self.conversation: List[Dict[str, str]] = []
        self.system_prompt = """
        You are a helpful API documentation assistant.
        Answer questions accurately using the knowledge base.
        Provide code examples when relevant.
        Cite sources when available.
        If you don't know, say so - don't make things up.
        """
    
    def ask(self, question: str) -> dict:
        """Ask the agent a question."""
        response = requests.post(
            f"{self.base_url}/v1/agent/chat",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "message": question,
                "history": self.conversation[-10:],  # Last 10 turns
                "system_prompt": self.system_prompt,
                "temperature": 0.3,
                "max_tokens": 1024
            }
        )
        
        result = response.json()
        
        if result.get("success"):
            # Update history
            self.conversation.append({"role": "user", "content": question})
            self.conversation.append({"role": "assistant", "content": result["response"]})
        
        return result
    
    def reset(self):
        """Clear conversation history."""
        self.conversation = []

# Usage
bot = AgentQABot(api_key="YOUR_API_KEY")

result = bot.ask("What is semantic search?")
if result["success"]:
    print(f"Answer: {result['response']}")
    
    if result.get("tool_calls"):
        print(f"\nSources: Agent searched the knowledge base")
        for call in result["tool_calls"]:
            print(f"  - Used {call['tool']}")

# Follow-up (with context)
result = bot.ask("Show me a Python example")
print(f"\nFollow-up: {result['response']}")

# Start fresh topic
bot.reset()
result = bot.ask("How do I get an API key?")
print(f"\nNew topic: {result['response']}")
```

## Related

- [RAG Applications](/guides/rag/) - Direct RAG endpoints for custom pipelines
- [Context Limits](/guides/context-limits/) - Token limits and model capabilities
- [Rate Limits](/guides/rate-limits/) - API rate limiting and quotas
- [Agent Chat Example](/examples/agent-chat/) - Complete working examples
