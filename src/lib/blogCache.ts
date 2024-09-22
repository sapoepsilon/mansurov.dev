// src/lib/blogCache.ts

import { dev } from '$app/environment';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    created_at: string;
    // Add any other fields your blog posts have
}

let cachedBlogPosts: BlogPost[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = dev ? 10 * 1000 : 5 * 60 * 1000; // 10 seconds in dev, 5 minutes in production

export function getCachedBlogPosts(): BlogPost[] | null {
    const currentTime = Date.now();
    if (cachedBlogPosts && currentTime - lastFetchTime < CACHE_DURATION) {
        return cachedBlogPosts;
    }
    return null;
}

export function setCachedBlogPosts(posts: BlogPost[]): void {
    cachedBlogPosts = posts;
    lastFetchTime = Date.now();
}

export function invalidateCache(): void {
    cachedBlogPosts = null;
    lastFetchTime = 0;
}

export function getCachedBlogPost(id: string): BlogPost | null {
    const posts = getCachedBlogPosts();
    return posts ? posts.find(post => post.id === id) || null : null;
}

export function addToCachedBlogPosts(post: BlogPost): void {
    if (cachedBlogPosts) {
        cachedBlogPosts = [post, ...cachedBlogPosts];
    }
}
