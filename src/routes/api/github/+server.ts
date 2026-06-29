// src/routes/api/github/+server.ts
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const GITHUB_API_URL = 'https://api.github.com';

const ghHeaders = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        // GitHub's API rejects requests without a User-Agent
        'User-Agent': 'mansurov.dev',
    };
    // Token is optional: public repos need no auth; it only raises rate limits
    // and enables the admin PATCH. A bad/expired token 401s, so only send a real one.
    if (env.VITE_GITHUB_TOKEN) headers.Authorization = `token ${env.VITE_GITHUB_TOKEN}`;
    return headers;
};

// Cache structure
let cachedRepos: any[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const GET: RequestHandler = async () => {
    const currentTime = Date.now();

    // Check if cache is valid
    if (cachedRepos && currentTime - lastFetchTime < CACHE_DURATION) {
        return json(cachedRepos);
    }

    // Fetch new data if cache is invalid or doesn't exist
    const response = await fetch(
        `${GITHUB_API_URL}/users/${env.VITE_GITHUB_USERNAME}/repos?sort=updated&direction=desc`,
        { headers: ghHeaders() }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch repositories');
    }

    const repos = await response.json();
    const processedRepos = repos.map(repo => ({ ...repo, pinned: false }));

    // Update cache
    cachedRepos = processedRepos;
    lastFetchTime = currentTime;

    return json(processedRepos);
};

export const PATCH: RequestHandler = async ({ request }) => {
    const repo = await request.json();
    const response = await fetch(`${GITHUB_API_URL}/repos/${repo.full_name}`, {
        method: 'PATCH',
        headers: ghHeaders(),
        body: JSON.stringify({
            name: repo.name,
            description: repo.description,
            topics: repo.topics,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update repository');
    }

    const updatedRepo = await response.json();

    // Update the cache if it exists
    if (cachedRepos) {
        const index = cachedRepos.findIndex(r => r.id === updatedRepo.id);
        if (index !== -1) {
            cachedRepos[index] = { ...updatedRepo, pinned: cachedRepos[index].pinned };
        }
    }

    return json(updatedRepo);
};
