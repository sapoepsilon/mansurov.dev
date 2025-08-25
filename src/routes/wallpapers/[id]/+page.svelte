<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import {
        ArrowLeft,
        Download,
        ChevronLeft,
        ChevronRight,
        Monitor,
        Smartphone,
    } from "lucide-svelte";
    import IPhoneFrame from "$lib/components/ui/iPhoneFrame.svelte";
    import MacBookFrame from "@/components/ui/MacBookFrame.svelte";

    export let data;

    const { wallpaper } = data;
    let images: Array<{ mobile: string; desktop: string; name: string }> = [];
    let loading = true;
    let currentIndex = 0;

    onMount(async () => {
        if (wallpaper.id === 'timpanogos-trip') {
            await loadWallpapers();
        }
        loading = false;
    });

    async function loadWallpapers() {
        try {
            // Since we know the file naming pattern, let's try a few known images
            const baseUrl = 'https://wallapappers.mansurov.dev/wallpapers/timpTrip/';
            const knownImages = [
                'Almost', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
            ];
            
            const loadedImages = [];
            
            for (const imageName of knownImages) {
                const desktopUrl = `${baseUrl}${imageName}_Desktop.jpg`;
                const mobileUrl = `${baseUrl}${imageName}_Mobile.jpg`;
                
                try {
                    // Check if both images exist by making HEAD requests
                    const [desktopCheck, mobileCheck] = await Promise.all([
                        fetch(desktopUrl, { method: 'HEAD' }),
                        fetch(mobileUrl, { method: 'HEAD' })
                    ]);
                    
                    if (desktopCheck.ok && mobileCheck.ok) {
                        loadedImages.push({
                            name: imageName,
                            desktop: desktopUrl,
                            mobile: mobileUrl
                        });
                    }
                } catch {
                    // Skip this image if it doesn't exist
                    continue;
                }
            }
            
            images = loadedImages;
        } catch (error) {
            console.error('Failed to load wallpapers:', error);
        }
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prevImage() {
        currentIndex =
            currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    }

    function downloadImage(url: string, filename: string) {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function downloadMobile() {
        const current = images[currentIndex];
        if (!current) return;
        downloadImage(current.mobile, `${current.name}_Mobile.jpg`);
    }

    function downloadDesktop() {
        const current = images[currentIndex];
        if (!current) return;
        downloadImage(current.desktop, `${current.name}_Desktop.jpg`);
    }

    $: currentImage = images[currentIndex];
</script>

<svelte:head>
    <title>{wallpaper.name} - Wallpapers | Ismatulla Mansurov</title>
    <meta name="description" content={wallpaper.description} />
</svelte:head>

<section class="overflow-y-auto" in:fade={{ duration: 300 }}>
    <div class="mx-auto w-full py-8 pl-4 flex flex-col">
        <!-- Back Button -->
        <div class="mb-2">
            <a
                href="/wallpapers"
                class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft class="w-4 h-4" />
                Back to Wallpapers
            </a>
            <h1
                class="text-xl md:text-2xl font-bold tracking-tight text-center pt-1"
            >
                {wallpaper.name}
            </h1>
        </div>

        <div class="text-center">
            <p class="text-sm text-muted-foreground">
                {wallpaper.description}
            </p>
        </div>

        {#if loading}
            <div class="flex justify-center items-center py-20">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p class="text-muted-foreground">Loading wallpapers...</p>
                </div>
            </div>
        {:else if images.length === 0}
            <div class="flex justify-center items-center py-20">
                <p class="text-muted-foreground">No wallpapers available for this collection.</p>
            </div>
        {:else}

        <!-- Carousel Navigation -->
        {#if images.length > 1}
            <div class="hidden md:flex items-center justify-center gap-4">
                <button
                    on:click={prevImage}
                    class="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                    aria-label="Previous image"
                >
                    <ChevronLeft class="w-5 h-5" />
                </button>

                <div class="text-sm text-muted-foreground">
                    {currentIndex + 1} of {images.length}
                    {#if currentImage.name}
                        - {currentImage.name}
                    {/if}
                </div>

                <button
                    on:click={nextImage}
                    class="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                    aria-label="Next image"
                >
                    <ChevronRight class="w-5 h-5" />
                </button>
            </div>
        {/if}

        <!-- Device Previews -->
        <div class="flex justify-center">
            <div class="flex flex-col md:flex-row">
                <div class="flex flex-col items-center">
                    <h3 class="text-sm font-medium text-muted-foreground">
                        Mobile
                    </h3>

                    <!-- Mobile Carousel Navigation with iPhone Frame -->
                    <div class="md:hidden flex items-center gap-4">
                        {#if images.length > 1}
                            <button
                                on:click={prevImage}
                                class="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                                aria-label="Previous image"
                            >
                                <ChevronLeft class="w-5 h-5" />
                            </button>
                        {/if}

                        <IPhoneFrame
                            imageUrl={currentImage.mobile}
                            alt="{currentImage.name} mobile wallpaper"
                        />

                        {#if images.length > 1}
                            <button
                                on:click={nextImage}
                                class="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                                aria-label="Next image"
                            >
                                <ChevronRight class="w-5 h-5" />
                            </button>
                        {/if}
                    </div>

                    <!-- Desktop iPhone Frame -->
                    <div class="hidden md:block">
                        <IPhoneFrame
                            imageUrl={currentImage.mobile}
                            alt="{currentImage.name} mobile wallpaper"
                        />
                    </div>

                    <button
                        on:click={downloadMobile}
                        class="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium mt-6"
                    >
                        <Download class="w-4 h-4" />
                        Download
                    </button>
                </div>

                <div class="hidden md:flex flex-col items-center relative">
                    <h3 class="text-sm font-medium text-muted-foreground">
                        Desktop
                    </h3>

                    <MacBookFrame
                        imageUrl={currentImage.desktop}
                        alt="{currentImage.name} desktop wallpaper"
                    />

                    <button
                        on:click={downloadDesktop}
                        class="absolute bottom-8 flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium z-[24]"
                    >
                        <Download class="w-4 h-4" />
                        Download Desktop
                    </button>
                </div>
            </div>
        </div>

        <!-- Thumbnail Navigation -->
        {#if images.length > 1}
            <div class="flex justify-center mt-8">
                <div class="flex gap-2 overflow-x-auto pb-2">
                    {#each images as image, index}
                        <button
                            on:click={() => (currentIndex = index)}
                            class="flex-shrink-0 w-16 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 {index ===
                            currentIndex
                                ? 'border-primary'
                                : 'border-transparent hover:border-muted-foreground/50'}"
                        >
                            <img
                                src={image.mobile}
                                alt="Thumbnail {index + 1}"
                                class="w-full h-full object-cover"
                            />
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
        {/if}
    </div>
</section>
