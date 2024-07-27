<script lang="ts">
	import { onMount } from 'svelte';
	import { Moon, Sun } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { Switch } from "$lib/components/ui/switch";
	const darkMode = writable(false);

	function setDarkMode(isDark) {
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		}
		darkMode.set(isDark);
	}

	function toggleDarkMode() {
		darkMode.update(current => {
			const newValue = !current;
			setDarkMode(newValue);
			return newValue;
		});
	}

	onMount(() => {
		const isDarkMode = document.documentElement.classList.contains('dark');
		darkMode.set(isDarkMode);
	});
</script>
<Sun class="w-5 h-5 transition-transform duration-300 rotate-0" />
<Switch on:click={toggleDarkMode} checked={darkMode}/>
<Moon class="w-5 h-5 transition-transform duration-300 -rotate-90" />

