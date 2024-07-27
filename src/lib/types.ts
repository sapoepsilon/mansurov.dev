export interface GitHubRepo {
	id: number;
	name: string;
	full_name: string;
	description: string;
	html_url: string;
	stargazers_count: number;
	forks_count: number;
	language: string;
	topics: string[];
	pinned?: boolean;
}
