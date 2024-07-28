<script lang="ts">
	import { cn } from "$lib/utils";
	import BlogCard from "$lib/components/BlogCard.svelte";
	import { slide, fade } from 'svelte/transition';
	import { Skeleton } from "$lib/components/ui/skeleton";
	import BlogCardSkeleton from "@/components/BlogCardSkeleton.svelte";
	import { onMount, tick } from 'svelte';

	export let blogPosts: Array<{
		id: string;
		title: string;
		content: string;
		image_url: string;
		created_at: string;
	}>;

	let isLoading = true;
	let mounted = false;

	onMount(async () => {
		// Simulating loading delay
		await new Promise(resolve => setTimeout(resolve, 2000));
		isLoading = false;
		await tick();
		mounted = true;
	});
</script>

<section
		class={cn("flex flex-col items-start justify-start min-h-[calc(100vh-48px)] bg-background text-foreground p-4 md:p-8")}
		in:fade="{{ duration: 300 }}"
>
	<div class="lg:ml-36 md:ml-24">
		<h1 class="text-4xl md:text-6xl font-bold mb-2">Blog</h1>
		<p class="text-xl md:text-2xl text-muted-foreground mb-8">My thoughts</p>
	</div>
	<div class="w-full max-w-2xl mx-auto space-y-4">
		{#if isLoading}
			{#each Array(3) as _, i}
				<div in:slide="{{ duration: 300, delay: i * 100 }}">
					<BlogCardSkeleton />
				</div>
			{/each}
		{:else if mounted}
			{#each blogPosts as post, i (post.id)}
				<div in:slide="{{ duration: 300, delay: i * 100 }}">
					<BlogCard
							id={post.id}
							title={post.title}
							body={post.content}
							imageUrl={post.image_url || 'https://picsum.photos/536/354'}
					/>
				</div>
			{/each}
		{/if}
	</div>
</section>
