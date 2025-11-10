<script lang="ts">
	import { cn } from '$lib/utils';
</script>

<div class={cn('min-h-screen bg-background text-foreground')}>
	<header class="border-b bg-card">
		<div class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-4">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold">Blog Admin</h1>
					<p class="text-sm text-muted-foreground">Localhost Only</p>
				</div>
				<nav class="flex gap-4">
					<a href="/blog" class="text-sm hover:text-primary transition-colors"> View Blog </a>
					<a href="/admin/blog/new" class="text-sm hover:text-primary transition-colors">
						New Post
					</a>
				</nav>
			</div>
		</div>
	</header>

	<main class="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
		<slot />
	</main>
</div>
