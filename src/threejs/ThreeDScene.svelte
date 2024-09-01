<script lang="ts">
    import { onMount } from 'svelte';
    import { createScene } from '$lib/scene';

    let canvas: HTMLCanvasElement;

    onMount(() => {
        createScene(canvas);
    });
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full -z-10" />
