import { whisperaProject } from '$lib/data/whispera-project.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Return hardcoded projects data
	return {
		projects: [whisperaProject]
	};
};