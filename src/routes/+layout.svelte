<script lang="ts">
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import MouseTracker from '$lib/components/MouseTracker.svelte';
    // import WebGPUReflection from '$lib/components/WebGPUReflection.svelte';
    // import LiquidBlob from '$lib/components/LiquidBlob.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    
    let scrollY = 0;
    let rafId: number;
    
    // Force dark mode permanently
    onMount(() => {
        if (browser && typeof document !== 'undefined') {
            document.documentElement.classList.add('dark');
            
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
    <MouseTracker />
    <!-- Static background - always visible -->
    <div 
        class="fixed inset-0 bg-cover bg-center" 
        style="background-image: url('/abstract-green-grunge-background.jpg'); 
               opacity: 1.0;
               filter: blur(0.5px);
               z-index: -1;">
    </div>
    
    <!-- Liquid glass overlay gradient -->
    <div class="fixed inset-0 pointer-events-none" 
         style="background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%);">
    </div>
    
    <!-- Animated liquid blobs for fluid effect -->
    <!-- {#if browser}
        <div class="fixed inset-0 pointer-events-none overflow-hidden">
            <LiquidBlob color="rgba(144, 238, 144, 0.15)" size={600} duration={25} delay={0} />
            <LiquidBlob color="rgba(173, 216, 230, 0.15)" size={500} duration={20} delay={5} />
            <LiquidBlob color="rgba(255, 182, 193, 0.1)" size={400} duration={30} delay={10} />
        </div>
    {/if} -->
    
    <!-- WebGPU Reflections Layer - Conditionally rendered -->
    <!-- {#if typeof window !== 'undefined' && navigator.gpu}
        <div class="fixed inset-0 pointer-events-none z-5">
            <WebGPUReflection intensity={0.2} roughness={0.15} metallic={0.7} />
        </div>
    {/if} -->
    
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
