# docs.solidrust.ai — Roadmap

> Last updated: 2026-06-20
> Tracks known gaps between the live API and published documentation.

## Architecture

```
srt-data-layer API ──→ srt-artemis proxy ──→ api.solidrust.ai
                                                  │
                                                  └── docs.solidrust.ai (this repo)
```

The docs site documents the **public surface** of `api.solidrust.ai`. Internal-only endpoints (admin, connectors, tasks, hygiene, etc.) are intentionally not documented — they exist under `/data/...` for operational use with API key auth.

## Current State

| Component | Status | Notes |
|-----------|--------|-------|
| OpenAPI spec | ✅ Fresh | v2.0 — 22 endpoints documented (2026-06-20 alignment) |
| API Reference pages | ✅ Complete | 14 pages covering inference, agent, search, graph, ingestion |
| Agent docs | ✅ Updated | 6 tools documented (semantic, graph, hybrid, memory×3) |
| Graph endpoints | ✅ Documented | 4 new graph traversal + document resolution endpoints |
| Hybrid schema | ✅ Accurate | Includes `game`, `use_graph`, `graph_depth`, `use_entity_extraction` |
| Roadmap + changelog | ✅ Established | This file + CHANGELOG.md |
| Docs sync process | ✅ Documented | CLAUDE.md "When API Changes" section |

## Known Gaps (Internal — intentionally undocumented)

These endpoints exist at the data-layer and are proxied through `/data/...` but are operational/admin in nature and not part of the public API contract:

| Endpoint Group | Purpose | Public Doc Priority |
|----------------|---------|-------------------|
| `/data/v1/connectors/*` | Data connector management | Low |
| `/data/v1/tasks/*` | Celery task queue management | Low |
| `/data/v1/analytics/*` | Query analytics dashboard | Low |
| `/data/v1/backfill/*` | Data backfill operations | Low |
| `/data/v1/cache/*` | Cache management | Low |
| `/data/v1/hygiene/*` | Data hygiene (dedup, cleanup) | Low |
| `/data/v1/memory/*` | Memory agent (recall, store) | Medium |
| `/data/v1/companion/*` | Companion memory | Medium |
| `/data/v1/usage/*` | Usage statistics | Low |
| `/data/admin/*` | Dead-letter queue | None |

## Future Work

### Short-Term

- [ ] Verify `starlight-openapi` renders new graph endpoints correctly after deploy
- [ ] Add `src/content/docs/api/sources.md` and `src/content/docs/api/stats.md` reference pages

### Medium-Term

- [ ] Document memory endpoints (`/data/v1/memory/*`) if they become part of public API
- [ ] Add OpenAPI spec for AmiNex EVE endpoints if they become documented
- [ ] Create dedicated "Data Layer API" section in sidebar for RAG/ingestion endpoints

### Long-Term

- [ ] Automated API-to-docs drift detection (compare OpenAPI spec vs live `/data/openapi.json`)
- [ ] Runtime schema validation in CI against data-layer's actual openapi.json output
- [ ] Multi-language SDK code samples auto-generated from OpenAPI spec

## Docs Sync Checklist (for future API changes)

When the data-layer API changes, follow the checklist in [CLAUDE.md](CLAUDE.md#when-api-changes-docs-sync-process):

1. Identify impact (new endpoint? schema change? tool change?)
2. Update files per the impact matrix
3. `npm run build` to verify
4. Update changelog.mdx
5. Update this roadmap if gaps remain deferred
