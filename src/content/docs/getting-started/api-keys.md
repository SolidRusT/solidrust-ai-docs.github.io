---
title: API Keys
description: How to generate and manage API keys for the SolidRusT AI API
---

API keys authenticate your requests to the SolidRusT AI API. This guide covers generating, using, and managing your API keys via the [PAM Console](https://console.solidrust.ai).

## Getting Started

### 1. Create an Account

1. Navigate to [console.solidrust.ai](https://console.solidrust.ai)
2. Click **Sign Up** or **Get Started**
3. Enter your email address and create a password
4. Verify your email address via the confirmation link
5. Log in to your new account

### 2. Generate Your First API Key

1. After logging in, go to **Dashboard** > **API Keys**
2. Click **Create New Key**
3. Enter a descriptive name for your key (e.g., "Development", "Production App")
4. Select permissions (default: all endpoints)
5. Click **Generate Key**

:::caution[Important]
Your API key will only be shown once. Copy it immediately and store it securely. You cannot retrieve the full key later.
:::

### 3. Copy Your Key

After generation, you'll see your key in this format:

```
sk-srt-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Copy the entire key including the `sk-srt-` prefix.

## Using Your API Key

### HTTP Header (Recommended)

Include your API key in the `Authorization` header:

```bash
curl https://api.solidrust.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-srt-your-api-key-here" \
  -d '{
    "model": "vllm-primary",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### Environment Variables

Store your API key in environment variables - never hardcode it:

```bash
# Linux/macOS
export SOLIDRUST_API_KEY="sk-srt-your-api-key-here"

# Windows (PowerShell)
$env:SOLIDRUST_API_KEY = "sk-srt-your-api-key-here"

# Windows (Command Prompt)
set SOLIDRUST_API_KEY=sk-srt-your-api-key-here
```

### SDK Configuration

**Python:**
```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("SOLIDRUST_API_KEY"),
    base_url="https://api.solidrust.ai/v1"
)
```

**JavaScript/TypeScript:**
```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SOLIDRUST_API_KEY,
  baseURL: 'https://api.solidrust.ai/v1',
});
```

## Managing API Keys

### View Existing Keys

1. Go to [console.solidrust.ai](https://console.solidrust.ai)
2. Navigate to **Dashboard** > **API Keys**
3. View all your keys with:
   - Name
   - Created date
   - Last used date
   - Status (active/revoked)

:::note
For security, only the last 4 characters of each key are displayed.
:::

### Rotate a Key

To create a new key while deprecating an old one:

1. Create a new API key with a temporary name
2. Update your application to use the new key
3. Test that the new key works correctly
4. Revoke the old key

### Revoke a Key

If a key is compromised or no longer needed:

1. Go to **Dashboard** > **API Keys**
2. Find the key you want to revoke
3. Click the **Revoke** button
4. Confirm the revocation

:::danger[Warning]
Revoking a key is immediate and irreversible. Any applications using that key will immediately receive 401 Unauthorized errors.
:::

## Security Best Practices

### Never Commit Keys to Git

Add API keys to your `.gitignore`:

```gitignore
# Environment files
.env
.env.local
.env.*.local

# API keys
**/secrets.json
**/credentials.json
```

Use environment variables or secret management tools instead.

### Use Different Keys per Environment

| Environment | Key Name | Purpose |
|-------------|----------|---------|
| Development | `dev-local` | Local testing |
| Staging | `staging-app` | Pre-production testing |
| Production | `prod-app-v1` | Live application |

This allows you to:
- Track usage by environment
- Revoke keys without affecting other environments
- Apply different rate limits per environment

### Implement Key Rotation

Rotate your API keys regularly:

1. **Schedule rotation** - Monthly for production keys
2. **Automate if possible** - Use CI/CD to update keys
3. **Monitor usage** - Watch for anomalies after rotation

### Minimum Privilege

Request only the permissions your application needs:

| Permission | Use Case |
|------------|----------|
| `chat:read` | Chat completions (most common) |
| `embeddings:read` | Embedding generation |
| `models:list` | List available models |

## Troubleshooting

### 401 Unauthorized

```json
{
  "error": {
    "message": "Invalid API key provided",
    "type": "authentication_error",
    "code": "invalid_api_key"
  }
}
```

**Solutions:**
1. Verify the key is correct (no extra spaces or characters)
2. Check the key hasn't been revoked
3. Ensure the `Authorization: Bearer` header format is correct
4. Verify you're using `sk-srt-` prefix keys for SolidRusT API

### 403 Forbidden

```json
{
  "error": {
    "message": "API key doesn't have permission for this endpoint",
    "type": "permission_error",
    "code": "insufficient_permissions"
  }
}
```

**Solutions:**
1. Check the key's permissions in the console
2. Generate a new key with required permissions

### Key Not Working After Generation

1. Wait 30 seconds for propagation
2. Clear any cached credentials
3. Verify the endpoint URL is correct (`https://api.solidrust.ai/v1`)
4. Test with a simple curl command first

## API Key Formats

| Prefix | Source | Valid For |
|--------|--------|-----------|
| `sk-srt-` | PAM Console | SolidRusT AI API |
| `sk-` | OpenAI | Not compatible |
| `key-` | Other providers | Not compatible |

Only keys with the `sk-srt-` prefix work with the SolidRusT AI API.

## Related

- [Quick Start](/getting-started/quickstart/) - Make your first API call
- [Authentication](/getting-started/authentication/) - Authentication overview
- [Rate Limits](/guides/rate-limits/) - Understanding rate limits
- [Error Handling](/api/errors/) - Handling API errors
