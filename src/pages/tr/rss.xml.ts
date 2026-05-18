import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '@lib/constants';
import type { APIContext } from 'astro';
import { t } from '@lib/i18n';

export async function GET(context: APIContext) {
  const posts = await getCollection(
    'blog',
    ({ data }) => !data.draft && data.lang === 'tr'
  );
  return rss({
    title: t('meta.siteTitle', 'tr'),
    description: t('meta.blogDescription', 'tr'),
    site: context.site ?? SITE.url,
    items: posts
      .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/tr/blog/${post.id.replace(/-tr$/, '')}/`,
        categories: post.data.tags,
      })),
  });
}
