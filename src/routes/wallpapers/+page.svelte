<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/utils.js';
	import DeviceFrame from '$lib/components/DeviceFrame.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let data;
	
	const { wallpapers } = data;
	let isMobile = false;

	onMount(() => {
		if (browser) {
			const checkDevice = () => {
				isMobile = window.innerWidth < 768;
			};
			checkDevice();
			window.addEventListener('resize', checkDevice);
			return () => window.removeEventListener('resize', checkDevice);
		}
	});

	function getThemeColor(theme: string) {
		switch (theme) {
			case 'light': return 'bg-blue-50 border-blue-200';
			case 'dark': return 'bg-gray-900 border-gray-700';
			case 'colorful': return 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200';
			default: return 'bg-gray-50 border-gray-200';
		}
	}
</script>

<svelte:head>
	<title>Wallpapers | Ismatulla Mansurov</title>
	<meta name="description" content="Beautiful wallpaper collections for desktop and mobile devices" />
</svelte:head>

<section
	class={cn("flex flex-col min-h-[calc(100vh-48px)] bg-background text-foreground px-4 md:px-6 lg:px-8 max-w-full overflow-x-hidden")}
	in:fade={{ duration: 300 }}
>
	<div class="max-w-7xl mx-auto w-full py-8">
		<div class="text-center space-y-4 mb-12">
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight">Wallpapers</h1>
			<p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
				Curated collections of beautiful wallpapers for your devices
			</p>
		</div>
		
		{#if wallpapers && wallpapers.length > 0}
			<div class="grid gap-8 md:gap-12">
				{#each wallpapers as pack}
					<article class="group">
						<div class={cn("p-6 md:p-8 rounded-2xl border transition-all duration-300 group-hover:shadow-lg", getThemeColor(pack.theme))}>
							<div class="grid lg:grid-cols-2 gap-8 items-center">
								<!-- Pack Info -->
								<div class="space-y-6 order-2 lg:order-1">
									<div class="space-y-3">
										<h2 class="text-2xl md:text-3xl font-semibold">
											{pack.name}
										</h2>
										<p class="text-lg text-muted-foreground">
											{pack.description}
										</p>
									</div>
									
									<!-- Tags -->
									<div class="flex flex-wrap gap-2">
										{#each pack.tags as tag}
											<span class="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full capitalize">
												{tag}
											</span>
										{/each}
									</div>

									<!-- Theme Badge -->
									<div class="flex items-center gap-2">
										<span class="text-sm text-muted-foreground">Theme:</span>
										<span class={cn(
											"px-2 py-1 text-xs font-medium rounded-full capitalize",
											pack.theme === 'light' ? 'bg-yellow-100 text-yellow-800' :
											pack.theme === 'dark' ? 'bg-gray-100 text-gray-800' :
											'bg-purple-100 text-purple-800'
										)}>
											{pack.theme}
										</span>
									</div>

									<!-- Download info -->
									<div class="text-sm text-muted-foreground">
										<p>Available for desktop (2560x1600) and mobile (1080x1920)</p>
									</div>
								</div>
								
								<!-- Device Previews -->
								<div class="flex justify-center items-center gap-6 order-1 lg:order-2">
									{#if isMobile}
										<!-- Mobile: Show only iPhone -->
										<DeviceFrame 
											type="iphone" 
											wallpaperUrl={pack.mobile_wallpaper} 
											alt="{pack.name} mobile wallpaper"
										/>
									{:else}
										<!-- Desktop: Show both MacBook and iPhone -->
										<DeviceFrame 
											type="macbook" 
											wallpaperUrl={pack.desktop_wallpaper} 
											alt="{pack.name} desktop wallpaper"
										/>
										<DeviceFrame 
											type="iphone" 
											wallpaperUrl={pack.mobile_wallpaper} 
											alt="{pack.name} mobile wallpaper"
										/>
									{/if}
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div class="text-center py-16">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
					<svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
					</svg>
				</div>
				<h2 class="text-2xl font-semibold mb-2">No Wallpapers Yet</h2>
				<p class="text-muted-foreground">Wallpaper collections will be available here soon.</p>
			</div>
		{/if}
	</div>
</section>