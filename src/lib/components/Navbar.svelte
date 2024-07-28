<script lang="ts">
	import * as Menubar from "$lib/components/ui/menubar";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Menu } from 'lucide-svelte';
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
	function handleKeyDown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			goToHome();
		}
	}
</script>

<Menubar.Root class="flex items-center justify-between h-[48px] px-4 bg-background w-full">
	<div class="flex items-center">
		<div class="sm:hidden mr-4">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger><Menu size={24} /></DropdownMenu.Trigger>
				<DropdownMenu.Content>
					{#each menuItems as item}
						<DropdownMenu.Item on:click={() => goto(item.path)}>{item.name}</DropdownMenu.Item>
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
	<div class="hidden sm:flex items-center space-x-6">
		{#each menuItems as item}
			<a
					href={item.path}
					on:click|preventDefault={() => goto(item.path)}
					class={cn(
                    "text-sm font-medium hover:text-green-500 transition-colors",
                    currentPath === item.path ? "text-green-500" : "text-white-700"
                )}
			>
				{item.name}
			</a>
		{/each}
		<DarkModeToggle />
	</div>
</Menubar.Root>
