<script>
	import { cn } from '$lib/utils.js';
	import ProjectList from '$lib/components/projects/ProjectList.svelte';
</script>

<section class={cn("flex flex-col  min-h-[calc(100vh-48px)] bg-background text-foreground")}>
	<div class="items-start justify-start lg:ml-6 md:ml-2">
		<h1 class="text-4xl md:text-4xl font-normal mb-2">Porfolio</h1>
		<p class="text-xl md:text-2xl text-muted-foreground mb-8">Subheading</p>
	</div>
	<ProjectList />
</section>
