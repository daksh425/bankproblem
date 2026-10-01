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
  build: { format: 'file' },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
