---
title: Code Generation Example
description: Generate and explain code using SolidRusT AI
---

Examples of using SolidRusT AI for code generation, explanation, and review.

## Generate Code from Description

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

def generate_code(description: str, language: str = "python") -> str:
    response = client.chat.completions.create(
        model="vllm-primary",
        messages=[
            {
                "role": "system",
                "content": f"""You are a skilled {language} programmer.
Generate clean, well-documented code based on the user's description.
Include comments explaining key parts of the code.
Only output the code, no explanations."""
            },
            {"role": "user", "content": description}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content

# Example usage
code = generate_code(
    "Create a function that validates email addresses using regex"
)
print(code)
```

## Explain Existing Code

```python
def explain_code(code: str) -> str:
    response = client.chat.completions.create(
        model="vllm-primary",
        messages=[
            {
                "role": "system",
                "content": """You are a programming tutor.
Explain the given code in simple terms:
1. What the code does overall
2. Key components and their purposes
3. Any potential issues or improvements"""
            },
            {"role": "user", "content": f"Explain this code:\n```\n{code}\n```"}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content

# Example
code_to_explain = '''
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
'''

print(explain_code(code_to_explain))
```

## Code Review

```python
def review_code(code: str, focus: str = "general") -> str:
    response = client.chat.completions.create(
        model="vllm-primary",
        messages=[
            {
                "role": "system",
                "content": f"""You are a senior code reviewer.
Review the code focusing on: {focus}

Provide feedback on:
- Code quality and readability
- Potential bugs or edge cases
- Performance considerations
- Security concerns (if applicable)
- Suggested improvements

Be constructive and specific."""
            },
            {"role": "user", "content": f"Review this code:\n```\n{code}\n```"}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content

# Example with security focus
code = '''
def login(username, password):
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    return db.execute(query)
'''

print(review_code(code, focus="security"))
```

## Convert Between Languages

```python
def convert_code(code: str, from_lang: str, to_lang: str) -> str:
    response = client.chat.completions.create(
        model="vllm-primary",
        messages=[
            {
                "role": "system",
                "content": f"""Convert the following {from_lang} code to {to_lang}.
Maintain the same functionality and use idiomatic {to_lang} patterns.
Only output the converted code."""
            },
            {"role": "user", "content": code}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content

# Python to JavaScript
python_code = '''
def greet(name):
    return f"Hello, {name}!"

names = ["Alice", "Bob", "Charlie"]
greetings = [greet(name) for name in names]
'''

js_code = convert_code(python_code, "Python", "JavaScript")
print(js_code)
```

## Generate Unit Tests

```python
def generate_tests(code: str, framework: str = "pytest") -> str:
    response = client.chat.completions.create(
        model="vllm-primary",
        messages=[
            {
                "role": "system",
                "content": f"""Generate unit tests for the given code using {framework}.
Include tests for:
- Normal cases
- Edge cases
- Error handling
Only output the test code."""
            },
            {"role": "user", "content": f"Generate tests for:\n```\n{code}\n```"}
        ],
        temperature=0.2
    )

    return response.choices[0].message.content

# Example
function_code = '''
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b
'''

tests = generate_tests(function_code)
print(tests)
```

## Tips

- Use low temperature (0.1-0.3) for deterministic code generation
- Be specific in your descriptions for better results
- Include context about the codebase when relevant
- Always review and test generated code

## Related

- [Chat Completions API](/api/chat-completions/)
- [Chat Bot Example](/examples/chatbot/)
