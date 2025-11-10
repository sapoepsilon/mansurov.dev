import { error } from '@sveltejs/kit';
import { getPostBySlug, incrementViewCount, BlogApiError } from '$lib/server/blogApi.js';

export async function load({ params }) {
	const { slug } = params;

	try {
		const post = await getPostBySlug(slug);

		if (!post) {
			throw error(404, {
				message: 'Post not found'
			});
		}

		incrementViewCount(post.id);

		return {
			post,
			error: null
		};
	} catch (err) {
		if (err.status === 404) {
			throw err;
		}

		console.error('Failed to fetch blog post:', err);

		throw error(500, {
			message: err instanceof BlogApiError ? err.message : 'Unable to load blog post'
		});
	}
}
