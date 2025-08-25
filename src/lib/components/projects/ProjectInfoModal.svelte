<script>
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import Star from "lucide-svelte/icons/star";
	import GitFork from "lucide-svelte/icons/git-fork";
	import Tag from "lucide-svelte/icons/tag";
	import ExternalLink from "lucide-svelte/icons/external-link";

	/** @type {import('$lib/types').GitHubRepo} */
	export let project;

	const dispatch = createEventDispatcher();
</script>

<Dialog.Root open={true}>
	<Dialog.Content class="sm:max-w-[525px] ">
		<Dialog.Header>
			<Dialog.Title>{project.name}</Dialog.Title>
			<Dialog.Description>
				{project.description}
			</Dialog.Description>
		</Dialog.Header>
		<div class="py-4">
			<p class="mb-2"><strong>Full Name:</strong> {project.full_name}</p>
			<p class="mb-2"><strong>Language:</strong> {project.language}</p>
			<div class="flex items-center space-x-4 mb-2">
				<div class="flex items-center">
					<Star class="mr-1 h-4 w-4" />
					<span>{project.stargazers_count} stars</span>
				</div>
				<div class="flex items-center">
					<GitFork class="mr-1 h-4 w-4" />
					<span>{project.forks_count} forks</span>
				</div>
			</div>
			{#if project.topics && project.topics.length > 0}
				<div class="flex items-center flex-wrap gap-2 mb-2">
					<Tag class="h-4 w-4" />
					{#each project.topics as topic}
						<span class="px-3 py-1 text-sm rounded-full">{topic}</span>
					{/each}
				</div>
			{/if}
		</div>
		<Dialog.Footer class="flex justify-between">
			<Button on:click={() => dispatch('close')} class="">Close</Button>
			<a href={project.html_url} target="_blank" rel="noopener noreferrer">
				<Button class="">
					<ExternalLink class="mr-2 h-4 w-4" />
					View on GitHub
				</Button>
			</a>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
