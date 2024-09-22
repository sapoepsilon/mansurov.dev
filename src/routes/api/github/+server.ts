import { VITE_GITHUB_TOKEN, VITE_GITHUB_USERNAME } from '$env/static/private';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const GITHUB_API_URL = 'https://api.github.com';

const headers = {
    Authorization: `token ${VITE_GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
};

export const GET: RequestHandler = async () => {
    const response = await fetch(
        `${GITHUB_API_URL}/users/${VITE_GITHUB_USERNAME}/repos?sort=updated&direction=desc`,
        { headers }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch repositories');
    }

    const repos = await response.json();
    return json(repos.map(repo => ({ ...repo, pinned: false })));
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

    return json(await response.json());
};
