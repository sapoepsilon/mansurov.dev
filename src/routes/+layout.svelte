<script lang="ts">
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    
    let scrollY = 0;
    let rafId: number;
    
    onMount(() => {
        if (browser && typeof document !== 'undefined') {
            // Parallax effect
            const handleScroll = () => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    scrollY = window.scrollY;
                });
            };
            
            window.addEventListener('scroll', handleScroll);
            
            return () => {
                window.removeEventListener('scroll', handleScroll);
                if (rafId) cancelAnimationFrame(rafId);
            };
        }
    });
</script>

<div class="min-h-screen relative">
    <!-- Static background - always visible -->
    <div 
        class="fixed inset-0 bg-background" 
        style="z-index: -1;">
    </div>
    
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
