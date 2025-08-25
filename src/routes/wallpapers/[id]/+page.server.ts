import { wallpaperPacks } from '$lib/data/wallpapers.js';
import { listImages, getImageUrl } from '$lib/services/r2.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const wallpaper = wallpaperPacks.find(pack => pack.id === params.id);
	
	if (!wallpaper) {
		throw error(404, 'Wallpaper not found');
	}

	let images: Array<{ mobile: string; desktop: string; name: string }> = [];
	
	if (wallpaper.id === 'timpanogos-trip') {
		const allImages = await listImages('wallpapers/timpTrip/');
		
		// Group images by their base name (without _Mobile or _Desktop suffix)
		const imageGroups = new Map<string, { mobile?: string; desktop?: string }>();
		
		allImages.forEach(imagePath => {
			const fileName = imagePath.split('/').pop() || '';
			const baseName = fileName.replace(/_Mobile\.jpg$|_Desktop\.jpg$/, '');
			
			if (!imageGroups.has(baseName)) {
				imageGroups.set(baseName, {});
			}
			
			if (fileName.includes('_Mobile.jpg')) {
				imageGroups.get(baseName)!.mobile = getImageUrl(imagePath);
			} else if (fileName.includes('_Desktop.jpg')) {
				imageGroups.get(baseName)!.desktop = getImageUrl(imagePath);
			}
		});
		
		images = Array.from(imageGroups.entries()).map(([name, urls]) => ({
			name,
			mobile: urls.mobile || '',
			desktop: urls.desktop || ''
		})).filter(img => img.mobile && img.desktop);
	}
	
	return {
		wallpaper,
		images
	};
};