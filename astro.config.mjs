// @ts-check
import { defineConfig } from 'astro/config';
import { execSync } from 'child_process';
import starlight from '@astrojs/starlight';
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi';

// Get git info for build version display
const getGitInfo = () => {
  try {
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const commitDate = execSync('git log -1 --format=%ci').toString().trim();
    return { commitHash, commitDate };
  } catch {
    return { commitHash: 'dev', commitDate: new Date().toISOString() };
  }
};
const gitInfo = getGitInfo();

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.solidrust.ai',
  output: 'static',

  integrations: [
    starlight({
      components: {
        Footer: './src/components/Footer.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        Head: './src/components/Head.astro',
      },
      plugins: [
        starlightOpenAPI([
          {
            base: 'api-reference',
            label: 'OpenAPI Reference',
            schema: './public/openapi.yaml',
            collapsed: false,
          },
        ]),
      ],
      title: 'SolidRusT AI',
      description: 'API documentation for SolidRusT AI inference platform',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/SolidRusT' },
      ],
      editLink: {
        baseUrl: 'https://github.com/SolidRusT/solidrust-ai-docs.github.io/edit/main/',
      },
      customCss: [
        './src/styles/custom.css',
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            { label: 'Quick Start', slug: 'getting-started/quickstart' },
            { label: 'API Keys', slug: 'getting-started/api-keys' },
            { label: 'Authentication', slug: 'getting-started/authentication' },
          ],
        },
        {
          label: 'API Reference',
          items: [
            { label: 'Overview', slug: 'api/overview' },
            { label: 'Chat Completions', slug: 'api/chat-completions' },
            { label: 'Embeddings', slug: 'api/embeddings' },
            { label: 'Models', slug: 'api/models' },
            { label: 'Error Handling', slug: 'api/errors' },
          ],
        },
        {
          label: 'SDKs',
          items: [
            { label: 'Overview', slug: 'sdks/overview' },
            { label: 'Python', slug: 'sdks/python' },
            { label: 'JavaScript/TypeScript', slug: 'sdks/javascript' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'RAG Applications', slug: 'guides/rag' },
            { label: 'Streaming Responses', slug: 'guides/streaming' },
            { label: 'Rate Limits', slug: 'guides/rate-limits' },
            { label: 'Documentation Style', slug: 'guides/documentation-style' },
          ],
        },
        {
          label: 'Examples',
          items: [
            { label: 'Chat Bot', slug: 'examples/chatbot' },
            { label: 'Agent Chat', slug: 'examples/agent-chat' },
            { label: 'Semantic Search', slug: 'examples/semantic-search' },
            { label: 'Document Q&A', slug: 'examples/document-qa' },
            { label: 'Code Generation', slug: 'examples/code-generation' },
          ],
        },
        { label: 'Changelog', slug: 'changelog' },
        ...openAPISidebarGroups,
      ],
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/favicon.svg',
          },
        },
      ],
    }),
  ],

  build: {
    assets: 'assets',
  },

  vite: {
    define: {
      __BUILD_COMMIT__: JSON.stringify(gitInfo.commitHash),
      __BUILD_DATE__: JSON.stringify(gitInfo.commitDate),
    },
    server: {
      allowedHosts: ['probook', 'localhost'],
    },
  },
});
