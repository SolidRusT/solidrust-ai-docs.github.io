# Contributing to SolidRusT AI Documentation

Thank you for your interest in contributing to the SolidRusT AI documentation! This guide will help you get started.

## Ways to Contribute

### Quick Fixes

For typos, broken links, or minor corrections:

1. Click the "Edit this page" link on any documentation page
2. Make your changes directly in GitHub
3. Submit a pull request with a brief description

### New Content

For new documentation pages, guides, or examples:

1. Fork the repository
2. Create a feature branch
3. Write your content following our [Style Guide](/guides/documentation-style)
4. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 20 or later
- npm or pnpm
- Git

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/solidrust-ai-docs.github.io.git
cd solidrust-ai-docs.github.io

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:4321 in your browser
```

### Building for Production

```bash
# Build the site
npm run build

# Preview the build
npm run preview
```

## Content Structure

### File Organization

```
src/content/docs/
├── getting-started/     # Onboarding and setup
│   ├── introduction.mdx
│   ├── quickstart.mdx
│   └── api-keys.mdx
├── api/                 # API reference
│   ├── overview.mdx
│   ├── chat-completions.mdx
│   └── embeddings.mdx
├── sdks/                # SDK documentation
├── guides/              # How-to guides
├── examples/            # Code examples
└── changelog.mdx        # Release notes
```

### Frontmatter Template

Every documentation page needs frontmatter:

```mdx
---
title: Page Title
description: Brief description for SEO and link previews (max 160 chars)
---

Your content here...
```

### Adding to Sidebar

New pages must be added to `astro.config.mjs` sidebar configuration:

```javascript
sidebar: [
  {
    label: 'Category',
    items: [
      { label: 'Page Title', slug: 'category/page-slug' },
    ],
  },
],
```

## Writing Guidelines

### Voice and Tone

- Use second person ("you") for instructions
- Be concise - developers want quick answers
- Avoid jargon unless necessary (define it if used)
- Write in active voice

### Code Examples

Always include working examples:

```python
# Good - complete and runnable
from openai import OpenAI

client = OpenAI(
    base_url="https://api.solidrust.ai/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="vllm-primary",
    messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)
```

```python
# Bad - incomplete
client.chat.completions.create(model="...", messages=[...])
```

### Starlight Components

Use built-in components for consistent styling:

```mdx
import { Card, CardGrid, Tabs, TabItem } from '@astrojs/starlight/components';

<CardGrid>
  <Card title="Feature 1" icon="rocket">
    Description here
  </Card>
  <Card title="Feature 2" icon="seti:config">
    Description here
  </Card>
</CardGrid>

<Tabs>
  <TabItem label="Python">
    ```python
    # Python code
    ```
  </TabItem>
  <TabItem label="JavaScript">
    ```javascript
    // JavaScript code
    ```
  </TabItem>
</Tabs>
```

### Callouts

Use callouts for important information:

```mdx
:::note
Neutral information the reader should know.
:::

:::tip
Helpful suggestions or best practices.
:::

:::caution
Potential issues or things to watch out for.
:::

:::danger
Critical warnings about breaking changes or security.
:::
```

## Pull Request Process

### Before Submitting

1. **Run the build locally** to catch errors:
   ```bash
   npm run build
   ```

2. **Check links** work correctly

3. **Verify code examples** are runnable

4. **Follow the style guide**

### PR Requirements

- Clear title describing the change
- Description of what and why
- Link to related issue (if applicable)
- Screenshots for visual changes

### Review Process

1. Automated checks run on your PR
2. A maintainer reviews the content
3. Address any feedback
4. Once approved, your PR will be merged

## Getting Help

- **Questions**: Open a [GitHub Discussion](https://github.com/SolidRusT/solidrust-ai-docs.github.io/discussions)
- **Bugs**: Open a [GitHub Issue](https://github.com/SolidRusT/solidrust-ai-docs.github.io/issues)
- **Contact**: [support@solidrust.net](mailto:support@solidrust.net)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for helping make SolidRusT AI documentation better!
