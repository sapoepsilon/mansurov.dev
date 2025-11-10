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

export interface Post {
	id: number;
	title: string;
	slug: string;
	content: string;
	published_at: string | null;
	edited_at: string | null;
	view_count: number;
	created_at: string;
	updated_at: string;
}
