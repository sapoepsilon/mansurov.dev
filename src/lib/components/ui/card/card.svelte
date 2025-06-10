<script>
	import { cn } from "$lib/utils.js";
	import GlassGlare from "$lib/components/GlassGlare.svelte";
	let className = undefined;
	export { className as class };
</script>

<div
	class={cn("rounded-lg glass-card glass-layers text-card-foreground liquid-morph relative", className)}
	{...$$restProps}
>
	<GlassGlare corner="top-left" intensity={0.6} size={100} />
	<GlassGlare corner="bottom-right" intensity={0.4} size={80} />
	<slot />
</div>
