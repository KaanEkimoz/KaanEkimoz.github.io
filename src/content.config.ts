import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Projects collection — each game/project is a markdown file under src/content/projects.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    platform: z.enum(['Mobile', 'PC', 'VR', 'Web']),
    genres: z.array(z.string()),
    year: z.number(),
    duration: z.string(),
    role: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    links: z
      .object({
        github: z.string().url().optional(),
        youtube: z.string().url().optional(),
        googlePlay: z.string().url().optional(),
        itchio: z.string().url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    order: z.number().optional(),
  }),
});

/**
 * Blog collection — markdown/mdx posts under src/content/blog.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
