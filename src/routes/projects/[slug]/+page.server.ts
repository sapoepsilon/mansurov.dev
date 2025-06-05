import { whisperaProject } from '$lib/data/whispera-project.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// Hardcoded projects lookup
	const projects = [whisperaProject];
	
	const project = projects.find(p => p.slug === params.slug);
	
	if (!project) {
		throw error(404, 'Project not found');
	}

	return {
		project
	};
};