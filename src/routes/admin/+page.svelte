<script lang="ts">
    import AdminForm from './admin-form.svelte';
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<div class="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center">
    <div class="w-full max-w-md">
        <h1 class="text-3xl font-bold mb-6 text-center">Admin Login</h1>
        <div class="bg-card text-card-foreground rounded-lg p-6 shadow-black dark:shadow-white]">
            <AdminForm data={data.form} />
        </div>
    </div>
</div>
