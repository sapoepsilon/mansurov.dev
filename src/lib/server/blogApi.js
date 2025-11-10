import { PRIVATE_BLOG_API_URL } from '$env/static/private';

/**
 * @typedef {import('$lib/types').Post} Post
 */

const API_BASE_URL = PRIVATE_BLOG_API_URL;

export class BlogApiError extends Error {
	constructor(message, status) {
		super(message);
		this.name = 'BlogApiError';
		this.status = status;
	}
}

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeout);

	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal
		});
		clearTimeout(timeoutId);
		return response;
	} catch (error) {
		clearTimeout(timeoutId);
		throw error;
	}
}

/**
 * @returns {Promise<Post[]>}
 */
export async function getAllPosts() {
	try {
		const response = await fetchWithTimeout(`${API_BASE_URL}/posts`, {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			throw new BlogApiError(
				`Failed to fetch posts: ${response.statusText}`,
				response.status
			);
		}

		const posts = await response.json();
		return posts.filter((post) => post.published_at !== null);
	} catch (error) {
		if (error.name === 'AbortError') {
			throw new BlogApiError('Request timeout', 408);
		}
		throw error;
	}
}

/**
 * @param {string} slug
 * @returns {Promise<Post | null>}
 */
export async function getPostBySlug(slug) {
	try {
		const posts = await getAllPosts();
		return posts.find((post) => post.slug === slug) || null;
	} catch (error) {
		throw error;
	}
}

/**
 * @param {number} id
 * @returns {Promise<boolean>}
 */
export async function incrementViewCount(id) {
	try {
		const response = await fetchWithTimeout(
			`${API_BASE_URL}/posts/${id}/increment_view`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			},
			5000
		);

		return response.ok;
	} catch (error) {
		console.error('Failed to increment view count:', error);
		return false;
	}
}
