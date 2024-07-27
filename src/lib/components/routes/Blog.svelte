<script lang="ts">
	import { cn } from "$lib/utils";
	import BlogCard from "$lib/components/BlogCard.svelte";

	export let blogPosts: Array<{
		id: string;
		title: string;
		content: string;
		image_url: string;
		created_at: string;
	}>;
</script>

<section class={cn("flex flex-col items-start justify-start min-h-[calc(100vh-48px)] bg-background text-foreground p-4 md:p-8")}>
	<div class="lg:ml-36 md:ml-24">
		<h1 class="text-4xl md:text-6xl font-bold mb-2">Blog</h1>
		<p class="text-xl md:text-2xl text-muted-foreground mb-8">My thoughts</p>
	</div>
	<div class="w-full space-y-4 flex flex-col items-center">
		{#each blogPosts as post (post.id)}
			<BlogCard
					id={post.id}
					title={post.title}
					body={post.content}
					imageUrl={post.image_url || 'https://picsum.photos/536/354'}
			/>
		{/each}
	</div>
</section>
