import { error } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const url = new URL(event.request.url);
	const host = event.request.headers.get('host');

	if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) {
		if (!host || (!host.startsWith('localhost') && !host.startsWith('127.0.0.1'))) {
			throw error(403, 'Admin access only available on localhost');
		}
	}

	return resolve(event);
};
