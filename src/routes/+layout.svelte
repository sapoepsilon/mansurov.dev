<script>
    import '../app.css';
    import Navbar from '$lib/components/Navbar.svelte';
    import MouseTracker from '$lib/components/MouseTracker.svelte';
    import WebGPUReflection from '$lib/components/WebGPUReflection.svelte';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    // Force dark mode permanently
    onMount(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.add('dark');
        }
    });
</script>

<div class="min-h-screen relative">
    <MouseTracker />
    <!-- Dynamic background with glass-enhancing texture -->
    <div class="absolute inset-0 bg-cover bg-center bg-fixed" style="background-image: url('/abstract-green-grunge-background.jpg')"></div>
    
    <!-- WebGPU Reflections Layer -->
    <div class="absolute inset-0 pointer-events-none z-5">
        <WebGPUReflection intensity={0.3} roughness={0.1} metallic={0.8} />
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
