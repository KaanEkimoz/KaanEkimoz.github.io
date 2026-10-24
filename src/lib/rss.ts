import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@lib/constants';
import { getPosts, slugOf } from '@lib/content';
import { localizedPath, t, type Lang } from '@lib/i18n';

/** RSS feed of one locale's blog (served at /rss.xml and /tr/rss.xml). */
export async function blogFeed(context: APIContext, lang: Lang) {
  const posts = await getPosts(lang);
  return rss({
    title: t('meta.siteTitle', lang),
    description: t('meta.blogDescription', lang),
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `${localizedPath(`/blog/${slugOf(post.id)}`, lang)}/`,
      categories: post.data.tags,
    })),
  });
}
