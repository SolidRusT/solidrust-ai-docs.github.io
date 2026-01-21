---
title: Translation Guide
description: How to contribute translations to the SolidRusT AI documentation
---

# Translation Guide

Thank you for your interest in translating the SolidRusT AI documentation! This guide will help you contribute translations effectively.

## Supported Languages

We currently support or are seeking translations for:

| Language | Code | Status |
|----------|------|--------|
| English | `en` | Complete (default) |
| Spanish | `es` | Seeking contributors |
| Mandarin Chinese | `zh-cn` | Seeking contributors |
| Japanese | `ja` | Seeking contributors |
| Portuguese | `pt-br` | Seeking contributors |

## Getting Started

### Prerequisites

- Fluency in both English and your target language
- Familiarity with Markdown syntax
- Basic Git knowledge
- Understanding of technical/API documentation

### Translation Workflow

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/solidrust-ai-docs.github.io.git
   cd solidrust-ai-docs.github.io
   ```

2. **Create a language branch**
   ```bash
   git checkout -b translation/es  # For Spanish
   ```

3. **Create the language directory**
   ```
   src/content/docs/
   ├── en/           # English (default, already exists as root)
   ├── es/           # Spanish (create this)
   │   ├── getting-started/
   │   ├── api/
   │   ├── guides/
   │   └── ...
   ```

4. **Translate files**
   - Copy the English file to your language directory
   - Translate the content
   - Keep the same filename

5. **Submit a Pull Request**
   - Include which pages you translated
   - Note any terms you left untranslated (technical terms)

## Translation Guidelines

### What to Translate

- Page titles and descriptions
- Headings and body text
- Code comments (but NOT code itself)
- UI text and button labels in examples
- Image alt text

### What NOT to Translate

- Code snippets (keep in English)
- API endpoint paths (`/v1/chat/completions`)
- Parameter names (`model`, `messages`, `temperature`)
- Brand names (SolidRusT, Astro, etc.)
- File paths and technical identifiers
- URLs

### Technical Terms

Some terms should remain in English for consistency:

| Term | Reason |
|------|--------|
| API | Universal acronym |
| SDK | Universal acronym |
| Token | Industry standard term |
| Embedding | Technical AI term |
| RAG | Technical acronym |
| Endpoint | API terminology |

You may add a translation in parentheses on first use:
> "El API (interfaz de programación de aplicaciones) permite..."

### Frontmatter

Update the frontmatter for each translated page:

```yaml
---
title: Inicio Rápido  # Translated title
description: Comienza a usar SolidRusT AI en minutos  # Translated
---
```

### Code Blocks

Keep code in English, but translate comments:

```python
# Crear un cliente (Spanish comment)
client = OpenAI(
    base_url="https://api.solidrust.ai/v1",
    api_key="YOUR_API_KEY"
)

# Enviar una solicitud de chat (Spanish comment)
response = client.chat.completions.create(
    model="vllm-primary",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### Links

- Internal links should point to translated pages when available
- External links remain unchanged
- If a translated page doesn't exist, link to the English version

## File Naming

Keep the same filename structure:

```
English: src/content/docs/getting-started/quickstart.md
Spanish: src/content/docs/es/getting-started/quickstart.md
Chinese: src/content/docs/zh-cn/getting-started/quickstart.md
```

## Priority Pages

If you're starting a new language, prioritize these pages:

1. **Getting Started**
   - `getting-started/introduction.md`
   - `getting-started/quickstart.md`
   - `getting-started/api-keys.md`

2. **API Reference**
   - `api/overview.md`
   - `api/chat-completions.md`
   - `api/errors.md`

3. **SDKs**
   - `sdks/overview.md`
   - `sdks/python.md`

## Quality Standards

### Accuracy

- Ensure technical accuracy matches the English source
- When in doubt, keep technical terms in English
- Test code examples still work

### Consistency

- Use consistent terminology throughout
- Reference the glossary for standard translations
- Maintain the same tone (professional but approachable)

### Formatting

- Preserve all Markdown formatting
- Keep the same heading structure
- Maintain callout types (note, tip, caution, danger)

## Glossary

Common terms and their recommended translations:

### Spanish (es)

| English | Spanish |
|---------|---------|
| Chat completion | Completado de chat |
| Request | Solicitud |
| Response | Respuesta |
| Authentication | Autenticación |
| Rate limit | Límite de velocidad |
| Streaming | Transmisión en tiempo real |

### Mandarin Chinese (zh-cn)

| English | Chinese |
|---------|---------|
| Chat completion | 聊天补全 |
| Request | 请求 |
| Response | 响应 |
| Authentication | 身份验证 |
| Rate limit | 速率限制 |
| Streaming | 流式传输 |

## Testing Your Translation

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Navigate to your translated pages at `http://localhost:4321/es/` (or your language code)

3. Verify:
   - All links work
   - Code blocks render correctly
   - Images display properly
   - No untranslated text remains

## Submitting Your Translation

### Pull Request Template

```markdown
## Translation: [Language Name]

### Pages Translated
- [ ] getting-started/introduction.md
- [ ] getting-started/quickstart.md
- [ ] api/overview.md

### Checklist
- [ ] Followed translation guidelines
- [ ] Kept code examples in English
- [ ] Tested locally
- [ ] Consistent terminology used

### Notes
Any terms left untranslated or questions about specific translations.
```

### Review Process

1. A maintainer will review your translation
2. Native speakers may be consulted for quality
3. Technical accuracy will be verified
4. Feedback will be provided if changes are needed

## Maintaining Translations

### When English Content Updates

- Watch for changes to English pages you've translated
- Update translations to match within 2 weeks if possible
- Mark outdated translations with a banner if significant delay

### Reporting Issues

If you find translation errors:
1. Open an issue with the `translation` label
2. Specify the language and page
3. Describe the error and suggest a correction

## Recognition

Contributors are recognized in:
- The [Contributors](https://github.com/SolidRusT/solidrust-ai-docs.github.io/graphs/contributors) page
- Release notes when new languages are added
- Special thanks in the documentation footer

## Questions?

- **Translation questions**: Open a [Discussion](https://github.com/SolidRusT/solidrust-ai-docs.github.io/discussions)
- **Technical issues**: Open an [Issue](https://github.com/SolidRusT/solidrust-ai-docs.github.io/issues)
- **Contact**: [support@solidrust.net](mailto:support@solidrust.net)

---

Thank you for helping make SolidRusT AI accessible to developers worldwide!
