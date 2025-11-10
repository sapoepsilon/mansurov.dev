import { json, error } from '@sveltejs/kit';
import { updatePost, BlogApiError } from '$lib/server/blogApi';
import { blogPostSchema } from '../../../admin/blog/schema';
import type { RequestHandler } from './$types';

function isLocalhost(request: Request): boolean {
	const host = request.headers.get('host');
	return !!host && (host.startsWith('localhost') || host.startsWith('127.0.0.1'));
}

export const POST: RequestHandler = async ({ request }) => {
	if (!isLocalhost(request)) {
		throw error(403, 'Admin API only available on localhost');
	}

	try {
		const body = await request.json();

		if (!body.id) {
			return json(
				{
					success: false,
					message: 'Post ID is required'
				},
				{ status: 400 }
			);
		}

		const validation = blogPostSchema.safeParse(body);
		if (!validation.success) {
			return json(
				{
					success: false,
					errors: validation.error.flatten().fieldErrors
				},
				{ status: 400 }
			);
		}

		const { title, slug, content, isDraft, publishedAt } = validation.data;

		const postData = {
			title,
			slug,
			content,
			published_at: isDraft ? null : publishedAt || new Date().toISOString(),
			edited_at: new Date().toISOString()
		};

		const updatedPost = await updatePost(body.id, postData);

		return json({
			success: true,
			post: updatedPost
		});
	} catch (err) {
		console.error('Update post error:', err);

		if (err instanceof BlogApiError) {
			return json(
				{
					success: false,
					message: err.message
				},
				{ status: err.status || 500 }
			);
		}

		return json(
			{
				success: false,
				message: 'Failed to update post'
			},
			{ status: 500 }
		);
	}
};
