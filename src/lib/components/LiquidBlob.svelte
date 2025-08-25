<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  export let color = 'rgba(144, 238, 144, 0.1)';
  export let size = 400;
  export let duration = 20;
  export let delay = 0;
  
  let blobElement: HTMLDivElement;
  let x = 0;
  let y = 0;
  
  onMount(() => {
    if (browser && blobElement) {
      // Random starting position
      x = Math.random() * (window.innerWidth - size);
      y = Math.random() * (window.innerHeight - size);
      
      // Animate blob movement
      const animateBlob = () => {
        const keyframes = [
          { transform: `translate(${x}px, ${y}px) scale(1) rotate(0deg)` },
          { transform: `translate(${x + 100}px, ${y - 150}px) scale(1.2) rotate(120deg)` },
          { transform: `translate(${x - 150}px, ${y - 100}px) scale(0.9) rotate(240deg)` },
          { transform: `translate(${x}px, ${y}px) scale(1) rotate(360deg)` }
        ];
        
        blobElement.animate(keyframes, {
          duration: duration * 1000,
          iterations: Infinity,
          easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
          delay: delay * 1000
        });
      };
      
      animateBlob();
    }
  });
</script>

<div 
  bind:this={blobElement}
  class="absolute pointer-events-none liquid-shape"
  style="
    width: {size}px;
    height: {size}px;
    background: {color};
    filter: blur(40px);
    opacity: 0.7;
    will-change: transform;
  "
/>

<style>
  .liquid-shape {
    mix-blend-mode: screen;
  }
</style>
</script>