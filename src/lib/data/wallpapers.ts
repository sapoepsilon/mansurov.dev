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
		desktop_wallpaper: 'https://wallpapers.mansurov.dev/wallpapers/timpTrip/1_Desktop.jpg',
		mobile_wallpaper: 'https://wallpapers.mansurov.dev/wallpapers/timpTrip/1_Mobile.jpg',
		theme: 'light',
		tags: ['nature', 'mountains', 'hiking', 'timpanogos'],
		created_at: '2024-08-24'
	}
];