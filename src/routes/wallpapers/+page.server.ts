import { wallpaperPacks } from '$lib/data/wallpapers.js';
import { getFirstImagePair } from '$lib/services/r2.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const wallpapersWithImages = await Promise.all(
		wallpaperPacks.map(async (pack) => {
			if (pack.id === 'timpanogos-trip') {
				const imagePair = await getFirstImagePair('wallpapers/timpTrip/');
				return {
					...pack,
					mobile_wallpaper: imagePair.mobile || pack.mobile_wallpaper,
					desktop_wallpaper: imagePair.desktop || pack.desktop_wallpaper
				};
			}
			return pack;
		})
	);

	return {
		wallpapers: wallpapersWithImages
	};
};