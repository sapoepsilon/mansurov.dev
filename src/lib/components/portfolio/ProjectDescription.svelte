<script lang="ts">
	export let problem: string;
	export let solution: string;
	export let description: string;
</script>

<section class="space-y-8">
	<div class="grid md:grid-cols-2 gap-8">
		<!-- Problem -->
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
					<svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
					</svg>
				</div>
				<h2 class="text-2xl font-semibold">The Problem</h2>
			</div>
			<p class="text-muted-foreground leading-relaxed">{problem}</p>
		</div>
		
		<!-- Solution -->
		<div class="space-y-4">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
					<svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				<h2 class="text-2xl font-semibold">The Solution</h2>
			</div>
			<p class="text-muted-foreground leading-relaxed">{solution}</p>
		</div>
	</div>
	
	<!-- Description -->
	<div class="space-y-4">
		<h2 class="text-2xl font-semibold">About This Project</h2>
		<div class="prose prose-lg dark:prose-invert max-w-none">
			<p class="text-muted-foreground leading-relaxed">{description}</p>
		</div>
	</div>
</section>