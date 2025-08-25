import { S3Client, ListObjectsV2Command, type ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';
import {
	R2_ACCOUNT_ID,
	R2_ACCESS_KEY_ID,
	R2_SECRET_ACCESS_KEY,
	R2_BUCKET_NAME,
	R2_PUBLIC_URL
} from '$env/static/private';

const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

export async function listImages(path: string): Promise<string[]> {
	try {
		const command = new ListObjectsV2Command({
			Bucket: R2_BUCKET_NAME,
			Prefix: path,
			MaxKeys: 50
		});

		const response: ListObjectsV2CommandOutput = await r2Client.send(command);
		
		if (!response.Contents) {
			return [];
		}

		return response.Contents
			.filter(obj => obj.Key && isImageFile(obj.Key))
			.map(obj => obj.Key!)
			.sort()
			.reverse();
	} catch (error) {
		console.error('Error listing images from R2:', error);
		return [];
	}
}

export function getImageUrl(key: string): string {
	return `/api/images/${key}`;
}

export async function getFirstImage(path: string): Promise<string | null> {
	const images = await listImages(path);
	return images.length > 0 ? getImageUrl(images[0]) : null;
}

export async function getFirstImagePair(path: string): Promise<{ mobile: string | null; desktop: string | null }> {
	const images = await listImages(path);
	
	const mobileImage = images.find(img => img.toLowerCase().includes('_mobile.jpg'));
	const desktopImage = images.find(img => img.toLowerCase().includes('_desktop.jpg'));
	
	return {
		mobile: mobileImage ? getImageUrl(mobileImage) : null,
		desktop: desktopImage ? getImageUrl(desktopImage) : null
	};
}

function isImageFile(key: string): boolean {
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
	const lowerKey = key.toLowerCase();
	return imageExtensions.some(ext => lowerKey.endsWith(ext));
}