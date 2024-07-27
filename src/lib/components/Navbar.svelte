<script lang="ts">
	import * as Menubar from "$lib/components/ui/menubar";
	import { cn } from "$lib/utils";
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DarkModeToggle from './DarkMode.svelte';
	import logoLight from '$lib/assets/logo.png';
	import logoDark from '$lib/assets/logo_dark.png';
	$: currentPath = $page.url.pathname;

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
</script>

<Menubar.Root class={cn("flex items-center justify-between h-[48px] px-4 bg-background")}>
	<img
			alt="The project logo"
			src={logoLight}
			class="h-full lg:ml-2 md:ml-1 object-contain dark:hidden cursor-pointer"
			on:click={goToHome}
	/>
	<img
			alt="The project logo"
			src={logoDark}
			class="h-full lg:ml-2 md:ml-1 object-contain hidden dark:block cursor-pointer"
			on:click={goToHome}
	/>
	<Menubar.Menu>
		<div class="flex items-center space-x-6">
			{#each menuItems as item}
				<Menubar.Item
						on:click={() => goto(item.path)}
						class={cn(
                    "text-sm font-medium hover:text-green-500 transition-colors",
                    currentPath === item.path ? "text-green-500" : "text-white-700"
                )}
				>
					{item.name}
				</Menubar.Item>
			{/each}
			<DarkModeToggle />
		</div>
	</Menubar.Menu>
</Menubar.Root>
