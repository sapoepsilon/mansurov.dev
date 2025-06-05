<script lang="ts">
	import ProjectShowcase from '$lib/components/portfolio/ProjectShowcase.svelte';
	import { fade } from 'svelte/transition';

	export let data;
	
	const { project } = data;
</script>

<svelte:head>
	<title>{project.title} | Ismatulla Mansurov</title>
	<meta name="description" content={project.description} />
	<meta property="og:title" content="{project.title} | Ismatulla Mansurov" />
	<meta property="og:description" content={project.description} />
	{#if project.hero_image}
		<meta property="og:image" content={project.hero_image} />
	{/if}
</svelte:head>

<div in:fade={{ duration: 300 }}>
	<ProjectShowcase {project} />
</div>