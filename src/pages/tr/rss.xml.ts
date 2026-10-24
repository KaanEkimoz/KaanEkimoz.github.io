import type { APIContext } from 'astro';
import { blogFeed } from '@lib/rss';

export const GET = (context: APIContext) => blogFeed(context, 'tr');
