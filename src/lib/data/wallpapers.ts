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
		id: '1',
		name: 'Mountain Serenity',
		description: 'Breathtaking mountain landscapes in high resolution',
		desktop_wallpaper: 'https://picsum.photos/2560/1600?random=1',
		mobile_wallpaper: 'https://picsum.photos/1080/1920?random=1',
		theme: 'light',
		tags: ['nature', 'mountains', 'landscape'],
		created_at: '2024-01-15'
	},
	{
		id: '2', 
		name: 'Ocean Depths',
		description: 'Stunning underwater photography and ocean scenes',
		desktop_wallpaper: 'https://picsum.photos/2560/1600?random=2',
		mobile_wallpaper: 'https://picsum.photos/1080/1920?random=2',
		theme: 'dark',
		tags: ['ocean', 'underwater', 'blue'],
		created_at: '2024-01-10'
	},
	{
		id: '3',
		name: 'Abstract Geometry',
		description: 'Modern geometric patterns and abstract designs',
		desktop_wallpaper: 'https://picsum.photos/2560/1600?random=3',
		mobile_wallpaper: 'https://picsum.photos/1080/1920?random=3',
		theme: 'colorful',
		tags: ['abstract', 'geometric', 'modern'],
		created_at: '2024-01-05'
	},
	{
		id: '4',
		name: 'Forest Canopy',
		description: 'Peaceful forest scenes and tree photography',
		desktop_wallpaper: 'https://picsum.photos/2560/1600?random=4',
		mobile_wallpaper: 'https://picsum.photos/1080/1920?random=4',
		theme: 'light',
		tags: ['forest', 'trees', 'nature'],
		created_at: '2024-01-01'
	}
];