<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';
	import type { Post } from '$lib/types';

	export let data;

	const { posts, error } = data;

	function formatDate(dateString: string | null): string {
		if (!dateString) return 'Draft';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getExcerpt(content: string, maxLength: number = 150): string {
		const plainText = content.replace(/[#*`_\[\]]/g, '').trim();
		if (plainText.length <= maxLength) return plainText;
		return plainText.slice(0, maxLength).trim() + '...';
	}

	function getReadingTime(content: string): number {
		const wordsPerMinute = 200;
		const words = content.trim().split(/\s+/).length;
		return Math.ceil(words / wordsPerMinute);
	}
</script>

<svelte:head>
	<title>Blog | Ismatulla Mansurov</title>
	<meta
		name="description"
		content="Technical articles and insights by Ismatulla Mansurov - Full Stack Developer"
	/>
</svelte:head>

<section
	class={cn(
		'flex flex-col min-h-[calc(100vh-48px)] bg-background text-foreground px-4 md:px-6 lg:px-8 max-w-full overflow-x-hidden'
	)}
	in:fade={{ duration: 300 }}
>
	<div class="max-w-6xl mx-auto w-full py-8">
		<div class="text-center space-y-4 mb-12">
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight">Blog</h1>
			<p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
				Technical articles, insights, and learnings from my journey in software development
			</p>
		</div>

		{#if error}
			<div class="text-center py-16">
				<div
					class="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center"
				>
					<svg
						class="w-8 h-8 text-destructive"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-semibold mb-2">Unable to Load Posts</h2>
				<p class="text-muted-foreground">{error}</p>
			</div>
		{:else if posts && posts.length > 0}
			<div class="grid gap-6 md:gap-8">
				{#each posts as post}
					<article class="group">
						<a
							href="/blog/{post.slug}"
							class="block p-6 md:p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group-hover:border-primary/20"
						>
							<div class="space-y-4">
								<div class="space-y-2">
									<h2
										class="text-2xl md:text-3xl font-semibold group-hover:text-primary transition-colors"
									>
										{post.title}
									</h2>

									<div class="flex items-center gap-4 text-sm text-muted-foreground">
										<time datetime={post.published_at || ''}>
											{formatDate(post.published_at)}
										</time>
										<span>•</span>
										<span>{getReadingTime(post.content)} min read</span>
										<span>•</span>
										<span>{post.view_count} views</span>
									</div>
								</div>

								<p class="text-muted-foreground leading-relaxed">
									{getExcerpt(post.content)}
								</p>

								<div class="flex items-center text-primary font-medium">
									<span>Read more</span>
									<svg
										class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										></path>
									</svg>
								</div>
							</div>
						</a>
					</article>
				{/each}
			</div>
		{:else}
			<div class="text-center py-16">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
					<svg
						class="w-8 h-8 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-semibold mb-2">No Posts Yet</h2>
				<p class="text-muted-foreground">Blog posts will appear here soon.</p>
			</div>
		{/if}
	</div>
</section>
