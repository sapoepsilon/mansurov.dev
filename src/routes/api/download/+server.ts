import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ALLOWED_DOMAIN = 'https://wallapappers.mansurov.dev/';

export const GET: RequestHandler = async ({ url }) => {
	const imageUrl = url.searchParams.get('url');
	const filename = url.searchParams.get('filename');

	if (!imageUrl || !filename) {
		throw error(400, 'Missing url or filename parameter');
	}

	if (!imageUrl.startsWith(ALLOWED_DOMAIN)) {
		throw error(403, 'Invalid download URL');
	}

	const upstream = await fetch(imageUrl);
	if (!upstream.ok || !upstream.body) {
		throw error(502, 'Failed to fetch file');
	}

	return new Response(upstream.body, {
		headers: {
			'Content-Type': upstream.headers.get('Content-Type') ?? 'application/octet-stream',
			'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`
		}
	});
};
