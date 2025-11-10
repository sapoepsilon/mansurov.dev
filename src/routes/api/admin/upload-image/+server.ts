import { json, error } from '@sveltejs/kit';
import { uploadBlogImage } from '$lib/services/r2Upload';
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
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const postSlug = formData.get('postSlug') as string;

		if (!file) {
			throw error(400, 'No file provided');
		}

		if (!postSlug) {
			throw error(400, 'No post slug provided');
		}

		const result = await uploadBlogImage(file, postSlug);

		if (!result.success) {
			throw error(500, result.error || 'Failed to upload image');
		}

		return json({
			success: true,
			url: result.url,
			key: result.key
		});
	} catch (err) {
		console.error('Upload error:', err);

		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}

		throw error(500, 'Failed to upload image');
	}
};
