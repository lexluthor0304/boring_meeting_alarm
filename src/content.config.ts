import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const privacy = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/privacy' }),
  schema: z.object({
    title: z.string(),
    locale: z.enum(['en', 'zh', 'ja']),
    lastUpdated: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    // Default generateId collapses on basename, which collides when each
    // locale uses the same slug. Use the full relative path instead.
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    locale: z.enum(['en', 'zh', 'ja']),
    datePublished: z.string(),
    dateModified: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('tokugai'),
  }),
});

export const collections = { privacy, blog };
