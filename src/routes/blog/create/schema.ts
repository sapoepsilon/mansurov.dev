import { z } from 'zod';

export const blogSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
    content: z.string().min(1, 'Content is not recognized from markdown'),
    imageUrl: z.string().url('Invalid URL').optional()
});

export type BlogSchema = typeof blogSchema;
