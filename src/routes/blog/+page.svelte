<script lang="ts">
    import Blog from '$lib/components/routes/Blog.svelte';
    /** @type {import('./$types').PageData} */

    export let data;
</script>

<Blog blogPosts={data.blogPosts} />
