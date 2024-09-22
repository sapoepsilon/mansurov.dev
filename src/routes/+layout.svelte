<script>
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import { page } from '$app/stores';
</script>

<div class="min-h-screen bg-gradient-noise relative">
    <div class="absolute inset-0 bg-noise pointer-events-none"></div>
    <div class="relative z-10">
        <Navbar />

        {#key $page.url.pathname}
            <main>
                <div>
                    <slot></slot>
                </div>
            </main>
        {/key}
    </div>
</div>
