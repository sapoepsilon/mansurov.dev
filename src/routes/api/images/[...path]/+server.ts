import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform, setHeaders }) => {
	const bucket = platform?.env?.BUCKET;
	if (!bucket) {
		throw error(500, 'R2 bucket binding not available');
	}

	const object = await bucket.get(params.path);
	if (!object) {
		throw error(404, 'Image not found');
	}

	setHeaders({
		'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
		'Content-Length': object.size.toString(),
		'Cache-Control': 'public, max-age=31536000',
		ETag: object.httpEtag
	});

	return new Response(object.body as unknown as ReadableStream);
};
