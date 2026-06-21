# solidrust-ai-docs.github.io - API Documentation Site

**Role**: Public documentation for the SolidRusT AI inference platform.
**URL**: <https://docs.solidrust.ai>
**Stack**: Astro 5 + Starlight + Tailwind CSS

---

## Quick Reference

| Item | Value |
|------|-------|
| **Site URL** | <https://docs.solidrust.ai> |
| **GitHub Pages** | Deployed via GitHub Actions |
| **Related Sites** | solidrust.ai (marketing), console.solidrust.ai (dashboard) |
| **API Base URL** | <https://api.solidrust.ai/v1> |

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
- `/v1/embeddings` - Vector embeddings (bge-m3, 1024-dim)
- `/v1/models` - List available models
- `/v1/agent/chat` - Tool-enabled agent chat
- `/v1/agent/tools` - List agent tools (6 tools: semantic, graph, hybrid, memory search/store/stats)
- `/data/v1/query/semantic` - Semantic vector search (RAG)
- `/data/v1/query/keyword` - Full-text keyword search (MeiliSearch)
- `/data/v1/query/hybrid` - Combined semantic + graph with entity extraction
- `/data/v1/query/knowledge-graph` - Entity relationship queries (legacy)
- `/data/v1/query/graph` - Graph traversal from entity
- `/data/v1/query/graph/search` - Entity name search
- `/data/v1/query/graph/entity/{name}` - Get entity by name
- `/data/v1/query/graph/documents` - Graph traversal + Milvus document resolution
- `/data/v1/ingest/document` - Single document ingestion (idempotent)
- `/data/v1/ingest/batch` - Batch document ingestion (idempotent)
- `/data/v1/sources` - List available data sources
- `/data/v1/stats` - Knowledge base statistics

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

## When API Changes (Docs Sync Process)

When changes are made to the data-layer API (`srt-data-layer`) or the proxy configuration (`srt-artemis`), follow this checklist to keep docs in sync:

### 1. Identify Impact

- **New endpoint added?** → Update `public/openapi.yaml`, add new API reference page, update sidebar
- **Schema changed?** → Update OpenAPI schemas and all code examples in relevant pages
- **Tool added/changed?** → Update Agent Tools page and OpenAPI agent schemas
- **Config change in nginx?** → Check if new routes are exposed, update docs accordingly

### 2. Files to Update

| What Changed | Files to Update |
|-------------|-----------------|
| New public endpoint | `public/openapi.yaml`, `src/content/docs/api/<page>.md`, `astro.config.mjs` sidebar |
| Schema change | `public/openapi.yaml` components/schemas, affected API reference pages |
| New/removed agent tool | `src/content/docs/api/agent-tools.md`, `src/content/docs/api/agent-chat.md`, `public/openapi.yaml` |
| Nginx route change | `public/openapi.yaml` paths, `src/content/docs/api/overview.md` endpoint table |
| Deprecation | `src/content/docs/changelog.mdx`, affected pages |

### 3. Audit Sources

| Source of Truth | File |
|----------------|------|
| Data-layer API routes | `~/repos/srt-data-layer/src/api/routes/*.py` + `src/api/main.py` |
| Proxy config (public surface) | `~/repos/srt-artemis/nginx.conf` |
| OpenAPI spec | `public/openapi.yaml` |
| API reference pages | `src/content/docs/api/*.md` |
| Guides with code examples | `src/content/docs/guides/rag.md`, `src/content/docs/guides/agent-endpoints.md` |
| Overview + sidebar | `src/content/docs/api/overview.md`, `astro.config.mjs` |

### 4. Validate

```bash
npm run build  # Must pass — redeploy fails otherwise
```

### 5. Update Changelog

Add an entry to `src/content/docs/changelog.mdx` under `[Unreleased]` with the change description.

### 6. Update Roadmap

If the gap is known but deferred, add it to `ROADMAP.md` with an estimated priority.

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

## Issue Tracking

**Platform**: GitHub
**Issues**: <https://github.com/SolidRusT/solidrust-ai-docs.github.io/issues>

Backlog, bugs, and enhancements are tracked as git issues.

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

**Version**: 2.0 | **Updated**: June 20, 2026
