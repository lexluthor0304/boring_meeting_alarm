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

export const collections = { privacy };
