import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
    const imageUrl = url.searchParams.get('url');
    const filename = url.searchParams.get('filename');
    
    if (!imageUrl || !filename) {
        throw error(400, 'Missing url or filename parameter');
    }

    // Validate that the URL is from our allowed domain
    if (!imageUrl.startsWith('https://wallapappers.mansurov.dev/')) {
        throw error(403, 'Invalid download URL');
    }

    try {
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw error(404, 'Image not found');
        }

        const buffer = await response.arrayBuffer();
        
        return new Response(buffer, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': buffer.byteLength.toString(),
            }
        });
    } catch (err) {
        console.error('Download error:', err);
        throw error(500, 'Failed to download image');
    }
};