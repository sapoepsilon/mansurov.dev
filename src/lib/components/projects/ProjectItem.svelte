<script>
	import { createEventDispatcher } from 'svelte';
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import Star from "lucide-svelte/icons/star";
	import GitFork from "lucide-svelte/icons/git-fork";
	import Info from "lucide-svelte/icons/info";
	import ExternalLink from "lucide-svelte/icons/external-link";

	/** @type {import('$lib/types').GitHubRepo} */
	export let project;
	/** @type {boolean} */
	export let isLoading = false;

	const dispatch = createEventDispatcher();

	function handleMoreInfo() {
		dispatch('moreInfo', project);
	}
</script>

<Card.Root class="w-full h-full flex flex-col hover:scale-[1.02] transition-all duration-300 ">
	<Card.Header class="flex-grow">
		<Card.Title>{project.name}</Card.Title>
		<Card.Description class="line-clamp-2">{project.description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="flex items-center space-x-4">
			<div class="flex items-center">
				<Star class="mr-1 h-4 w-4" />
				<span class="text-sm">{project.stargazers_count}</span>
			</div>
			<div class="flex items-center">
				<GitFork class="mr-1 h-4 w-4" />
				<span class="text-sm">{project.forks_count}</span>
			</div>
		</div>
		<p class="mt-2 text-sm">Language: {project.language}</p>
	</Card.Content>
	<Card.Footer class="flex justify-between mt-auto">
		<Button variant="outline" on:click={handleMoreInfo} disabled={isLoading} class="">
			{#if isLoading}
				Loading...
			{:else}
				<Info class="mr-2 h-4 w-4" /> More Info
			{/if}
		</Button>
		<a href={project.html_url} target="_blank" rel="noopener noreferrer">
			<Button variant="outline" disabled={isLoading} class="">
				{#if isLoading}
					Loading...
				{:else}
					<ExternalLink class="mr-2 h-4 w-4" /> View on GitHub
				{/if}
			</Button>
		</a>
	</Card.Footer>
</Card.Root>
