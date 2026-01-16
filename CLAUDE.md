# solidrust-ai-docs.github.io - API Documentation Site

**Role**: Public documentation for the SolidRusT AI inference platform.
**URL**: https://docs.solidrust.ai
**Stack**: Astro 5 + Starlight + Tailwind CSS

---

## Quick Reference

| Item | Value |
|------|-------|
| **Site URL** | https://docs.solidrust.ai |
| **GitHub Pages** | Deployed via GitHub Actions |
| **Related Sites** | solidrust.ai (marketing), console.solidrust.ai (dashboard) |
| **API Base URL** | https://artemis.hq.solidrust.net/v1 |

---

## Development

### Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
  content/
    docs/           # Documentation pages (MDX/MD)
      getting-started/
      api/
      sdks/
      guides/
      examples/
  assets/           # Images, logos
  styles/           # Custom CSS (Tailwind)
public/
  CNAME            # Custom domain
  openapi.yaml     # OpenAPI spec for API reference
  favicon.ico
astro.config.mjs   # Astro + Starlight configuration
tailwind.config.mjs # Tailwind theme customization
```

### Adding Documentation

1. Create a new `.md` or `.mdx` file in `src/content/docs/`
2. Add frontmatter with title and description
3. Add to sidebar in `astro.config.mjs`

**Example:**
```md
---
title: My New Page
description: Description for SEO and link previews
---

# Content here
```

### Starlight Features

- **Code blocks**: Syntax highlighting, copy button
- **Callouts**: `:::note`, `:::tip`, `:::caution`, `:::danger`
- **Components**: `<Card>`, `<CardGrid>`, `<Tabs>`, `<TabItem>`
- **Table of contents**: Auto-generated from headings
- **Search**: Built-in Pagefind search

---

## API Documentation Source

The OpenAPI spec at `/public/openapi.yaml` is the source of truth for API documentation.

### OpenAPI Integration (Enabled)

The `starlight-openapi` plugin is configured in `astro.config.mjs` and generates interactive API documentation at `/api-reference/`.

**Endpoints documented**:
- `/v1/chat/completions` - Chat completion (OpenAI-compatible)
- `/v1/embeddings` - Vector embeddings (bge-m3)
- `/v1/models` - List available models
- `/data/v1/query/semantic` - Semantic search (RAG)
- `/data/v1/query/keyword` - Keyword search (RAG)
- `/data/v1/query/hybrid` - Hybrid search (RAG)
- `/data/v1/query/knowledge-graph` - Knowledge graph query (RAG)
- `/v1/agent/chat` - Tool-enabled agent chat
- `/v1/agent/tools` - List agent tools

**Base URL**: `https://api.solidrust.ai`

---

## Deployment

### Automatic (GitHub Actions)

Push to `main` branch triggers:
1. `npm ci` - Install dependencies
2. `npm run build` - Build static site
3. Deploy to GitHub Pages

### Custom Domain

CNAME file points to `docs.solidrust.ai`. DNS must have:
- CNAME record: `docs.solidrust.ai` -> `solidrust.github.io`

---

## Content Guidelines

### Writing Style

- Use second person ("you") for instructions
- Be concise - developers want quick answers
- Include working code examples
- Show expected output when relevant

### Code Examples

Always include examples for:
- curl (universal)
- Python (primary SDK)
- JavaScript/TypeScript (secondary SDK)

### API Documentation

Each endpoint page should include:
- HTTP method and path
- Request parameters (table)
- Example request
- Example response
- Error codes specific to that endpoint

---

## Related Repositories

| Repo | Purpose | Relationship |
|------|---------|--------------|
| `solidrust-ai.github.io` | Marketing landing page | Links to docs |
| `srt-pam-platform` | Console + API keys | Manages auth |
| `srt-artemis` | API gateway | Serves the API being documented |
| `srt-data-layer` | RAG service | `/data/*` endpoints |
| `srt-hq-vllm` | Chat inference | `/v1/chat/completions` |
| `srt-hq-vllm-embeddings` | Embeddings | `/v1/embeddings` |

---

## Backlog

### High Priority (Completed)
- [x] Enable interactive OpenAPI/Swagger UI (starlight-openapi)
- [x] Add search functionality verification (Pagefind working)
- [x] Create proper favicon (SVG favicon created)

### Medium Priority
- [ ] Add versioning support for API changes
- [ ] Create changelog page
- [ ] Add analytics (privacy-respecting)

### Low Priority
- [ ] Multi-language documentation (i18n)
- [ ] Video tutorials embedded in guides
- [ ] Community contributions guide

---

## Claude Code Configuration

### Commands (`.claude/commands/`)

| Command | Description |
|---------|-------------|
| `/preview` | Start Astro dev server on localhost:4321 |
| `/build` | Production build to `dist/` directory |
| `/validate` | Validate docs structure, links, and OpenAPI spec |
| `/sync-api` | Verify docs match actual API behavior |

### MCP Tools (`.mcp.json`)

| Tool | Use For |
|------|---------|
| `time` | Date calculations for versioning |
| `calculator` | Token/pricing calculations |
| `github` | PR management, issue tracking |

### Permissions

Standard documentation site permissions:
- File read/write in `src/`, `public/`
- npm commands (`npm install`, `npm run dev`, `npm run build`)
- Git operations

---

## Behavioral Rules

**DO**:
- Keep documentation accurate with actual API behavior
- Update examples when API changes
- Maintain OpenAPI spec as source of truth
- Use Starlight components for consistent styling

**DON'T**:
- Document features that don't exist yet
- Include internal/private API details
- Hardcode API keys in examples (use `YOUR_API_KEY` placeholder)

---

**Version**: 1.2 | **Updated**: January 16, 2026
