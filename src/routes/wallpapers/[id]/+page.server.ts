import { wallpaperPacks } from '$lib/data/wallpapers.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const wallpaper = wallpaperPacks.find(pack => pack.id === params.id);
	
	if (!wallpaper) {
		throw error(404, 'Wallpaper not found');
	}

	return {
		wallpaper
	};
};