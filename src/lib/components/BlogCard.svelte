<script lang="ts">
	import * as Card from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";

	export let id;
	export let title;
	export let body;
	export let imageUrl;

	function truncateText(text, lines = 2) {
		const words = text.split(' ');
		const truncated = words.slice(0, lines * 10).join(' ');
		return truncated + (words.length > lines * 10 ? '...' : '');
	}
</script>

<a href="/blog/{id}" class="block w-full max-w-2xl mx-auto">
<Card.Root class="flex flex-col sm:flex-row md:flex-row bg-card text-card-foreground lg:w-4/5 md:w-4/5">
	<div class="w-full sm:w-1/4 aspect-video sm:aspect-square overflow-hidden">
		<img src={imageUrl} alt="" class="w-full h-full object-cover" />
	</div>
	<div class="flex-1 p-4 flex flex-col justify-between">
		<div>
			<Card.Title class="text-xl font-bold mb-2">{title}</Card.Title>
			<Card.Description class="text-muted-foreground">
				{truncateText(body, 2)}
			</Card.Description>
		</div>
		<Card.Footer class="pt-4">
			<Button variant="outline" class="w-24">Read</Button>
		</Card.Footer>
	</div>
</Card.Root>
</a>
