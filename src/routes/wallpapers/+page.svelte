<script lang="ts">
    import { fade } from "svelte/transition";
    import { cn } from "$lib/utils.js";

    export let data;

    const { wallpapers } = data;
</script>

<svelte:head>
    <title>Wallpapers | Ismatulla Mansurov</title>
    <meta
        name="description"
        content="Beautiful wallpaper collections for desktop and mobile devices"
    />
</svelte:head>

<section
    class={cn(
        "flex flex-col min-h-[calc(100vh-48px)] bg-background text-foreground px-4 md:px-6 lg:px-8 max-w-full overflow-x-hidden",
    )}
    in:fade={{ duration: 300 }}
>
    <div class="max-w-7xl mx-auto w-full py-8">
        <div class="text-center space-y-4 mb-12">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
                Wallpapers
            </h1>
            <p
                class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
                Curated collections of beautiful wallpapers for your devices
            </p>
        </div>

        {#if wallpapers && wallpapers.length > 0}
            <div class="grid gap-8 md:gap-12">
                {#each wallpapers as pack}
                    <article class="group">
                        <a href="/wallpapers/{pack.id}" class="block">
                            <div
                                class="relative p-6 md:p-8 h-[400px] sm:h-[900px] rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-primary/20"
                            >
                                <picture>
                                    <source
                                        media="(min-width: 768px)"
                                        srcset={pack.desktop_wallpaper}
                                    />
                                    <img
                                        src={pack.mobile_wallpaper}
                                        alt="{pack.name} wallpaper"
                                        class="absolute inset-0 w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </picture>
                                <!-- Dark overlay for better text readability -->
                                <div
                                    class="absolute inset-0 bg-black/60 group-hover:bg-primary/80 transition-colors duration-300"
                                ></div>
                                <div class="relative z-10">
                                    <!-- Pack Info -->
                                    <div class="space-y-6 text-center">
                                        <div class="space-y-3">
                                            <h2
                                                class="text-2xl md:text-3xl font-semibold text-white group-hover:text-green-500 transition-colors"
                                            >
                                                {pack.name}
                                            </h2>
                                            <p class="text-lg text-white/90">
                                                {pack.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </article>
                {/each}
            </div>
        {:else}
            <div class="text-center py-16">
                <div
                    class="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center"
                >
                    <svg
                        class="w-8 h-8 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-semibold mb-2">No Wallpapers Yet</h2>
                <p class="text-muted-foreground">
                    Wallpaper collections will be available here soon.
                </p>
            </div>
        {/if}
    </div>
</section>
