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
      // /chat is a private page — keep it out of the sitemap.
      filter: (page) => !page.includes('/chat'),
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
    plugins: [pptxPreviewFixes()],
  },
});

// pptx-preview (the /chat slide viewer) breaks on charts without their own
// colours, which python-pptx writes by default, and titles untitled charts
// in Chinese. Untitled charts stay untitled and uncoloured series get the
// Office theme accents, as PowerPoint shows them.
function pptxPreviewFixes() {
  const accents = JSON.stringify(['#4472C4', '#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47']);
  return {
    name: 'pptx-preview-fixes',
    transform(code, id) {
      if (!id.includes('pptx-preview')) return null;
      return code
        .replace('||"图表标题"', '||""')
        .replace('function g(t,e,a){', 'function g(t,e,a){if(!t)return;')
        .replace(
          /this\.options\.color=(this\.parse\w+Colors\(\w\))/g,
          `this.options.color=$1.map(function(c,i){return c||${accents}[i%6]})`,
        );
    },
  };
}
