<script>
	import { cn } from '$lib/utils.js';
	import ProjectList from '$lib/components/projects/ProjectList.svelte';
</script>

<section class={cn("flex flex-col min-h-[calc(100vh-48px)] bg-background text-foreground px-4 md:px-6 lg:px-8 max-w-full overflow-x-hidden")}>
	<div class="items-start justify-start">
		<h1 class="text-4xl md:text-4xl font-normal mb-2">Portfolio</h1>
		<p class="text-xl md:text-2xl text-muted-foreground mb-8">Subheading</p>
	</div>
	<ProjectList />
</section>

<style>
	/* Additional safeguard against horizontal scrolling */
	:global(body) {
		overflow-x: hidden;
	}
</style>
