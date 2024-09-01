<script>
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import { page } from '$app/stores';
</script>

<Navbar />

{#key $page.url.pathname}
    <main>
        <div>
            <slot></slot>
        </div>
    </main>
{/key}
