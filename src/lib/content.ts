/**
 * Collection helpers shared by the EN and TR page trees.
 *
 * TR entries live next to their EN counterpart with a `-tr` filename suffix
 * (`welcome.md` + `welcome-tr.md`; Astro strips dots from ids, so the suffix
 * uses a dash). Both languages share one URL slug: the suffix is dropped.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '@lib/i18n';

export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'blog'>;

/** Collection id → URL slug (`welcome-tr` → `welcome`). */
export const slugOf = (id: string) => id.replace(/-tr$/, '');

/** Projects of one locale, in their `order` (unordered ones last). */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const projects = await getCollection('projects', ({ data }) => data.lang === lang);
  return projects.sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));
}

/** Published (non-draft) posts of one locale, newest first. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft && data.lang === lang);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

