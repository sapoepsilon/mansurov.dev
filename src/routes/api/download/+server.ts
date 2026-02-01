import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { error, redirect } from '@sveltejs/kit';
import {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME
} from '$env/static/private';
import type { RequestHandler } from './$types';

const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
    }
});

const ALLOWED_DOMAIN = 'https://wallapappers.mansurov.dev/';

export const GET: RequestHandler = async ({ url }) => {
    const imageUrl = url.searchParams.get('url');
    const filename = url.searchParams.get('filename');

    if (!imageUrl || !filename) {
        throw error(400, 'Missing url or filename parameter');
    }

    if (!imageUrl.startsWith(ALLOWED_DOMAIN)) {
        throw error(403, 'Invalid download URL');
    }

    const key = imageUrl.slice(ALLOWED_DOMAIN.length);

    try {
        const command = new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: key,
            ResponseContentDisposition: `attachment; filename="${filename}"`
        });

        const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });

        throw redirect(302, signedUrl);
    } catch (err) {
        if (err && typeof err === 'object' && 'status' in err && err.status === 302) {
            throw err;
        }
        console.error('Download error:', err);
        throw error(500, 'Failed to generate download URL');
    }
};
