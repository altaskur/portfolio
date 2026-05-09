import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
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

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		publishDate: z.coerce.date(),
		type: z.enum(['article', 'experiment']),
		draft: z.boolean().default(false),
	}),
});

export const collections = { projects, blog };
