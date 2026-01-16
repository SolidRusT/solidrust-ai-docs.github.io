---
title: Document Q&A Example
description: Build a document Q&A system using RAG
---

A complete example of building a document Q&A system using retrieval-augmented generation (RAG).

## Overview

This example shows how to:

1. Load and chunk documents
2. Create embeddings for document chunks
3. Store embeddings in a vector database
4. Query documents with natural language

## Python Implementation

### Setup

```bash
pip install openai chromadb
```

### Full Example

```python
from openai import OpenAI
import chromadb
from chromadb.utils import embedding_functions

# Initialize clients
client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://artemis.hq.solidrust.net/v1"
)

# Custom embedding function using SolidRusT AI
class SolidRustEmbeddings(embedding_functions.EmbeddingFunction):
    def __call__(self, input):
        response = client.embeddings.create(
            model="bge-m3",
            input=input
        )
        return [item.embedding for item in response.data]

# Initialize ChromaDB
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(
    name="documents",
    embedding_function=SolidRustEmbeddings()
)

# Example documents
documents = [
    "Python is a high-level programming language known for its simplicity.",
    "JavaScript is the language of the web, running in browsers.",
    "Rust is a systems programming language focused on safety.",
    "Go is designed for simplicity and efficient concurrency.",
    "TypeScript adds static typing to JavaScript.",
]

# Add documents to collection
collection.add(
    documents=documents,
    ids=[f"doc_{i}" for i in range(len(documents))]
)

def answer_question(question: str, n_results: int = 3) -> str:
    # Retrieve relevant documents
    results = collection.query(
        query_texts=[question],
        n_results=n_results
    )

    # Build context from retrieved documents
    context = "\n".join(results["documents"][0])

    # Generate answer
    response = client.chat.completions.create(
        model="qwen3-4b",
        messages=[
            {
                "role": "system",
                "content": f"""Answer questions based on the following context:

{context}

If the answer is not in the context, say "I don't have information about that."""
            },
            {"role": "user", "content": question}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content

# Usage
print(answer_question("What is Python known for?"))
print(answer_question("Which language is focused on safety?"))
print(answer_question("What is Java used for?"))  # Not in documents
```

## Document Chunking

For larger documents, split them into chunks:

```python
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]

        # Try to end at a sentence boundary
        if end < len(text):
            last_period = chunk.rfind('.')
            if last_period > chunk_size // 2:
                end = start + last_period + 1
                chunk = text[start:end]

        chunks.append(chunk.strip())
        start = end - overlap

    return chunks

# Load and chunk a document
with open("document.txt") as f:
    content = f.read()

chunks = chunk_text(content)
collection.add(
    documents=chunks,
    ids=[f"chunk_{i}" for i in range(len(chunks))]
)
```

## Adding Metadata

Include metadata for filtering:

```python
collection.add(
    documents=chunks,
    ids=[f"doc_{doc_id}_chunk_{i}" for i in range(len(chunks))],
    metadatas=[{
        "source": "manual.pdf",
        "page": i // 2,
        "section": "introduction"
    } for i in range(len(chunks))]
)

# Query with metadata filter
results = collection.query(
    query_texts=["installation steps"],
    n_results=5,
    where={"section": "introduction"}
)
```

## Related

- [RAG Guide](/guides/rag/)
- [Embeddings API](/api/embeddings/)
