import type { GitHubRepo } from '../types';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;

const headers = {
	Authorization: `token ${GITHUB_TOKEN}`,
	'Content-Type': 'application/json',
};

export async function fetchProjects(): Promise<GitHubRepo[]> {
	const response = await fetch(
		`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`,
		{ headers }
	);
	if (!response.ok) {
		throw new Error('Failed to fetch repositories');
	}
	const repos: GitHubRepo[] = await response.json();
	return repos.map(repo => ({ ...repo, pinned: false }));
}

export async function updateProject(repo: GitHubRepo): Promise<GitHubRepo> {
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
	return await response.json();
}

export async function pinProject(repo: GitHubRepo, pin: boolean): Promise<void> {
	// GitHub doesn't have a direct API for pinning repos, so we'll just update our local state
	repo.pinned = pin;
}
