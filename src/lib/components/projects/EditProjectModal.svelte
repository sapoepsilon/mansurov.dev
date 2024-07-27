<script>
	import { createEventDispatcher } from 'svelte';
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	/** @type {import('$lib/types').GitHubRepo} */
	export let project;

	const dispatch = createEventDispatcher();

	/** @type {import('$lib/types').GitHubRepo} */
	let editedProject = { ...project };

	function handleSave() {
		dispatch('save', editedProject);
	}
</script>

<Dialog.Root open={true}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Edit Project</Dialog.Title>
			<Dialog.Description>
				Make changes to your project here. Click save when you're done.
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-right">Name</Label>
				<Input id="name" bind:value={editedProject.name} class="col-span-3" />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="description" class="text-right">Description</Label>
				<Input id="description" bind:value={editedProject.description} class="col-span-3" />
			</div>
		</div>
		<Dialog.Footer>
			<Button on:click={() => dispatch('close')}>Cancel</Button>
			<Button on:click={handleSave}>Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
