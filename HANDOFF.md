# HANDOFF.md — solidrust-ai-docs.github.io

**Updated:** 2026-09-04 (Hades — docs vs live production)

## Current state

- Live chat: `vllm-primary` → Gemma 4 12B IT QAT, 16384 context
- Live embeddings: `Qwen/Qwen3-Embedding-0.6B`, 1024-dim
- LiteLLM: confirmed absent (no k8s workload, no Artemis upstream)
- This session rewrote models/embeddings/overview/introduction, rate-limits,
  context-limits, errors, SDK examples, OpenAPI examples, changelog.

## Exact next work

1. `npm run build`
- Protected writes timed out: `AGENTS.md` and `CLAUDE.md` in this repo
  were not updated. Protocol lives in this HANDOFF until those files can
  be patched with the user present. `CLAUDE.md` still lists bge-m3.
3. Push when asked.

## Verification

```
rg -n 'bge-m3|qwen3-4b|LiteLLM' src/content public/openapi.yaml
npm run build
```
