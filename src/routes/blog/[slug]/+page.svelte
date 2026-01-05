<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';
	import { marked } from 'marked';
	import DOMPurify from 'isomorphic-dompurify';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Post } from '$lib/types';

	export let data;

	const { post } = data;

	let isLocalhost = false;
	$: if (browser) {
		isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	}

	onMount(() => {
		const preBlocks = document.querySelectorAll('pre');
		preBlocks.forEach((pre) => {
			const wrapper = document.createElement('div');
			wrapper.className = 'relative group';

			pre.parentNode?.insertBefore(wrapper, pre);
			wrapper.appendChild(pre);

			const copyButton = document.createElement('button');
			copyButton.className = 'absolute top-3 right-3 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-xs font-medium transition-colors opacity-0 group-hover:opacity-100';
			copyButton.textContent = 'Copy';

			copyButton.addEventListener('click', async () => {
				const code = pre.querySelector('code')?.textContent || pre.textContent || '';
				await navigator.clipboard.writeText(code);
				copyButton.textContent = 'Copied!';
				setTimeout(() => {
					copyButton.textContent = 'Copy';
				}, 2000);
			});

			wrapper.appendChild(copyButton);
		});
	});

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

	const renderer = {
		heading({ tokens, depth }: { tokens: any[]; depth: number }) {
			const text = this.parser.parseInline(tokens);
			return `<h${depth} class="font-bold tracking-tight ${depth === 1 ? 'text-4xl mt-8 mb-4' : depth === 2 ? 'text-3xl mt-8 mb-4' : 'text-2xl mt-6 mb-3'}">${text}</h${depth}>`;
		},
		code({ text, lang }: { text: string; lang?: string }) {
			return `<pre class="bg-zinc-800 dark:bg-zinc-900 text-zinc-100 border border-zinc-700 dark:border-zinc-800 shadow-lg my-8 p-6 rounded-lg overflow-x-auto"><code class="bg-transparent text-zinc-100 font-mono text-sm leading-relaxed">${text}</code></pre>`;
		},
		blockquote({ tokens }: { tokens: any[] }) {
			const text = this.parser.parse(tokens);
			return `<blockquote class="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20 py-4 px-6 rounded-r my-6 text-slate-700 dark:text-slate-300">${text}</blockquote>`;
		},
		link({ href, title, tokens }: { href: string; title?: string; tokens: any[] }) {
			const text = this.parser.parseInline(tokens);
			const titleAttr = title ? ` title="${title}"` : '';
			return `<a href="${href}"${titleAttr} class="text-blue-600 dark:text-blue-400 no-underline hover:underline">${text}</a>`;
		},
		codespan({ text }: { text: string }) {
			return `<code class="text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded font-mono text-sm">${text}</code>`;
		}
	};

	marked.use({
		breaks: true,
		gfm: true,
		headerIds: true,
		mangle: false,
		pedantic: false,
		renderer
	});

	const processedContent = post.content.replace(/\n{3,}/g, (match) => {
		const extraBreaks = match.length - 2;
		return '\n\n' + '<br/>\n\n'.repeat(extraBreaks);
	});

	const htmlContent = DOMPurify.sanitize(marked.parse(processedContent) as string);
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
			<div class="flex items-start justify-between gap-4">
				<h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">{post.title}</h1>
				{#if isLocalhost}
					<a
						href="/admin/blog/edit/{post.slug}"
						class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
					>
						Edit
					</a>
				{/if}
			</div>

			<div class="flex flex-wrap items-center gap-4 text-sm md:text-base text-muted-foreground">
				<time datetime={post.published_at || ''}>
					{formatDate(post.published_at)}
				</time>
				<span>•</span>
				<span>{getReadingTime(post.content)} min read</span>
				<span>•</span>
				<span>{post.view_count ?? 0} views</span>
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
				prose-p:leading-relaxed prose-p:mb-6 prose-p:mt-0
				prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
				prose-strong:font-semibold prose-strong:text-foreground
				prose-ul:my-6 prose-ol:my-6
				prose-li:my-2
				prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8"
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
