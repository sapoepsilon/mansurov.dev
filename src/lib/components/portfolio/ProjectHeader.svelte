<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	
	export let title: string;
	export let subtitle: string;
	export let techStack: string[];
</script>

<header class="text-center space-y-6">
	<div class="space-y-2">
		<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
			{title}
		</h1>
		<p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
			{subtitle}
		</p>
	</div>
	
	<div class="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
		{#each techStack as tech}
			<Badge 
				variant="secondary" 
				class="px-3 py-1 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
			>
				{tech}
			</Badge>
		{/each}
	</div>
</header>