import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { SITE } from './src/config.ts';

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      // Keep noindex pages out of the sitemap. Submitting a URL that carries
      // noindex is reported as an error in Search Console.
      filter: (page) =>
        !page.includes('/draft') &&
        !/\/blog\/\d+\/?$/.test(page) &&   // /blog/2, /blog/3 …
        !/\/page\/\d+\/?$/.test(page),     // /cards/page/2 …
    }),
  ],
  // 'directory' emits /blog/index.html rather than /blog.html, which works
  // unchanged on Apache, Nginx, Cloudflare Pages, Netlify and Vercel. 'file'
  // relies on the host rewriting extensionless URLs and 404s on plain Apache.
  build: { format: 'directory' },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
