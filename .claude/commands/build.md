# Build Documentation Site

Build the static documentation site for production deployment.

## Instructions

1. Run the production build
2. Check for any build errors or warnings
3. Report build output size and any issues

## Commands

```bash
# Clean previous build
rm -rf dist/

# Production build
npm run build
```

## Expected Output

- Static files generated in `dist/` directory
- All MDX files compiled to HTML
- Assets optimized and hashed
- Pagefind search index generated

## Troubleshooting

If build fails:
- Check MDX syntax errors in `src/content/docs/`
- Verify all imports resolve correctly
- Check for broken internal links
