<script lang="ts">
    import BlogForm from './blog-form.svelte';
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div class="container mx-auto px-4 py-16 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-center">Create a Blog Post</h1>
    <BlogForm data={data.form} />
</div>
