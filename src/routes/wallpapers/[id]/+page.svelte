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
    let images: Array<{ 
        mobile: string; 
        desktop: string; 
        name: string;
        mobilePreview: string;
        desktopPreview: string;
    }> = [];
    let loading = true;
    let currentIndex = 0;

    onMount(async () => {
        if (wallpaper.id === 'timpanogos-trip') {
            await loadWallpapers();
        } else {
            // For other wallpaper packs, add some dummy data for testing
            images = [];
        }
        loading = false;
    });

    function getPreviewUrl(originalUrl: string, type: 'mobile' | 'desktop'): string {
        // Replace with WebP preview versions
        const urlParts = originalUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const baseName = filename.replace('_Mobile.jpg', '').replace('_Desktop.jpg', '').replace('_desktop.jpg', '');
        const previewFilename = `${baseName}_${type === 'mobile' ? 'Mobile' : 'Desktop'}_preview.webp`;
        return originalUrl.replace(filename, previewFilename);
    }

    async function loadWallpapers() {
        console.log('Starting to load wallpapers...');
        
        // Use the actual file names from your bucket
        const baseUrl = 'https://wallapappers.mansurov.dev/wallpapers/timpTrip/';
        const wallpaperData = [
            { name: 'Summit', desktop: `${baseUrl}Summit_Desktop.jpg`, mobile: `${baseUrl}Summit_Mobile.jpg` },
            { name: 'Almost', desktop: `${baseUrl}Almost_Desktop.jpg`, mobile: `${baseUrl}Almost_Mobile.jpg` },
            { name: 'Desolate', desktop: `${baseUrl}Desolate_Desktop.jpg`, mobile: `${baseUrl}Desolate_Mobile.jpg` },
            { name: 'Giant', desktop: `${baseUrl}Giant_desktop.jpg`, mobile: `${baseUrl}Giant_Mobile.jpg` },
            { name: 'God', desktop: `${baseUrl}God_Desktop.jpg`, mobile: `${baseUrl}God_Mobile.jpg` },
            { name: 'Landscape', desktop: `${baseUrl}Landscape_Desktop.jpg`, mobile: `${baseUrl}Landscape_Mobile.jpg` },
            { name: 'Timp Lush', desktop: `${baseUrl}Timp_Lush_Desktop.jpg`, mobile: `${baseUrl}Timp_Lush_Mobile.jpg` }
        ];
        
        // Create optimized versions for preview and keep originals for download
        const wallpaperImages = wallpaperData.map(item => ({
            name: item.name,
            desktop: item.desktop,
            mobile: item.mobile,
            // Optimized WebP versions for preview (much smaller file sizes)
            desktopPreview: getPreviewUrl(item.desktop, 'desktop'),
            mobilePreview: getPreviewUrl(item.mobile, 'mobile')
        }));
        
        console.log('Loading wallpapers with WebP preview optimization:', wallpaperImages);
        images = wallpaperImages;
        return;
        
        // Original logic commented out for now
        /*
        try {
            const baseUrl = 'https://wallapappers.mansurov.dev/wallpapers/timpTrip/';
            const knownImages = ['Almost', '1', '2', '3', '4', '5'];
            
            console.log('Loading wallpapers from:', baseUrl);
            const loadedImages = [];
            
            for (const imageName of knownImages) {
                const desktopUrl = `${baseUrl}${imageName}_Desktop.jpg`;
                const mobileUrl = `${baseUrl}${imageName}_Mobile.jpg`;
                
                console.log(`Checking: ${desktopUrl} and ${mobileUrl}`);
                
                try {
                    const [desktopCheck, mobileCheck] = await Promise.all([
                        fetch(desktopUrl, { method: 'HEAD' }),
                        fetch(mobileUrl, { method: 'HEAD' })
                    ]);
                    
                    console.log(`${imageName}: Desktop ${desktopCheck.status}, Mobile ${mobileCheck.status}`);
                    
                    if (desktopCheck.ok && mobileCheck.ok) {
                        loadedImages.push({
                            name: imageName,
                            desktop: desktopUrl,
                            mobile: mobileUrl
                        });
                    }
                } catch (error) {
                    console.log(`Error checking ${imageName}:`, error);
                }
            }
            
            console.log('Final loaded images:', loadedImages);
            images = loadedImages;
        } catch (error) {
            console.error('Failed to load wallpapers:', error);
        }
        */
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prevImage() {
        currentIndex =
            currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    }

    let downloadingMobile = false;
    let downloadingDesktop = false;

    function triggerDownload(url: string, filename: string, onDone: () => void) {
        const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
        // Use a hidden iframe to trigger the download without navigating the page.
        // The endpoint returns a 302 redirect to a pre-signed R2 URL
        // with Content-Disposition: attachment, so the browser downloads directly from R2.
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = downloadUrl;
        document.body.appendChild(iframe);
        setTimeout(() => {
            document.body.removeChild(iframe);
            onDone();
        }, 5000);
    }

    function downloadMobile() {
        const current = images[currentIndex];
        if (!current || downloadingMobile) return;
        downloadingMobile = true;
        triggerDownload(current.mobile, `${current.name}_Mobile.jpg`, () => { downloadingMobile = false; });
    }

    function downloadDesktop() {
        const current = images[currentIndex];
        if (!current || downloadingDesktop) return;
        downloadingDesktop = true;
        triggerDownload(current.desktop, `${current.name}_Desktop.jpg`, () => { downloadingDesktop = false; });
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
                            imageUrl={currentImage.mobilePreview}
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
                            imageUrl={currentImage.mobilePreview}
                            alt="{currentImage.name} mobile wallpaper"
                        />
                    </div>

                    <button
                        on:click={downloadMobile}
                        disabled={downloadingMobile}
                        class="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {#if downloadingMobile}
                            <div class="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                            Downloading...
                        {:else}
                            <Download class="w-4 h-4" />
                            Download
                        {/if}
                    </button>
                </div>

                <div class="hidden md:flex flex-col items-center relative">
                    <h3 class="text-sm font-medium text-muted-foreground">
                        Desktop
                    </h3>

                    <MacBookFrame
                        imageUrl={currentImage.desktopPreview}
                        alt="{currentImage.name} desktop wallpaper"
                    />

                    <button
                        on:click={downloadDesktop}
                        disabled={downloadingDesktop}
                        class="absolute bottom-8 flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium z-[24] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {#if downloadingDesktop}
                            <div class="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                            Downloading...
                        {:else}
                            <Download class="w-4 h-4" />
                            Download Desktop
                        {/if}
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
                                src={image.mobilePreview}
                                alt="Thumbnail {index + 1}"
                                class="w-full h-full object-cover loading-lazy"
                                loading="lazy"
                            />
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
        {/if}
    </div>
</section>
