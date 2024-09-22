// src/lib/api/github.ts
import type { GitHubRepo } from '../types';

export async function fetchProjects(): Promise<GitHubRepo[]> {
	const response = await fetch('/api/github');
	if (!response.ok) {
		throw new Error('Failed to fetch repositories');
	}
	return await response.json();
}

export async function updateProject(repo: GitHubRepo): Promise<GitHubRepo> {
	const response = await fetch('/api/github', {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(repo),
	});
	if (!response.ok) {
		throw new Error('Failed to update repository');
	}
	return await response.json();
}

export async function pinProject(repo: GitHubRepo, pin: boolean): Promise<void> {
	repo.pinned = pin;
}
