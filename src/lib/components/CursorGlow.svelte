<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { spring } from 'svelte/motion';

	let mouseX = spring(0, { stiffness: 0.1, damping: 0.25 });
	let mouseY = spring(0, { stiffness: 0.1, damping: 0.25 });
	let isVisible = false;

	function handleMouseMove(e: MouseEvent) {
		$mouseX = e.clientX;
		$mouseY = e.clientY;
		isVisible = true;
	}

	function handleMouseLeave() {
		isVisible = false;
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseleave', handleMouseLeave);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseleave', handleMouseLeave);
		}
	});
</script>

{#if typeof window !== 'undefined'}
<div 
	class="cursor-glow"
	style="
		--mouse-x: {$mouseX}px;
		--mouse-y: {$mouseY}px;
		opacity: {isVisible ? 1 : 0};
	"
/>
{/if}

<style>
	.cursor-glow {
		position: fixed;
		width: 400px;
		height: 400px;
		left: calc(var(--mouse-x) - 200px);
		top: calc(var(--mouse-y) - 200px);
		pointer-events: none;
		z-index: 9999;
		transition: opacity 0.3s ease;
		mix-blend-mode: overlay;
	}

	.cursor-glow::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at center,
			rgba(255, 255, 255, 0.15) 0%,
			rgba(168, 255, 168, 0.1) 30%,
			transparent 60%
		);
		filter: blur(80px);
	}

	:global(.dark) .cursor-glow::before {
		background: radial-gradient(
			circle at center,
			rgba(255, 255, 255, 0.12) 0%,
			rgba(144, 238, 144, 0.08) 30%,
			transparent 60%
		);
	}
</style>