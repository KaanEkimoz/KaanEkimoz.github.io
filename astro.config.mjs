import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://kaanusta.dev',
  // English at /, Turkish at /tr/. We don't prefix the default locale
  // because the canonical brand URL is the unprefixed one; /tr/... is
  // the secondary tree mirrored page-for-page.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      // Tell crawlers which pages are translations of which, so EN and TR
      // versions don't get treated as duplicates.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', tr: 'tr-TR' },
      },
    }),
    mdx(),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    optimizeDeps: {
      include: ['motion'],
    },
  },
});
