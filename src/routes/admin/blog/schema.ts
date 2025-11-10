import { z } from 'zod';

function slugify(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export const blogPostSchema = z.object({
	title: z
		.string()
		.min(3, 'Title must be at least 3 characters')
		.max(200, 'Title must be less than 200 characters'),
	slug: z
		.string()
		.min(3, 'Slug must be at least 3 characters')
		.max(200, 'Slug must be less than 200 characters')
		.regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
	content: z.string().min(10, 'Content must be at least 10 characters'),
	isDraft: z.boolean().default(true),
	publishedAt: z.string().optional()
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

export { slugify };
