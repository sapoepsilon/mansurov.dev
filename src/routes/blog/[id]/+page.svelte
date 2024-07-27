<script lang="ts">
    import { formatDate } from '$lib/utils'; // You'll need to create this utility function
    /** @type {import('./$types').PageData} */

    export let data;
</script>

<article class="container mx-auto px-4 py-16 max-w-3xl">
    <h1 class="text-4xl font-bold mb-4">{data.post.title}</h1>
    <p class="text-sm text-gray-500 mb-8">
        Published on {formatDate(data.post.created_at)}
    </p>
    {#if data.post.image_url}
        <img
                src={data.post.image_url}
                alt={data.post.title}
                class="w-full h-64 object-cover rounded-lg mb-8"
        />
    {/if}
    <div class="prose max-w-none">
        {@html data.post.content}
    </div>
</article>
