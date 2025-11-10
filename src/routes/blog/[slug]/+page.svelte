<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';
	import { marked } from 'marked';
	import DOMPurify from 'isomorphic-dompurify';
	import type { Post } from '$lib/types';

	export let data;

	const { post } = data;

	function formatDate(dateString: string | null): string {
		if (!dateString) return 'Draft';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getReadingTime(content: string): number {
		const wordsPerMinute = 200;
		const words = content.trim().split(/\s+/).length;
		return Math.ceil(words / wordsPerMinute);
	}

	marked.setOptions({
		breaks: true,
		gfm: true
	});

	const htmlContent = DOMPurify.sanitize(marked(post.content) as string);
</script>

<svelte:head>
	<title>{post.title} | Ismatulla Mansurov</title>
	<meta name="description" content={post.content.slice(0, 160)} />
	<meta property="og:title" content="{post.title} | Ismatulla Mansurov" />
	<meta property="og:description" content={post.content.slice(0, 160)} />
	<meta property="og:type" content="article" />
	{#if post.published_at}
		<meta property="article:published_time" content={post.published_at} />
	{/if}
	{#if post.edited_at}
		<meta property="article:modified_time" content={post.edited_at} />
	{/if}
</svelte:head>

<article
	class={cn(
		'flex flex-col min-h-[calc(100vh-48px)] bg-background text-foreground px-4 md:px-6 lg:px-8 max-w-full overflow-x-hidden'
	)}
	in:fade={{ duration: 300 }}
>
	<div class="max-w-4xl mx-auto w-full py-8 md:py-12">
		<!-- Back Button -->
		<a
			href="/blog"
			class="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
		>
			<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 19l-7-7 7-7"
				></path>
			</svg>
			Back to Blog
		</a>

		<!-- Article Header -->
		<header class="mb-8 md:mb-12 space-y-4">
			<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">{post.title}</h1>

			<div class="flex flex-wrap items-center gap-4 text-sm md:text-base text-muted-foreground">
				<time datetime={post.published_at || ''}>
					{formatDate(post.published_at)}
				</time>
				<span>•</span>
				<span>{getReadingTime(post.content)} min read</span>
				<span>•</span>
				<span>{post.view_count} views</span>
				{#if post.edited_at && post.edited_at !== post.published_at}
					<span>•</span>
					<span class="text-xs">Updated {formatDate(post.edited_at)}</span>
				{/if}
			</div>
		</header>

		<!-- Article Content -->
		<div
			class="prose prose-neutral dark:prose-invert prose-lg max-w-none
				prose-headings:font-bold prose-headings:tracking-tight
				prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4
				prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4
				prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3
				prose-p:leading-relaxed prose-p:mb-4
				prose-a:text-primary prose-a:no-underline hover:prose-a:underline
				prose-strong:font-semibold prose-strong:text-foreground
				prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
				prose-pre:bg-muted prose-pre:border prose-pre:border-border
				prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
				prose-ul:my-4 prose-ol:my-4
				prose-li:my-2
				prose-img:rounded-lg prose-img:shadow-lg"
		>
			{@html htmlContent}
		</div>

		<!-- Article Footer -->
		<footer class="mt-12 pt-8 border-t">
			<div class="flex items-center justify-between">
				<a
					href="/blog"
					class="inline-flex items-center text-primary hover:underline font-medium"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						></path>
					</svg>
					All Posts
				</a>

				<div class="text-sm text-muted-foreground">
					Published {formatDate(post.published_at)}
				</div>
			</div>
		</footer>
	</div>
</article>
