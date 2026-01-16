# SolidRusT AI Documentation

API documentation for the SolidRusT AI inference platform.

**Live site**: [docs.solidrust.ai](https://docs.solidrust.ai)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Stack

- [Astro](https://astro.build/) 5 - Static site generator
- [Starlight](https://starlight.astro.build/) - Documentation theme
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- GitHub Pages - Hosting

## Structure

```
src/content/docs/
  getting-started/   # Introduction, quick start, auth
  api/               # API reference (endpoints)
  sdks/              # Python, JavaScript SDKs
  guides/            # RAG, streaming, rate limits
  examples/          # Chat bot, document Q&A, code gen
```

## Related

- [solidrust.ai](https://solidrust.ai) - Marketing site
- [console.solidrust.ai](https://console.solidrust.ai) - Developer console
- [API Base URL](https://artemis.hq.solidrust.net/v1) - Production API

## License

MIT
