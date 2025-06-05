<script lang="ts">
	export let features: Array<{
		title: string;
		description: string;
		icon?: string;
	}>;
	
	// Default icons for features if none provided
	const defaultIcons = [
		'🚀', '⚡', '🎯', '🛡️', '📱', '🎨', '🔧', '📊'
	];
</script>

<section class="space-y-8">
	<div class="text-center space-y-2">
		<h2 class="text-3xl font-semibold">Key Features</h2>
		<p class="text-muted-foreground">What makes this project special</p>
	</div>
	
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each features as feature, index}
			<div class="group p-6 rounded-xl border bg-card hover:shadow-md transition-all duration-200">
				<div class="space-y-3">
					<div class="flex items-center gap-3">
						<div class="text-2xl">
							{feature.icon || defaultIcons[index % defaultIcons.length]}
						</div>
						<h3 class="text-lg font-semibold group-hover:text-primary transition-colors">
							{feature.title}
						</h3>
					</div>
					<p class="text-muted-foreground text-sm leading-relaxed">
						{feature.description}
					</p>
				</div>
			</div>
		{/each}
	</div>
</section>