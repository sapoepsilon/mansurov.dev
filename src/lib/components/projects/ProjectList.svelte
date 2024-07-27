<script>
	import { onMount } from 'svelte';
	import { fetchProjects } from '$lib/api/github';
	import ProjectItem from './ProjectItem.svelte';
	import ProjectInfoModal from './ProjectInfoModal.svelte';

	/** @type {import('$lib/types').GitHubRepo[]} */
	let projects = [];

	/** @type {import('$lib/types').GitHubRepo | null} */
	let selectedProject = null;

	/** @type {boolean} */
	let showInfoModal = false;

	/** @type {boolean} */
	let isLoading = false;

	onMount(async () => {
		isLoading = true;
		try {
			projects = await fetchProjects();
		} catch (error) {
			console.error('Failed to fetch projects:', error);
			// Handle error (e.g., show error message to user)
		} finally {
			isLoading = false;
		}
	});

	/**
	 * @param {CustomEvent<import('$lib/types').GitHubRepo>} event
	 */
	function handleMoreInfo(event) {
		selectedProject = event.detail;
		showInfoModal = true;
	}
</script>

<div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each projects as project (project.id)}
		<ProjectItem
			{project}
			{isLoading}
			on:moreInfo={handleMoreInfo}
		/>
	{/each}
</div>

{#if showInfoModal && selectedProject}
	<ProjectInfoModal
		project={selectedProject}
		on:close={() => showInfoModal = false}
	/>
{/if}
