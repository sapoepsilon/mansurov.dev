<script lang="ts">
	import { cn } from "$lib/utils";
	let headline = "Ismatulla Mansurov";
	let subheadline = "I automate things";
</script>

<section class={cn("flex flex-col items-center justify-center min-h-[calc(100vh-48px)] bg-background text-foreground")}>
	<h1 class="text-4xl md:text-6xl lg:text-8xl font-bold mb-4 text-center">{headline}</h1>
	<p class="text-xl md:text-2xl text-muted-foreground mb-8">{subheadline}</p>

	<div class="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 py-2 px-4 rounded-md shadow-md">
		<p class="text-lg font-semibold">🚧 Website is Under Construction 🚧</p>
	</div>
</section>
