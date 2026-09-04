# BACKLOG.md — solidrust-ai-docs.github.io

## P1

- **D1 — CLAUDE.md still lists bge-m3** if the protected-file write was
  denied. Patch when the user is present.

## P2

- **D2 — OpenAPI vs live data-layer.** Docs `public/openapi.yaml` is a
  curated 22-endpoint public spec. Live data-layer OpenAPI has 97 paths
  (admin/connectors/memory). Keep internal paths undocumented on purpose
  (ROADMAP).
- **D3 — Automated drift.** Compare docs OpenAPI + model pages against
  live `/v1/models` and `/data/openapi.json` in CI.

## WATCH

- Historical changelog entries (2025-12-01 LiteLLM, bge-m3) are history.
  Do not "fix" them to the present.
