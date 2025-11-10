import { error } from '@sveltejs/kit';
import { getAllPosts } from '$lib/server/blogApi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	try {
		const posts = await getAllPosts();
		const post = posts.find((p) => p.slug === slug);

		if (!post) {
			throw error(404, 'Post not found');
		}

		return { post };
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		throw error(500, 'Failed to load post');
	}
};
