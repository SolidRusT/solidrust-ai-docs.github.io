---
title: Chat Bot Example
description: Build a simple chat bot with conversation history
---

A complete example of building a chat bot that maintains conversation history.

## Python Chat Bot

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

class ChatBot:
    def __init__(self, system_prompt=None):
        self.messages = []
        if system_prompt:
            self.messages.append({
                "role": "system",
                "content": system_prompt
            })

    def chat(self, user_message):
        self.messages.append({
            "role": "user",
            "content": user_message
        })

        response = client.chat.completions.create(
            model="qwen3-4b",
            messages=self.messages,
            temperature=0.7
        )

        assistant_message = response.choices[0].message.content
        self.messages.append({
            "role": "assistant",
            "content": assistant_message
        })

        return assistant_message

    def clear_history(self):
        system_msg = self.messages[0] if self.messages and self.messages[0]["role"] == "system" else None
        self.messages = [system_msg] if system_msg else []

# Usage
bot = ChatBot(system_prompt="You are a helpful assistant specializing in Python programming.")

print(bot.chat("What is a decorator in Python?"))
print(bot.chat("Can you show me an example?"))
print(bot.chat("How is that different from a context manager?"))
```

## Streaming Chat Bot

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://api.solidrust.ai/v1"
)

class StreamingChatBot:
    def __init__(self, system_prompt=None):
        self.messages = []
        if system_prompt:
            self.messages.append({"role": "system", "content": system_prompt})

    def chat(self, user_message):
        self.messages.append({"role": "user", "content": user_message})

        stream = client.chat.completions.create(
            model="qwen3-4b",
            messages=self.messages,
            stream=True
        )

        full_response = ""
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                print(content, end="", flush=True)
                full_response += content

        print()  # Newline

        self.messages.append({"role": "assistant", "content": full_response})
        return full_response

# Interactive loop
bot = StreamingChatBot("You are a helpful coding assistant.")

while True:
    user_input = input("\nYou: ")
    if user_input.lower() in ["quit", "exit"]:
        break
    print("\nAssistant: ", end="")
    bot.chat(user_input)
```

## JavaScript Chat Bot

```javascript
import OpenAI from 'openai';
import * as readline from 'readline';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.solidrust.ai/v1',
});

class ChatBot {
  constructor(systemPrompt) {
    this.messages = [];
    if (systemPrompt) {
      this.messages.push({ role: 'system', content: systemPrompt });
    }
  }

  async chat(userMessage) {
    this.messages.push({ role: 'user', content: userMessage });

    const response = await client.chat.completions.create({
      model: 'qwen3-4b',
      messages: this.messages,
    });

    const assistantMessage = response.choices[0].message.content;
    this.messages.push({ role: 'assistant', content: assistantMessage });

    return assistantMessage;
  }
}

// Interactive CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const bot = new ChatBot('You are a helpful assistant.');

function prompt() {
  rl.question('You: ', async (input) => {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    const response = await bot.chat(input);
    console.log(`\nAssistant: ${response}\n`);
    prompt();
  });
}

prompt();
```

## Tips

- Keep conversation history trimmed to stay within context limits
- Use system prompts to define bot personality and capabilities
- Consider adding memory/summarization for long conversations

## Related

- [Chat Completions API](/api/chat-completions/)
- [Streaming Guide](/guides/streaming/)
