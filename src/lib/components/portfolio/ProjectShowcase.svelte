<script lang="ts">
	import ProjectHeader from './ProjectHeader.svelte';
	import ProjectMedia from './ProjectMedia.svelte';
	import ProjectDescription from './ProjectDescription.svelte';
	import ProjectFeatures from './ProjectFeatures.svelte';
	import ProjectTech from './ProjectTech.svelte';
	import ProjectLinks from './ProjectLinks.svelte';
	import { fade } from 'svelte/transition';

	export let project: {
		title: string;
		subtitle: string;
		tech_stack: string[];
		hero_image?: string;
		hero_video?: string;
		gallery_images?: string[];
		problem: string;
		solution: string;
		description: string;
		features: Array<{
			title: string;
			description: string;
			icon?: string;
		}>;
		technical_highlights: string[];
		demo_url?: string;
		source_url?: string;
		github_url?: string;
	};
</script>

<article 
	class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-12"
	in:fade={{ duration: 300 }}
>
	<ProjectHeader 
		title={project.title} 
		subtitle={project.subtitle} 
		techStack={project.tech_stack} 
	/>
	
	<ProjectMedia 
		heroImage={project.hero_image}
		heroVideo={project.hero_video}
		galleryImages={project.gallery_images}
	/>
	
	<ProjectDescription 
		problem={project.problem}
		solution={project.solution}
		description={project.description}
	/>
	
	<ProjectFeatures features={project.features} />
	
	<ProjectTech highlights={project.technical_highlights} />
	
	<ProjectLinks 
		demoUrl={project.demo_url}
		sourceUrl={project.source_url}
		githubUrl={project.github_url}
	/>
</article>