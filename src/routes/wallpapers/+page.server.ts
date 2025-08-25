import { wallpaperPacks } from '$lib/data/wallpapers.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		wallpapers: wallpaperPacks
	};
};