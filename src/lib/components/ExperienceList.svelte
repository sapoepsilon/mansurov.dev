<script>
    export let experiences = [];
    import { slide } from 'svelte/transition';
</script>

<div class="space-y-4">
    {#each experiences as experience, i}
        <div
                transition:slide="{{ duration: 300, delay: i * 100 }}"
                class="p-4 rounded-lg bg-card hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
        >
            <h3 class="font-medium text-lg">{experience.title}</h3>
            <p class="text-muted-foreground">{experience.company} - {experience.period}</p>
            <p class="text-sm text-muted-foreground mt-2">{experience.description}</p>
        </div>
    {/each}
</div>
