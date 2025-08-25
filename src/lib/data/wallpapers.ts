export interface WallpaperPack {
	id: string;
	name: string;
	description: string;
	desktop_wallpaper: string;
	mobile_wallpaper: string;
	theme: 'light' | 'dark' | 'colorful';
	tags: string[];
	created_at: string;
}

export const wallpaperPacks: WallpaperPack[] = [
	{
		id: 'timpanogos-trip',
		name: 'Timpanogos Trip',
		description: 'Beautiful moments from the Timpanogos hiking adventure',
		desktop_wallpaper: 'https://picsum.photos/2560/1600?random=1',
		mobile_wallpaper: 'https://picsum.photos/1080/1920?random=1',
		theme: 'light',
		tags: ['nature', 'mountains', 'hiking', 'timpanogos'],
		created_at: '2024-08-24'
	}
];