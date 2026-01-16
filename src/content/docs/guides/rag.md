---
title: RAG Applications
description: Build retrieval-augmented generation applications with SolidRusT AI
---

Retrieval-Augmented Generation (RAG) combines document retrieval with AI generation to provide accurate, context-aware responses.

## Overview

RAG enhances LLM responses by:

1. **Retrieving** relevant documents from a knowledge base
2. **Augmenting** the prompt with retrieved context
3. **Generating** responses grounded in the retrieved information

## SolidRusT AI Data Layer

:::note[Coming Soon]
Full data layer documentation will be available here.
:::

The SolidRusT AI platform includes a built-in data layer for RAG applications:

```
POST /data/query
```

## Basic RAG Pattern

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://artemis.hq.solidrust.net/v1"
)

# 1. Create embedding for the query
query = "What are the system requirements?"
query_embedding = client.embeddings.create(
    model="bge-m3",
    input=query
).data[0].embedding

# 2. Search your vector database
# (Use your preferred vector store: Pinecone, Qdrant, pgvector, etc.)
relevant_docs = vector_store.search(query_embedding, top_k=5)

# 3. Build context from retrieved documents
context = "\n\n".join([doc.text for doc in relevant_docs])

# 4. Generate response with context
response = client.chat.completions.create(
    model="qwen3-4b",
    messages=[
        {"role": "system", "content": f"""Answer questions based on the following context:

{context}

If the answer is not in the context, say "I don't have that information."""},
        {"role": "user", "content": query}
    ]
)

print(response.choices[0].message.content)
```

## Best Practices

### Chunking

- Keep chunks between 256-512 tokens
- Use overlap for better context continuity
- Consider semantic chunking for natural boundaries

### Retrieval

- Experiment with the number of retrieved documents (3-10)
- Use metadata filtering when available
- Consider hybrid search (semantic + keyword)

### Prompting

- Clearly separate context from instructions
- Instruct the model to cite sources
- Handle cases where context doesn't contain the answer

## Related

- [Embeddings API](/api/embeddings/) - Create embeddings for your documents
- [Document Q&A Example](/examples/document-qa/) - Complete RAG implementation
