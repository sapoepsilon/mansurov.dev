import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { error } from '@sveltejs/kit';
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

export const GET: RequestHandler = async ({ params, setHeaders }) => {
    try {
        const path = params.path;
        
        const command = new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: path
        });

        const response = await r2Client.send(command);
        
        if (!response.Body) {
            throw error(404, 'Image not found');
        }

        const chunks: Buffer[] = [];
        
        for await (const chunk of response.Body) {
            chunks.push(chunk);
        }
        
        const combined = Buffer.concat(chunks);

        setHeaders({
            'Content-Type': response.ContentType || 'image/jpeg',
            'Content-Length': response.ContentLength?.toString() || combined.length.toString(),
            'Cache-Control': 'public, max-age=31536000',
            'ETag': response.ETag || ''
        });

        return new Response(combined);
    } catch (err) {
        console.error('Error fetching image from R2:', err);
        throw error(500, 'Failed to fetch image');
    }
};