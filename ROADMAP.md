# docs.solidrust.ai — Roadmap

> Last updated: 2026-09-04
> Tracks known gaps between the live API and published documentation.

## Architecture

```
vLLM chat + vLLM embeddings + srt-data-layer
        └── srt-artemis (api.solidrust.ai)
                └── docs.solidrust.ai (this repo)
```

LiteLLM is not in this path. It was expelled; do not put it back in diagrams.

The docs site documents the **public surface** of `api.solidrust.ai`.
Internal-only endpoints (admin, connectors, tasks, hygiene, etc.) are
intentionally not documented.

## Current State

| Component | Status | Notes |
|-----------|--------|-------|
| Chat model copy | ✅ 2026-09-04 | `vllm-primary` / Gemma 4 12B QAT / 16k |
| Embeddings copy | ✅ 2026-09-04 | `Qwen/Qwen3-Embedding-0.6B` / 1024-dim |
| Rate limits | ✅ 2026-09-04 | Free/Pro/Enterprise from PAM `tier-limits.ts` |
| Failover copy | ✅ 2026-09-04 | No LiteLLM; agent-only OpenRouter |
| Internal admin paths | Intentionally undocumented | 97 live paths vs curated public spec |

## Known Gaps (Internal — intentionally undocumented)

| Endpoint Group | Purpose | Public Doc Priority |
|----------------|---------|-------------------|
| `/data/v1/connectors/*` | Data connector management | Low |
| `/data/v1/tasks/*` | Celery task queue management | Low |
| `/data/v1/analytics/*` | Query analytics dashboard | Low |
| `/data/v1/memory/*` | Memory agent | Medium |
| `/data/admin/*` | Dead-letter queue | None |

## Future Work

- [ ] First-party Python SDK — [#1](https://poseidon.hq.solidrust.net:30008/shaun/solidrust-ai-docs.github.io/issues/1)
- [ ] First-party JS SDK — [#2](https://poseidon.hq.solidrust.net:30008/shaun/solidrust-ai-docs.github.io/issues/2)
- [ ] Video tutorials — [#3](https://poseidon.hq.solidrust.net:30008/shaun/solidrust-ai-docs.github.io/issues/3) (no footage; page is a stub)
- [ ] Customer ingest tenancy — [#4](https://poseidon.hq.solidrust.net:30008/shaun/solidrust-ai-docs.github.io/issues/4) (owner: srt-data-layer)
- [ ] Clarity / SearXNG / Firecrawl public API — [#5](https://poseidon.hq.solidrust.net:30008/shaun/solidrust-ai-docs.github.io/issues/5)
- [ ] `sources.md` / `stats.md` reference pages
- [ ] Document memory endpoints if they become public
- [ ] CI: fail if docs still mention `bge-m3`, `qwen3-4b`, or LiteLLM as live
