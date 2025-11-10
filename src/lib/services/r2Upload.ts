import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {
	R2_ACCOUNT_ID,
	R2_ACCESS_KEY_ID,
	R2_SECRET_ACCESS_KEY,
	R2_BUCKET_NAME
} from '$env/static/private';

const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

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

		const buffer = await file.arrayBuffer();

		const command = new PutObjectCommand({
			Bucket: R2_BUCKET_NAME,
			Key: key,
			Body: Buffer.from(buffer),
			ContentType: file.type,
			CacheControl: 'public, max-age=31536000'
		});

		await r2Client.send(command);

		const url = `/api/images/${key}`;

		return {
			success: true,
			url,
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

export async function uploadMultipleBlogImages(
	files: File[],
	postSlug: string
): Promise<UploadResult[]> {
	const uploadPromises = files.map((file) => uploadBlogImage(file, postSlug));
	return Promise.all(uploadPromises);
}
