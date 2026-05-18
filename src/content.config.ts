import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Projects collection — each game/project is a markdown file under src/content/projects.
 * Schemas use the `image()` helper so Astro validates + optimizes referenced assets.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
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
      // Cover image — used as hero on detail page + thumbnail on cards.
      coverImage: image().optional(),
      // Optional gallery — additional screenshots shown on detail page.
      gallery: z.array(image()).default([]),
      // YouTube video id (just the id, e.g. "0KpRHhH52hQ"). Lazy-embedded.
      youtubeId: z.string().optional(),
      order: z.number().optional(),
      // Locale of this entry. Files without a frontmatter value default to
      // English; Turkish entries set `lang: tr` (paired with a `.tr.md`
      // filename so the id stays distinct from the English counterpart).
      lang: z.enum(['en', 'tr']).default('en'),
    }),
});

/**
 * Blog collection — markdown/mdx posts under src/content/blog.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      heroImage: image().optional(),
      draft: z.boolean().default(false),
      // Locale of this post. Defaults to English; Turkish posts use a
      // `.tr.md` filename and set `lang: tr` so the page can pair them
      // with the English counterpart for the language toggle.
      lang: z.enum(['en', 'tr']).default('en'),
    }),
});

export const collections = { projects, blog };
