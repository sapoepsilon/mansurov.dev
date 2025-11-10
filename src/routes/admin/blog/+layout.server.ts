import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
	const host = request.headers.get('host');

	if (!host || (!host.startsWith('localhost') && !host.startsWith('127.0.0.1'))) {
		throw error(403, 'Admin access only available on localhost');
	}

	return {};
};
