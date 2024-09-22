<script lang="ts">
    import {cn} from "$lib/utils";
    import {ChevronDown} from 'lucide-svelte';
    import {onMount} from 'svelte';
    import {Button} from "$lib/components/ui/button/index.js";

    let headline = "Ismatulla Mansurov";
    let subheadline = "I automate things";

    let experiences = [
        "Mobile/XR Developer at Viusbuilt: Working on a revolutionary app for architects and interior designers on Vision OS",
        "Web Developer at Viusbuilt: Building viusbuilt.com and app.viusbuilt.com, revolutionizing custom luxury construction building software",
        "iOS Developer at Sorenson Communications: Built and maintained their flagship apps for iOS"
    ];

    let interests = [
        "YouTuber discussing computer topics",
        "Avid snowboarder"
    ];

    let experienceSection: HTMLElement;

    function scrollToExperience() {
        experienceSection.scrollIntoView({behavior: 'smooth'});
    }

    onMount(() => {
        if (experienceSection) {
            experienceSection.style.marginTop = '100vh';
        }
    });
</script>

<section class={cn("flex flex-col items-center justify-center min-h-screen bg-background text-foreground")}>
    <div class="text-center p-4">
        <h1 class="text-4xl md:text-6xl lg:text-8xl font-bold mb-4">{headline}</h1>
        <p class="text-xl md:text-2xl text-muted-foreground mb-12">{subheadline}</p>

        <Button
                on:click={scrollToExperience}
        >
            <ChevronDown class="mr-2 h-4 w-4"/>
            About me
        </Button>
    </div>
</section>

<section bind:this={experienceSection}
         class="min-h-screen bg-background text-foreground p-4 flex flex-col justify-center">
    <div class="max-w-3xl mx-auto w-full space-y-8">
        <div class="bg-secondary/10 rounded-lg p-6">
            <h2 class="text-2xl font-semibold mb-4">Professional Experience</h2>
            <ul class="space-y-2">
                {#each experiences as experience}
                    <li class="text-muted-foreground">{experience}</li>
                {/each}
            </ul>
        </div>

        <div class="bg-secondary/10 rounded-lg p-6">
            <h2 class="text-2xl font-semibold mb-4">Personal Interests</h2>
            <ul class="space-y-2">
                {#each interests as interest}
                    <li class="text-muted-foreground">{interest}</li>
                {/each}
            </ul>
        </div>
    </div>
</section>
