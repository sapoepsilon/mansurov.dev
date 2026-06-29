import type { R2Bucket } from '@cloudflare/workers-types';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface UploadResult {
	success: boolean;
	url?: string;
	key?: string;
	error?: string;
}

function sanitizeFileName(fileName: string): string {
	return fileName
		.toLowerCase()
		.replace(/[^a-z0-9.-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

function getFileExtension(fileName: string): string {
	const parts = fileName.split('.');
	return parts.length > 1 ? parts[parts.length - 1] : 'jpg';
}

export async function uploadBlogImage(
	bucket: R2Bucket,
	file: File,
	postSlug: string
): Promise<UploadResult> {
	try {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			return {
				success: false,
				error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
			};
		}

		if (file.size > MAX_FILE_SIZE) {
			return {
				success: false,
				error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
			};
		}

		const timestamp = Date.now();
		const sanitizedFileName = sanitizeFileName(file.name);
		const extension = getFileExtension(sanitizedFileName);
		const key = `blog/${postSlug}/image-${timestamp}.${extension}`;

		await bucket.put(key, await file.arrayBuffer(), {
			httpMetadata: {
				contentType: file.type,
				cacheControl: 'public, max-age=31536000'
			}
		});

		return {
			success: true,
			url: `/api/images/${key}`,
			key
		};
	} catch (error) {
		console.error('Error uploading image to R2:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to upload image'
		};
	}
}
