<script>
    import Hero from '$lib/components/Hero.svelte';
    import { Canvas } from "@threlte/core";
    import Scene from "../../../routes/about/Scene.svelte";
</script>

<Hero />
<div class="relative h-[300vh]">
    <div class="sticky top-0 h-screen overflow-hidden">
        <Canvas>
            <Scene />
        </Canvas>
    </div>

    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div class="h-screen flex items-center justify-center">
            <h1 class="text-4xl font-bold text-foreground dark:text-foreground">About Me</h1>
        </div>
        <div class="h-screen flex items-center justify-start pl-8">
            <p class="text-xl text-foreground dark:text-foreground max-w-md">I'm a passionate developer with a love for creating beautiful and functional web experiences.</p>
        </div>
        <div class="h-screen flex items-center justify-end pr-8">
            <p class="text-xl text-foreground dark:text-foreground max-w-md">My skills range from front-end development to 3D modeling, always pushing the boundaries of what's possible on the web.</p>
        </div>
    </div>
</div>
