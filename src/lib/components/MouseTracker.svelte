<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let rafId: number;

	function updateMousePosition(e: MouseEvent) {
		// Find all glass-layers elements
		const elements = document.querySelectorAll('.glass-layers');
		
		elements.forEach((element) => {
			const rect = element.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 100;
			const y = ((e.clientY - rect.top) / rect.height) * 100;
			
			// Only update if mouse is near the element
			if (x >= -20 && x <= 120 && y >= -20 && y <= 120) {
				element.setAttribute('style', `--mouse-x: ${x}%; --mouse-y: ${y}%`);
			}
		});
	}

	function handleMouseMove(e: MouseEvent) {
		if (rafId) cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(() => updateMousePosition(e));
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('mousemove', handleMouseMove);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousemove', handleMouseMove);
			if (rafId) cancelAnimationFrame(rafId);
		}
	});
</script>