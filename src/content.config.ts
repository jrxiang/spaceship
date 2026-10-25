import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /** One broad area per post, e.g. Engineering, Notes, Essays. */
    category: z.string(),
    /** Any number of free-form keywords for cross-cutting topics. */
    tags: z.array(z.string()).default([]),
    /** Drafts are excluded from the built site. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
