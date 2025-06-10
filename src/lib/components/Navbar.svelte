<script lang="ts">
	import * as Menubar from "$lib/components/ui/menubar";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Menu } from 'lucide-svelte';
	import { cn } from "$lib/utils";
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import logoLight from '$lib/assets/logo.png';
	import logoDark from '$lib/assets/logo_dark.png';
	import { onMount } from 'svelte';
	
	$: currentPath = $page.url.pathname;
	
	let scrollY = 0;
	let navElement: HTMLElement;
	let isScrolled = false;
	
	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
			isScrolled = scrollY > 20;
		};
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const menuItems = [
		{ name: "About", path: "/about" },
		{ name: "Blog", path: "/blog" },
		{ name: "Projects", path: "/projects" },
		{ name: "Hire Me", path: "/hireme" },
		{ name: "Contact Me", path: "/contact" }
	];

	function goToHome() {
		goto('/about');
	}
	function handleKeyDown(event: { key: string; }) {
		if (event.key === 'Enter' || event.key === ' ') {
			goToHome();
		}
	}
</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap');
	
	.bismillah {
		font-family: 'Noto Nastaliq Urdu', serif;
		font-size: 0.875rem;
		font-weight: 700;
		height: 100%;
		margin: 0;
		white-space: nowrap;
		text-align: center;
		flex-shrink: 0;
		color: #666;
		position: relative;
		margin-left: auto;
		padding-right: 0.5rem;
		display: flex;
		align-items: center;
		transform: translateY(-2px); /* Fine-tune vertical alignment */
	}

	@media (min-width: 1024px) {
		.bismillah {
			font-size: 1rem;
			position: absolute;
			left: 50%;
			transform: translate(-50%, -2px);
			padding-right: 0;
		}
	}

	@media (min-width: 640px) and (max-width: 1023px) {
		.bismillah {
			display: none;
		}
	}

	:global(.dark) .bismillah {
		color: #999;
	}

	.nav-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: 0.5rem;
		position: relative;
		height: 100%;
	}

	.menu-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-shrink: 1;
		min-width: 0;
		z-index: 1;
		height: 100%;
	}

	.menu-items {
		display: flex;
		align-items: center;
		gap: 4;
		z-index: 1;
		height: 100%;
	}

	.right-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		z-index: 1;
	}
</style>

<Menubar.Root 
	bind:this={navElement}
	class={cn(
		"flex items-center px-2 lg:px-4 w-full glass-nav glass-layers sticky top-0 z-50 liquid-morph transition-all duration-500",
		isScrolled ? "h-[56px] shadow-lg" : "h-[64px]"
	)}>
	<div class="nav-container">
		<div class="menu-container">
			<div class="sm:hidden">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class="glass-button glass-layers p-2 glass-refract">
						<Menu size={20} />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="glass-modal mt-2">
						{#each menuItems as item}
							<DropdownMenu.Item
									on:click={() => goto(item.path)}
									class={cn(
							"text-sm font-medium transition-colors liquid-morph glass-refract",
							currentPath === item.path ? "text-green-500 glass-button" : "hover:glass-button"
						)}
							>
								{item.name}
								{#if currentPath === item.path}
									<span class="ml-2">•</span>
								{/if}
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<a href="/about" on:click|preventDefault={goToHome} on:keydown={handleKeyDown} class="h-[32px]">
				<img
						alt="The project logo"
						src={logoLight}
						class="h-full w-auto object-contain dark:hidden"
				/>
				<img
						alt="The project logo"
						src={logoDark}
						class="h-full w-auto object-contain hidden dark:block"
				/>
			</a>
		</div>

		<div class="bismillah">﷽</div>

		<div class="right-section">
			<div class="hidden sm:flex items-center gap-4">
				{#each menuItems as item}
					<a
							href={item.path}
							on:click|preventDefault={() => goto(item.path)}
							class={cn(
							"text-sm font-medium hover:text-green-500 transition-colors px-3 py-1.5 rounded-lg liquid-morph glass-refract glass-layers glass-prism",
							currentPath === item.path ? "text-green-500 glass-button" : "text-white-700 hover:glass-button"
						)}
					>
						{item.name}
					</a>
				{/each}
			</div>
		</div>
	</div>
</Menubar.Root>
