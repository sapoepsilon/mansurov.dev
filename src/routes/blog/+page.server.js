import { getAllPosts, BlogApiError } from '$lib/server/blogApi.js';

export async function load() {
	try {
		const posts = await getAllPosts();

		posts.sort((a, b) => {
			const dateA = new Date(a.published_at || 0);
			const dateB = new Date(b.published_at || 0);
			return dateB - dateA;
		});

		return {
			posts,
			error: null
		};
	} catch (error) {
		console.error('Failed to fetch blog posts:', error);

		return {
			posts: [],
			error: error instanceof BlogApiError ? error.message : 'Unable to load blog posts'
		};
	}
}
