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

    function updateTheme(isDark) {
        setDarkMode(isDark);
        localStorage.removeItem('theme'); // Remove user preference to follow system
    }

    onMount(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme) {
            // User has a preference, use it
            setDarkMode(storedTheme === 'dark');
        } else {
            // No user preference, follow system
            updateTheme(mediaQuery.matches);
        }

        // Listen for system theme changes
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                updateTheme(e.matches);
            }
        });
    });
</script>

<div class="flex items-center gap-3 px-4 py-2 rounded-full">
    <Sun class="w-5 h-5 transition-all duration-300 {$darkMode ? 'opacity-50 scale-75' : 'opacity-100 scale-100'}" />
    <Switch on:click={toggleDarkMode} checked={$darkMode} class="data-[state=checked]:bg-primary/50 data-[state=unchecked]:bg-secondary/50 backdrop-blur-xl"/>
    <Moon class="w-5 h-5 transition-all duration-300 {$darkMode ? 'opacity-100 scale-100' : 'opacity-50 scale-75'}" />
</div>
