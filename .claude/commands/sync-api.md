# Sync API Documentation

Verify documented API behavior matches actual API responses.

## Instructions

1. Check API health endpoints
2. Compare documented endpoints with actual API
3. Verify model names and capabilities match
4. Report any discrepancies

## Health Checks

```bash
# Check Artemis gateway health
curl -s https://artemis.hq.solidrust.net/health

# Check models endpoint (if accessible)
curl -s https://api.solidrust.ai/v1/models -H "Authorization: Bearer YOUR_API_KEY"
```

## Verification Checklist

### Endpoints
- [ ] `/v1/chat/completions` - documented correctly
- [ ] `/v1/embeddings` - documented correctly
- [ ] `/v1/models` - model list matches documentation

### Model Names
Compare `src/content/docs/api/models.mdx` with actual `/v1/models` response:
- Model IDs match
- Context lengths accurate
- Capabilities documented correctly

### Authentication
Verify `src/content/docs/getting-started/authentication.mdx`:
- API key format correct
- Header format: `Authorization: Bearer <key>`
- Console URL: https://console.solidrust.ai

### Rate Limits
Check if `src/content/docs/guides/rate-limits.mdx` matches current limits.

## Report Format

```
API Sync Status:
- Endpoints: [IN SYNC / DRIFT DETECTED]
- Models: [IN SYNC / DRIFT DETECTED]
- Auth: [IN SYNC / DRIFT DETECTED]

Discrepancies:
- [List any differences between docs and actual API]

Recommended Updates:
- [List documentation changes needed]
```
