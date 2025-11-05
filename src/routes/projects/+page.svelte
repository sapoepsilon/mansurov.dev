<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';

	export let data;
	
	const { projects } = data;
</script>

<svelte:head>
	<title>Projects | Ismatulla Mansurov</title>
	<meta name="description" content="Portfolio of projects by Ismatulla Mansurov - Full Stack Developer" />
</svelte:head>

<section
	class={cn("flex flex-col min-h-[calc(100vh-48px)] bg-background text-foreground px-4 md:px-6 lg:px-8 max-w-full overflow-x-hidden")}
	in:fade={{ duration: 300 }}
>
	<div class="max-w-6xl mx-auto w-full py-8">
		<div class="text-center space-y-4 mb-12">
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight">Projects</h1>
			<p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
				A showcase of my work in software development, featuring innovative solutions and technical achievements
			</p>
		</div>
		
		{#if projects && projects.length > 0}
			<div class="grid gap-8 md:gap-12">
				{#each projects as project}
					<article class="group">
						<a 
							href="/projects/{project.slug}" 
							class="block p-6 md:p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group-hover:border-primary/20"
						>
							<div class="grid md:grid-cols-2 gap-6 items-center">
								<!-- Project Info -->
								<div class="space-y-4">
									<div class="space-y-2">
										<h2 class="text-2xl md:text-3xl font-semibold group-hover:text-primary transition-colors">
											{project.title}
										</h2>
										<p class="text-lg text-muted-foreground">
											{project.subtitle}
										</p>
									</div>
									
									<p class="text-muted-foreground leading-relaxed line-clamp-3">
										{project.description}
									</p>
									
									<!-- Tech Stack -->
									<div class="flex flex-wrap gap-2">
										{#each project.tech_stack.slice(0, 4) as tech}
											<span class="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
												{tech}
											</span>
										{/each}
										{#if project.tech_stack.length > 4}
											<span class="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
												+{project.tech_stack.length - 4} more
											</span>
										{/if}
									</div>
								</div>
								
								<!-- Project Image -->
								{#if project.hero_image}
									<div class="rounded-lg overflow-hidden shadow-md max-h-[300px] bg-muted/50 flex items-center justify-center">
										<img 
											src={project.hero_image} 
											alt={project.title}
											class="w-full max-h-[300px] object-contain group-hover:scale-105 transition-transform duration-300"
										/>
									</div>
								{/if}
							</div>
						</a>
					</article>
				{/each}
			</div>
		{:else}
			<div class="text-center py-16">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
					<svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
					</svg>
				</div>
				<h2 class="text-2xl font-semibold mb-2">No Projects Yet</h2>
				<p class="text-muted-foreground">Projects will be showcased here soon.</p>
			</div>
		{/if}
	</div>
</section>