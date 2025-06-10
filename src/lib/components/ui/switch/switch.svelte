<script>
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	let className = undefined;
	export let checked = undefined;
	export { className as class };
</script>

<SwitchPrimitive.Root
	bind:checked
	class={cn(
		"peer inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer items-center rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
		"glass-switch-track relative overflow-hidden",
		"border border-white/30 shadow-inner",
		"data-[state=checked]:shadow-green-500/20 data-[state=unchecked]:shadow-gray-500/20",
		className
	)}
	{...$$restProps}
	on:click
	on:keydown
>
	<SwitchPrimitive.Thumb
		class={cn(
			"pointer-events-none block h-6 w-6 rounded-full ring-0 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
			"glass-switch-thumb relative z-10",
			"border border-white/40 shadow-lg",
			"data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0.5",
			"data-[state=checked]:scale-105 data-[state=unchecked]:scale-100"
		)}
	/>
</SwitchPrimitive.Root>
