import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		tags: z.array(z.string()),
		repo: z.string().url().optional(),
		live: z.string().url().optional(),
		draft: z.boolean().default(false),
	}),
});

const lab = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		type: z.enum(['article', 'experiment']),
		draft: z.boolean().default(false),
	}),
});

export const collections = { projects, lab };
