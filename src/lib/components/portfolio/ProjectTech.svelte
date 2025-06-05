<script lang="ts">
	export let highlights: string[];
</script>

<section class="space-y-8">
	<div class="text-center space-y-2">
		<h2 class="text-3xl font-semibold">Technical Implementation</h2>
		<p class="text-muted-foreground">Key technical achievements and architecture decisions</p>
	</div>
	
	<div class="max-w-4xl mx-auto">
		<div class="grid gap-4">
			{#each highlights as highlight, index}
				<div class="flex gap-4 p-4 rounded-lg border bg-card/50">
					<div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
						{index + 1}
					</div>
					<div class="flex-1">
						<p class="text-sm leading-relaxed">{highlight}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>