# Validate Documentation

Validate documentation structure, links, and OpenAPI spec.

## Instructions

1. Build the site to check for compilation errors
2. Validate OpenAPI spec syntax
3. Check for common documentation issues
4. Report any problems found

## Validation Steps

### 1. Build Check
```bash
npm run build 2>&1
```

### 2. OpenAPI Validation
Check that `public/openapi.yaml` is valid:
- Valid YAML syntax
- Required OpenAPI fields present (openapi, info, paths)
- Endpoint definitions match actual API

### 3. Documentation Structure
Verify:
- All sidebar items in `astro.config.mjs` have corresponding files
- Frontmatter has required `title` field
- No broken internal links (relative paths)

### 4. Code Examples
Check that code examples:
- Use `YOUR_API_KEY` placeholder (never real keys)
- Use correct API base URL: `https://api.solidrust.ai/v1`
- Include all required headers

## Report Format

```
Validation Results:
- Build: [PASS/FAIL]
- OpenAPI: [PASS/FAIL]
- Structure: [PASS/FAIL]
- Examples: [PASS/FAIL]

Issues Found:
- [List any issues]
```
