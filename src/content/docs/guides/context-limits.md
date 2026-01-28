---
title: Context Limits
description: Token limits, context windows, and model capabilities
---

Understanding context limits is essential for building reliable applications with the SolidRusT AI platform.

## Overview

Every model has limits on:

- **Input tokens**: How much text you can send in a request
- **Output tokens**: How much text the model can generate
- **Total context**: Combined input + output tokens

Exceeding these limits results in errors or truncated responses.

## Model Context Windows

### vllm-primary (Qwen2.5-Coder-3B-Instruct)

Our primary self-hosted model.

| Limit | Value | Notes |
|-------|-------|-------|
| **Max Input Tokens** | 8,192 | Input messages + system prompt |
| **Max Output Tokens** | 2,048 | Configurable via `max_tokens` parameter |
| **Total Context** | 32,768 | Full model context window |
| **Recommended Input** | ≤6,000 | Leave room for output |

**Best for:**
- Code generation and explanation
- Technical documentation Q&A
- API integration guidance
- Multi-turn conversations (with history management)

### Fallback Models

When primary model is unavailable, requests automatically failover:

#### OpenAI GPT-4o-mini

| Limit | Value |
|-------|-------|
| **Max Input Tokens** | 128,000 |
| **Max Output Tokens** | 16,384 |
| **Total Context** | 128,000 |

**Cost:** $0.15/1M input tokens, $0.60/1M output tokens

#### Anthropic Claude Haiku

| Limit | Value |
|-------|-------|
| **Max Input Tokens** | 200,000 |
| **Max Output Tokens** | 4,096 |
| **Total Context** | 200,000 |

**Cost:** $0.25/1M input tokens, $1.25/1M output tokens  
**Note:** Rate limited, used as last resort

## Embeddings Model

### bge-m3

Used for semantic search and RAG.

| Limit | Value | Notes |
|-------|-------|-------|
| **Max Input Tokens** | 8,192 | Per text input |
| **Embedding Dimensions** | 1,024 | Vector size |
| **Batch Size** | 32 | Max texts per request |

**Best practices:**
- Chunk documents to ≤512 tokens for optimal semantic search
- Use batch requests for multiple texts (up to 32)
- Cache embeddings for frequently accessed documents

## Token Counting

Estimate token counts before making requests.

### Python

```python
import tiktoken

def count_tokens(text: str, model: str = "gpt-3.5-turbo") -> int:
    """Estimate token count for text.
    
    Note: This uses OpenAI's tokenizer as an approximation.
    Actual counts may vary slightly with vllm-primary.
    """
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

# Example
text = "How do I implement RAG with Python?"
tokens = count_tokens(text)
print(f"Tokens: {tokens}")  # ~9 tokens

# Check if prompt fits in context
max_input = 8192
if tokens < max_input:
    print("Safe to send")
else:
    print(f"Too large by {tokens - max_input} tokens")
```

### JavaScript

```javascript
import { encoding_for_model } from '@dqbd/tiktoken';

function countTokens(text, model = 'gpt-3.5-turbo') {
  const encoding = encoding_for_model(model);
  const tokens = encoding.encode(text);
  encoding.free();
  return tokens.length;
}

// Example
const text = 'How do I implement RAG with Python?';
const tokens = countTokens(text);
console.log(`Tokens: ${tokens}`);
```

### Rough Estimates

Without a tokenizer library:

- **English text**: ~4 characters per token (varies by content)
- **Code**: ~3-4 characters per token
- **JSON**: ~4-5 characters per token

**Example:**
```python
def estimate_tokens(text: str) -> int:
    """Rough token estimate."""
    return len(text) // 4

# 1000 characters ≈ 250 tokens
text = "a" * 1000
print(f"Estimated tokens: {estimate_tokens(text)}")  # ~250
```

## Managing Context Length

### Truncating Input

Stay within limits by truncating input:

```python
def truncate_to_tokens(text: str, max_tokens: int = 6000) -> str:
    """Truncate text to fit within token limit."""
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    tokens = encoding.encode(text)
    
    if len(tokens) <= max_tokens:
        return text
    
    # Truncate and decode
    truncated_tokens = tokens[:max_tokens]
    return encoding.decode(truncated_tokens)

# Example
long_document = "..." * 10000  # Very long text
truncated = truncate_to_tokens(long_document, max_tokens=6000)

response = llm.chat.completions.create(
    model="vllm-primary",
    messages=[
        {"role": "system", "content": "Summarize this document."},
        {"role": "user", "content": truncated}
    ]
)
```

### Sliding Window for Long Documents

Process long documents in chunks:

```python
def process_long_document(document: str, chunk_size: int = 4000) -> list:
    """Process long document in sliding windows."""
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    tokens = encoding.encode(document)
    results = []
    
    # Process in overlapping chunks
    overlap = 500  # Tokens to overlap between chunks
    start = 0
    
    while start < len(tokens):
        end = min(start + chunk_size, len(tokens))
        chunk_tokens = tokens[start:end]
        chunk_text = encoding.decode(chunk_tokens)
        
        # Process chunk
        response = llm.chat.completions.create(
            model="vllm-primary",
            messages=[
                {"role": "user", "content": f"Analyze this section: {chunk_text}"}
            ]
        )
        results.append(response.choices[0].message.content)
        
        start = end - overlap  # Overlap for continuity
    
    return results
```

### Conversation History Management

Keep conversations within context limits:

```python
class ConversationManager:
    """Manage conversation history within token limits."""
    
    def __init__(self, max_history_tokens: int = 4000):
        self.messages = []
        self.max_tokens = max_history_tokens
    
    def add_message(self, role: str, content: str):
        """Add message to history."""
        self.messages.append({"role": role, "content": content})
        self._trim_history()
    
    def _count_tokens(self, messages: list) -> int:
        """Count tokens in message list."""
        encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
        total = 0
        for msg in messages:
            total += len(encoding.encode(msg["content"]))
            total += 4  # Message formatting overhead
        return total
    
    def _trim_history(self):
        """Remove old messages to stay under token limit."""
        while len(self.messages) > 1:  # Keep at least 1 message
            tokens = self._count_tokens(self.messages)
            if tokens <= self.max_tokens:
                break
            # Remove oldest message (but keep system if present)
            if self.messages[0]["role"] == "system":
                self.messages.pop(1)  # Remove second message
            else:
                self.messages.pop(0)  # Remove first message
    
    def get_messages(self) -> list:
        """Get current message history."""
        return self.messages

# Usage
convo = ConversationManager(max_history_tokens=4000)

convo.add_message("system", "You are a helpful assistant.")
convo.add_message("user", "What is RAG?")
convo.add_message("assistant", "RAG stands for...")
convo.add_message("user", "How do I implement it?")

# Get trimmed history for API call
response = llm.chat.completions.create(
    model="vllm-primary",
    messages=convo.get_messages()
)
```

### Summarization Strategy

Summarize old context instead of truncating:

```python
def compress_conversation(messages: list, max_tokens: int = 4000) -> list:
    """Compress conversation by summarizing old messages."""
    current_tokens = count_tokens(str(messages))
    
    if current_tokens <= max_tokens:
        return messages
    
    # Keep system message and last few turns
    system_msg = messages[0] if messages[0]["role"] == "system" else None
    recent_messages = messages[-6:]  # Last 3 turns (user + assistant)
    old_messages = messages[1:-6] if system_msg else messages[:-6]
    
    # Summarize old messages
    old_text = "\n".join([f"{m['role']}: {m['content']}" for m in old_messages])
    
    summary_response = llm.chat.completions.create(
        model="vllm-primary",
        messages=[
            {"role": "system", "content": "Summarize this conversation concisely."},
            {"role": "user", "content": old_text}
        ],
        max_tokens=500
    )
    
    summary = summary_response.choices[0].message.content
    
    # Build compressed history
    compressed = []
    if system_msg:
        compressed.append(system_msg)
    compressed.append({"role": "system", "content": f"Previous context: {summary}"})
    compressed.extend(recent_messages)
    
    return compressed
```

## max_tokens Parameter

Control output length:

### Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

# Short response (512 tokens max)
response = client.chat.completions.create(
    model="vllm-primary",
    messages=[{"role": "user", "content": "Explain RAG in one paragraph"}],
    max_tokens=512
)

# Long-form response (2048 tokens max)
response = client.chat.completions.create(
    model="vllm-primary",
    messages=[{"role": "user", "content": "Write a comprehensive guide to RAG"}],
    max_tokens=2048
)
```

### Recommendations

| Use Case | Recommended max_tokens |
|----------|------------------------|
| **Short answers** | 256-512 |
| **Explanations** | 512-1024 |
| **Code generation** | 1024-2048 |
| **Long-form content** | 2048 (model limit) |

## Error Handling

### Token Limit Errors

```python
from openai import OpenAI, BadRequestError

def safe_chat(messages: list, max_retries: int = 2) -> str:
    """Chat with automatic truncation on token errors."""
    client = OpenAI(
        api_key="YOUR_API_KEY",
        base_url="https://api.solidrust.ai/v1"
    )
    
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="vllm-primary",
                messages=messages
            )
            return response.choices[0].message.content
        
        except BadRequestError as e:
            if "token" in str(e).lower() and attempt < max_retries - 1:
                # Truncate and retry
                print(f"Token limit exceeded, truncating... (attempt {attempt + 1})")
                
                # Reduce input by 25%
                if messages[-1]["role"] == "user":
                    content = messages[-1]["content"]
                    messages[-1]["content"] = content[:len(content) * 3 // 4]
            else:
                raise
    
    raise Exception("Failed after all retries")

# Usage
try:
    result = safe_chat([
        {"role": "user", "content": very_long_text}
    ])
    print(result)
except Exception as e:
    print(f"Error: {e}")
```

## RAG and Context Limits

When using RAG, retrieved documents consume input tokens.

### Example Token Budget

For `vllm-primary` (8,192 max input tokens):

```
Token Budget:
- System prompt: 200 tokens
- User question: 50 tokens
- Retrieved documents: 4,000 tokens (5 chunks × 800 tokens)
- Conversation history: 1,000 tokens
- Buffer: 942 tokens
────────────────────────────────────
Total input: 6,192 tokens
Remaining for output: 2,000 tokens ✓
```

### Smart RAG with Token Limits

```python
def rag_with_token_limit(
    question: str,
    max_context_tokens: int = 4000,
    max_output_tokens: int = 1024
) -> str:
    """RAG that respects token limits."""
    
    # 1. Search for relevant documents
    search_results = requests.post(
        f"{BASE_URL}/data/v1/query/semantic",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={"query": question, "limit": 10}
    ).json()
    
    # 2. Build context within token budget
    context_parts = []
    current_tokens = 0
    
    for result in search_results.get("results", []):
        content = result["content"]
        content_tokens = count_tokens(content)
        
        if current_tokens + content_tokens <= max_context_tokens:
            context_parts.append(content)
            current_tokens += content_tokens
        else:
            # Truncate to fit
            remaining = max_context_tokens - current_tokens
            if remaining > 100:  # Only add if meaningful space left
                truncated = truncate_to_tokens(content, remaining)
                context_parts.append(truncated)
            break
    
    context = "\n\n".join(context_parts)
    
    # 3. Generate with controlled output
    system_prompt = f"Answer based on this context:\n\n{context}"
    
    response = llm.chat.completions.create(
        model="vllm-primary",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question}
        ],
        max_tokens=max_output_tokens
    )
    
    return response.choices[0].message.content
```

## Best Practices

### Input Management

1. **Always estimate tokens** before making requests
2. **Leave headroom** - aim for 75% of max input tokens
3. **Truncate intelligently** - keep the most relevant parts
4. **Use RAG** instead of stuffing long documents into prompts

### Output Control

1. **Set appropriate max_tokens** for your use case
2. **Monitor actual usage** via `usage` field in responses
3. **Handle incomplete responses** - check `finish_reason`

### Conversation History

1. **Trim old messages** to stay under limits
2. **Summarize context** rather than truncating
3. **Track token usage** across the conversation

### RAG Context

1. **Budget tokens** for context, question, and output
2. **Chunk documents** to 512-800 tokens for optimal retrieval
3. **Retrieve fewer, better results** instead of many low-quality chunks

## Monitoring Token Usage

Track usage in responses:

```python
response = client.chat.completions.create(
    model="vllm-primary",
    messages=[{"role": "user", "content": "Hello"}]
)

# Check token usage
usage = response.usage
print(f"Prompt tokens: {usage.prompt_tokens}")
print(f"Completion tokens: {usage.completion_tokens}")
print(f"Total tokens: {usage.total_tokens}")

# Verify within limits
if usage.prompt_tokens > 8000:
    print("Warning: Close to input limit")
```

## Related

- [Agent Endpoints](/guides/agent-endpoints/) - Tool-enabled chat with automatic RAG
- [RAG Applications](/guides/rag/) - Building retrieval-augmented generation apps
- [Rate Limits](/guides/rate-limits/) - API rate limiting and quotas
- [Streaming](/guides/streaming/) - Stream responses to handle long outputs
