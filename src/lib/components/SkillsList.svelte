<script>
    export let skills = [];
    import { fly } from 'svelte/transition';
</script>

<ul class="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {#each skills as skill, i}
        <li
                in:fly="{{ y: 20, duration: 300, delay: i * 50 }}"
                class="bg-muted px-3 py-1 rounded-md text-sm transform transition-all duration-200 hover:scale-105 hover:bg-primary hover:text-primary-foreground cursor-default"
        >
            {skill}
        </li>
    {/each}
</ul>
