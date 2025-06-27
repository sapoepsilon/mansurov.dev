<script lang="ts">
	import LiquidGlass from '$lib/components/LiquidGlass.svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { ChevronDown, Settings, Palette, Move, RotateCcw } from 'lucide-svelte';

	let glassContainer: HTMLElement;
	let isDragging = false;
	let mouseX = 0;
	let mouseY = 0;
	let glassX = 400; // Initial center position
	let glassY = 300;
	
	// Glass properties
	let thickness = 20;
	let refractionIndex = 1.52;
	let cornerRadius = 64;
	let dispersionStrength = 0.02;
	let blurRadius = 6;
	let enabled = true;
	
	// Background selection
	let selectedBackground = 'animated';
	
	const backgrounds = [
		{ id: 'animated', name: 'Animated Blobs', class: 'bg-animated-blobs' },
		{ id: 'gradient', name: 'Gradient Mesh', class: 'bg-gradient-mesh' },
		{ id: 'geometric', name: 'Geometric Pattern', class: 'bg-geometric' },
		{ id: 'photo', name: 'Photo Texture', class: 'bg-photo-texture' },
		{ id: 'minimal', name: 'Minimal', class: 'bg-minimal' }
	];

	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		const rect = glassContainer.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;
		const rect = glassContainer.getBoundingClientRect();
		glassX = event.clientX - rect.left;
		glassY = event.clientY - rect.top;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function resetGlassPosition() {
		glassX = 400;
		glassY = 300;
	}

	function resetProperties() {
		thickness = 20;
		refractionIndex = 1.52;
		cornerRadius = 64;
		dispersionStrength = 0.02;
		blurRadius = 6;
	}

	// Update the glass component with mouse position
	$: mousePos = [glassX, glassY];
</script>

<svelte:head>
	<title>Interactive Liquid Glass - Enhanced Optics Demo</title>
</svelte:head>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

<section class="min-h-screen flex flex-col items-center justify-center text-foreground relative overflow-hidden">
	<!-- Animated background elements matching Hero style -->
	<div class="absolute inset-0 -z-10">
		{#if selectedBackground === 'animated'}
			<div class="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
			<div class="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
			<div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
		{:else if selectedBackground === 'gradient'}
			<div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900"></div>
		{:else if selectedBackground === 'geometric'}
			<div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 25% 25%, #8B5CF6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #EC4899 0%, transparent 50%), radial-gradient(circle at 50% 50%, #3B82F6 0%, transparent 50%);"></div>
		{:else if selectedBackground === 'photo'}
			<div class="absolute inset-0 bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 dark:from-emerald-900 dark:via-blue-900 dark:to-purple-900">
				<div class="absolute inset-0 opacity-30" style="background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px);"></div>
			</div>
		{:else}
			<div class="absolute inset-0 bg-background"></div>
		{/if}
	</div>
	
	<div class="text-center p-4 glass-card glass-layers backdrop-blur-xl px-8 py-12 md:px-16 md:py-20 max-w-6xl mx-4 liquid-morph">
		<h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
			Interactive Liquid Glass
		</h1>
		<p class="text-xl md:text-2xl text-muted-foreground mb-12">
			WebGPU-powered realistic glass simulation with physics-based optics
		</p>
		
		<!-- Main Glass Demo Area -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
			<!-- Glass Display -->
			<div class="lg:col-span-2 space-y-4">
				<Card class="glass-card glass-layers liquid-morph">
					<CardHeader class="text-left">
						<CardTitle class="flex items-center gap-2">
							<Move class="h-5 w-5" />
							Interactive Glass Surface
							<span class="text-sm font-normal text-muted-foreground ml-auto">
								Click and drag to move
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div 
							bind:this={glassContainer}
							class="relative w-full h-[500px] overflow-hidden rounded-lg cursor-crosshair"
							on:mousedown={handleMouseDown}
							role="button"
							tabindex="0"
							on:keydown={(e) => e.key === 'Enter' && handleMouseDown(e)}
						>
							<!-- Background content that will be refracted -->
							<div class="absolute inset-0">
								<div class="grid grid-cols-4 gap-4 p-6 h-full">
									{#each Array(16) as _, i}
										<div class="aspect-square rounded-lg bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 opacity-60 animate-pulse" style="animation-delay: {i * 0.1}s"></div>
									{/each}
								</div>
								<div class="absolute top-1/4 left-1/4 text-4xl font-bold text-white/50">GLASS</div>
								<div class="absolute bottom-1/4 right-1/4 text-2xl text-blue-500/50">REFRACTION</div>
							</div>
							
							<!-- Liquid Glass Component -->
							<div class="absolute" style="left: {glassX - 200}px; top: {glassY - 150}px;">
								<LiquidGlass
									width={400}
									height={300}
									{thickness}
									{refractionIndex}
									{dispersionStrength}
									fresnelPower={3.0}
									{blurRadius}
									{cornerRadius}
									tintColor={[1.0, 1.0, 1.0, 0.95]}
									backgroundColor={[0.0, 0.0, 0.0, 0.0]}
									mousePosition={mousePos}
									{enabled}
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Controls Panel -->
			<div class="space-y-4">
				<Card class="glass-card glass-layers liquid-morph">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<Settings class="h-5 w-5" />
							Glass Properties
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-6">
						<div class="space-y-2">
							<label class="text-sm font-medium flex justify-between">
								Thickness 
								<span class="text-muted-foreground">{thickness}px</span>
							</label>
							<input 
								type="range" 
								bind:value={thickness} 
								min="5" 
								max="50" 
								step="1"
								class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
							/>
						</div>

						<div class="space-y-2">
							<label class="text-sm font-medium flex justify-between">
								Refraction Index 
								<span class="text-muted-foreground">{refractionIndex.toFixed(2)}</span>
							</label>
							<input 
								type="range" 
								bind:value={refractionIndex} 
								min="1.1" 
								max="2.0" 
								step="0.01"
								class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
							/>
						</div>

						<div class="space-y-2">
							<label class="text-sm font-medium flex justify-between">
								Chromatic Dispersion 
								<span class="text-muted-foreground">{dispersionStrength.toFixed(3)}</span>
							</label>
							<input 
								type="range" 
								bind:value={dispersionStrength} 
								min="0.0" 
								max="0.1" 
								step="0.001"
								class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
							/>
						</div>

						<div class="space-y-2">
							<label class="text-sm font-medium flex justify-between">
								Blur Radius 
								<span class="text-muted-foreground">{blurRadius.toFixed(1)}px</span>
							</label>
							<input 
								type="range" 
								bind:value={blurRadius} 
								min="0" 
								max="20" 
								step="0.5"
								class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
							/>
						</div>

						<div class="space-y-2">
							<label class="text-sm font-medium flex justify-between">
								Corner Radius 
								<span class="text-muted-foreground">{cornerRadius}px</span>
							</label>
							<input 
								type="range" 
								bind:value={cornerRadius} 
								min="0" 
								max="100" 
								step="1"
								class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
							/>
						</div>

						<div class="flex gap-2">
							<Button 
								variant="outline" 
								size="sm"
								on:click={() => enabled = !enabled}
								class="glass-button glass-refract flex-1"
							>
								{enabled ? 'Pause' : 'Resume'}
							</Button>
							<Button 
								variant="outline" 
								size="sm"
								on:click={resetProperties}
								class="glass-button glass-refract"
							>
								<RotateCcw class="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>

				<!-- Background Options -->
				<Card class="glass-card glass-layers liquid-morph">
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<Palette class="h-5 w-5" />
							Background
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-3">
						{#each backgrounds as bg}
							<Button
								variant={selectedBackground === bg.id ? "default" : "outline"}
								size="sm"
								class="w-full glass-button glass-refract justify-start"
								on:click={() => selectedBackground = bg.id}
							>
								{bg.name}
							</Button>
						{/each}
						
						<Button 
							variant="outline" 
							size="sm"
							on:click={resetGlassPosition}
							class="w-full glass-button glass-refract"
						>
							<Move class="mr-2 h-4 w-4" />
							Center Glass
						</Button>
					</CardContent>
				</Card>

				<!-- Presets -->
				<Card class="glass-card glass-layers liquid-morph">
					<CardHeader>
						<CardTitle>Material Presets</CardTitle>
					</CardHeader>
					<CardContent class="grid grid-cols-1 gap-2">
						<Button 
							variant="outline" 
							size="sm"
							class="glass-button glass-refract text-left"
							on:click={() => {
								thickness = 15;
								refractionIndex = 1.33;
								cornerRadius = 20;
								dispersionStrength = 0.008;
								blurRadius = 3;
							}}
						>
							💧 Water
						</Button>
						
						<Button 
							variant="outline" 
							size="sm"
							class="glass-button glass-refract text-left"
							on:click={() => {
								thickness = 25;
								refractionIndex = 1.52;
								cornerRadius = 32;
								dispersionStrength = 0.02;
								blurRadius = 6;
							}}
						>
							🪟 Window Glass
						</Button>
						
						<Button 
							variant="outline" 
							size="sm"
							class="glass-button glass-refract text-left"
							on:click={() => {
								thickness = 35;
								refractionIndex = 1.76;
								cornerRadius = 40;
								dispersionStrength = 0.045;
								blurRadius = 12;
							}}
						>
							💎 Crystal
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>

		<!-- Technical Info -->
		<Card class="glass-card glass-layers liquid-morph text-left">
			<CardHeader>
				<CardTitle>Physics-Based Glass Simulation</CardTitle>
			</CardHeader>
			<CardContent class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div>
					<h3 class="font-semibold mb-2">✨ Ray Tracing</h3>
					<p class="text-sm text-muted-foreground">
						Uses signed distance fields and proper ray-surface intersection for realistic light paths through the glass.
					</p>
				</div>
				<div>
					<h3 class="font-semibold mb-2">🔍 Content Warping</h3>
					<p class="text-sm text-muted-foreground">
						Background content is properly refracted and displaced based on glass thickness and refractive index.
					</p>
				</div>
				<div>
					<h3 class="font-semibold mb-2">⚡ WebGPU Powered</h3>
					<p class="text-sm text-muted-foreground">
						Hardware-accelerated shaders running at 60fps with efficient GPU resource management.
					</p>
				</div>
			</CardContent>
		</Card>
	</div>
</section>

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: hsl(var(--primary));
		cursor: pointer;
		border: 2px solid hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}

	.slider::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: hsl(var(--primary));
		cursor: pointer;
		border: 2px solid hsl(var(--background));
		box-shadow: 0 0 0 1px hsl(var(--border));
	}
</style>