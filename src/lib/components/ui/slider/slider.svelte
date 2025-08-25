<script lang="ts">
	import { Slider as SliderPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type $$Props = SliderPrimitive.Props;

	export let value: $$Props["value"] = [0];
	export let min: $$Props["min"] = 0;
	export let max: $$Props["max"] = 100;
	export let step: $$Props["step"] = 1;
	export let disabled: $$Props["disabled"] = false;
	export let orientation: $$Props["orientation"] = "horizontal";

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<SliderPrimitive.Root
	bind:value
	{min}
	{max}
	{step}
	{disabled}
	{orientation}
	class={cn(
		"relative flex w-full touch-none select-none items-center",
		className
	)}
	{...$$restProps}
>
	<SliderPrimitive.Track
		class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
	>
		<SliderPrimitive.Range class="absolute h-full bg-primary" />
	</SliderPrimitive.Track>
	<SliderPrimitive.Thumb
		class="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
	/>
</SliderPrimitive.Root>