<script>
	import { onMount } from 'svelte';
	import { fetchProjects } from '$lib/api/github';
	import ProjectItem from './ProjectItem.svelte';
	import ProjectInfoModal from './ProjectInfoModal.svelte';
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";
	import { fade, slide } from 'svelte/transition';

	/** @type {import('$lib/types').GitHubRepo[]} */
	let projects = [];

	/** @type {import('$lib/types').GitHubRepo | null} */
	let selectedProject = null;

	/** @type {boolean} */
	let showInfoModal = false;

	/** @type {boolean} */
	let isLoading = true;

	onMount(async () => {
		try {
			console.log("Fetching projects...");
			projects = await fetchProjects();
			console.log("Projects fetched:", projects);
		} catch (error) {
			console.error('Failed to fetch projects:', error);
			// Handle error (e.g., show error message to user)
		} finally {
			isLoading = false;
			console.log("Loading finished, isLoading:", isLoading);
		}
	});

	/**
	 * @param {CustomEvent<import('$lib/types').GitHubRepo>} event
	 */
	function handleMoreInfo(event) {
		selectedProject = event.detail;
		showInfoModal = true;
	}

	// Function to generate skeleton items
	const skeletonItems = Array(8).fill(null);
</script>

<div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" in:fade="{{ duration: 300 }}">
	{#if isLoading}
		{#each skeletonItems as _, i}
			<div
					class="border rounded-lg p-4 space-y-4"
					in:slide="{{ duration: 300, delay: i * 50 }}"
			>
				<Skeleton class="h-6 w-3/4" />
				<Skeleton class="h-4 w-full" />
				<Skeleton class="h-4 w-5/6" />
				<div class="flex space-x-2">
					<Skeleton class="h-8 w-16" />
					<Skeleton class="h-8 w-16" />
				</div>
			</div>
		{/each}
	{:else if projects.length === 0}
		<p in:slide="{{ duration: 300 }}">No projects found.</p>
	{:else}
		{#each projects as project, i (project.id)}
			<div in:slide="{{ duration: 300, delay: i * 50 }}">
				<ProjectItem
						{project}
						on:moreInfo={handleMoreInfo}
				/>
			</div>
		{/each}
	{/if}
</div>

{#if showInfoModal && selectedProject}
	<ProjectInfoModal
			project={selectedProject}
			on:close={() => showInfoModal = false}
	/>
{/if}
