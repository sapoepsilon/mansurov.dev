// src/routes/api/github/+server.ts
import { VITE_GITHUB_TOKEN, VITE_GITHUB_USERNAME } from '$env/static/private';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const GITHUB_API_URL = 'https://api.github.com';

const headers = {
    Authorization: `token ${VITE_GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
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
        `${GITHUB_API_URL}/users/${VITE_GITHUB_USERNAME}/repos?sort=updated&direction=desc`,
        { headers }
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
        headers,
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
